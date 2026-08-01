import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'
import { config } from './config.js'
import {
  createSession,
  deleteSession,
  findSession,
  provisionUser,
  type Session,
} from './database.js'
import { HttpError } from './errors.js'
import { CsrfResponse, UserResponse } from './schemas.js'

declare module 'fastify' {
  interface FastifyRequest {
    currentSession?: Session
  }
}

const SESSION_COOKIE = 'publications_session'
const OAUTH_COOKIE = 'publications_oauth'
const CSRF_HEADER = 'x-xsrf-token'

type OAuthTransaction = {
  state: string
  verifier: string
}

type GoogleProfile = {
  sub?: string
  email?: string
  email_verified?: boolean
  name?: string
}

const cookieOptions = ({ maxAge }: { maxAge: number }) => ({
  path: '/',
  httpOnly: true,
  secure: config.secureCookies,
  sameSite: 'lax' as const,
  signed: true,
  maxAge,
})

const readSignedCookie = ({
  request,
  name,
}: {
  request: FastifyRequest
  name: string
}): string | undefined => {
  const cookie = request.cookies[name]
  if (!cookie) {
    return undefined
  }
  const unsigned = request.unsignCookie(cookie)
  return unsigned.valid ? unsigned.value : undefined
}

export const authenticate = async (request: FastifyRequest): Promise<void> => {
  const token = readSignedCookie({ request, name: SESSION_COOKIE })
  if (!token) {
    throw new HttpError({ statusCode: 401, message: 'Authentication is required.' })
  }
  const session = await findSession({ token })
  if (!session) {
    throw new HttpError({ statusCode: 401, message: 'The session has expired.' })
  }
  request.currentSession = session
}

export const verifyCsrf = async (request: FastifyRequest): Promise<void> => {
  await authenticate(request)
  const supplied = request.headers[CSRF_HEADER]
  const expected = request.currentSession!.csrfToken
  if (typeof supplied !== 'string') {
    throw new HttpError({ statusCode: 403, message: 'A CSRF token is required.' })
  }
  const suppliedBytes = Buffer.from(supplied)
  const expectedBytes = Buffer.from(expected)
  if (
    suppliedBytes.length !== expectedBytes.length ||
    !timingSafeEqual(suppliedBytes, expectedBytes)
  ) {
    throw new HttpError({ statusCode: 403, message: 'The CSRF token is invalid.' })
  }
}

const requireSession = ({ request }: { request: FastifyRequest }): Session => {
  if (!request.currentSession) {
    throw new HttpError({ statusCode: 401, message: 'Authentication is required.' })
  }
  return request.currentSession
}

const authorizationUrl = ({ transaction }: { transaction: OAuthTransaction }): string => {
  const challenge = createHash('sha256').update(transaction.verifier).digest('base64url')
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', config.googleClientId)
  url.searchParams.set('redirect_uri', config.googleRedirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid profile email')
  url.searchParams.set('state', transaction.state)
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  return url.toString()
}

const exchangeCode = async ({
  code,
  verifier,
}: {
  code: string
  verifier: string
}): Promise<string> => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      redirect_uri: config.googleRedirectUri,
      grant_type: 'authorization_code',
      code_verifier: verifier,
    }),
  })
  if (!response.ok) {
    throw new Error(`Google rejected the authorization code (${response.status}).`)
  }
  const token = (await response.json()) as { access_token?: string }
  if (!token.access_token) {
    throw new Error('Google did not provide an access token.')
  }
  return token.access_token
}

const fetchGoogleProfile = async ({
  accessToken,
}: {
  accessToken: string
}): Promise<GoogleProfile> => {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    throw new Error(`Google user information failed (${response.status}).`)
  }
  return response.json() as Promise<GoogleProfile>
}

const frontendFailureUrl = () => {
  const url = new URL(config.frontendUrl)
  url.searchParams.set('auth', 'failed')
  return url.toString()
}

export const registerAuthRoutes = async ({ app }: { app: FastifyInstance }): Promise<void> => {
  app.get('/oauth2/authorization/google', async (_request, reply) => {
    const transaction: OAuthTransaction = {
      state: randomBytes(32).toString('base64url'),
      verifier: randomBytes(48).toString('base64url'),
    }
    reply.setCookie(
      OAUTH_COOKIE,
      Buffer.from(JSON.stringify(transaction)).toString('base64url'),
      cookieOptions({ maxAge: 10 * 60 }),
    )
    return reply.redirect(authorizationUrl({ transaction }))
  })

  app.get<{ Querystring: { code?: string; state?: string; error?: string } }>(
    '/login/oauth2/code/google',
    async (request, reply) => {
      try {
        if (request.query.error || !request.query.code || !request.query.state) {
          throw new Error('Google authorization was not completed.')
        }
        const encoded = readSignedCookie({ request, name: OAUTH_COOKIE })
        if (!encoded) {
          throw new Error('The OAuth transaction cookie is missing or invalid.')
        }
        const transaction = JSON.parse(
          Buffer.from(encoded, 'base64url').toString(),
        ) as OAuthTransaction
        if (transaction.state !== request.query.state) {
          throw new Error('The OAuth state did not match.')
        }

        const accessToken = await exchangeCode({
          code: request.query.code,
          verifier: transaction.verifier,
        })
        const profile = await fetchGoogleProfile({ accessToken })
        if (!profile.sub || !profile.email || profile.email_verified !== true) {
          throw new Error('Google did not provide a verified identity.')
        }
        const user = await provisionUser({
          subject: profile.sub,
          email: profile.email,
          name: profile.name?.trim() || profile.email,
        })
        const token = randomBytes(32).toString('base64url')
        await createSession({ token, csrfToken: randomBytes(32).toString('hex'), userId: user.id })
        reply.clearCookie(OAUTH_COOKIE, cookieOptions({ maxAge: 0 }))
        reply.setCookie(SESSION_COOKIE, token, cookieOptions({ maxAge: 7 * 24 * 60 * 60 }))
        return reply.redirect(config.frontendUrl)
      } catch (error) {
        request.log.warn({ err: error }, 'Google OAuth login failed')
        reply.clearCookie(OAUTH_COOKIE, cookieOptions({ maxAge: 0 }))
        return reply.redirect(frontendFailureUrl())
      }
    },
  )

  app.get(
    '/api/auth/current-user-identity',
    {
      preHandler: authenticate,
      schema: { response: { 200: Type.Ref(UserResponse) } },
    },
    async (request) => {
      const { user } = requireSession({ request })
      return { id: user.id, name: user.name, email: user.email }
    },
  )

  app.get(
    '/api/auth/csrf',
    {
      preHandler: authenticate,
      schema: { response: { 200: Type.Ref(CsrfResponse) } },
    },
    async (request) => ({
      headerName: 'X-XSRF-TOKEN' as const,
      token: requireSession({ request }).csrfToken,
    }),
  )

  app.post('/api/auth/logout', { preHandler: verifyCsrf }, async (request, reply) => {
    const token = readSignedCookie({ request, name: SESSION_COOKIE })
    if (token) {
      await deleteSession({ token })
    }
    reply.clearCookie(SESSION_COOKIE, cookieOptions({ maxAge: 0 }))
    return reply.code(204).send()
  })
}
