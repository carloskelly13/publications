import 'dotenv/config'

const required = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required.`)
  return value
}

const boolean = ({ name, fallback }: { name: string; fallback: boolean }): boolean => {
  const value = process.env[name]
  return value === undefined ? fallback : value === 'true'
}

export const config = {
  get databaseUrl() {
    const raw = required('DATABASE_URL').replace(/^jdbc:/, '')
    const url = new URL(raw)
    if (!url.username && process.env.DATABASE_USER) url.username = process.env.DATABASE_USER
    if (!url.password && process.env.DATABASE_PASSWORD) url.password = process.env.DATABASE_PASSWORD
    return url.toString()
  },
  get googleClientId() {
    return required('GOOGLE_CLIENT_ID')
  },
  get googleClientSecret() {
    return required('GOOGLE_CLIENT_SECRET')
  },
  get googleRedirectUri() {
    return process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:4004/login/oauth2/code/google'
  },
  get frontendUrl() {
    return process.env.FRONTEND_URL ?? 'http://localhost:5173'
  },
  get corsAllowedOrigin() {
    return process.env.CORS_ALLOWED_ORIGIN ?? 'http://localhost:5173'
  },
  get sessionSecret() {
    const secret = required('SESSION_SECRET')
    if (secret.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters.')
    return secret
  },
  get secureCookies() {
    return boolean({ name: 'SESSION_COOKIE_SECURE', fallback: process.env.NODE_ENV === 'production' })
  },
  port: Number(process.env.PORT ?? 4004),
}
