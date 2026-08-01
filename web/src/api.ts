import { QueryClient } from '@tanstack/react-query'
import createFetchClient, { type Middleware } from 'openapi-fetch'
import createQueryClient from 'openapi-react-query'
import type { paths } from './generated/api'

type CsrfToken = {
  headerName: string
  token: string
}

export class ApiError extends Error {
  readonly status: number

  constructor({ message, status }: { message: string; status: number }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let csrfTokenPromise: Promise<CsrfToken> | null = null

const middleware: Middleware = {
  async onRequest({ request }) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return
    }

    const csrf = await loadCsrfToken()
    const headers = new Headers(request.headers)
    headers.set(csrf.headerName, csrf.token)
    return new Request(request, { headers })
  },
  onResponse({ response }) {
    if (response.ok) {
      return
    }
    throw new ApiError({
      message: response.statusText || 'Unable to complete this request',
      status: response.status,
    })
  },
}

export const fetchClient = createFetchClient<paths>({ credentials: 'include' })
fetchClient.use(middleware)

export const api = createQueryClient(fetchClient)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

async function loadCsrfToken() {
  csrfTokenPromise ??= fetch('/api/auth/csrf', { credentials: 'include' })
    .then(async (response) => {
      if (!response.ok) {
        throw new ApiError({ message: 'Unable to prepare this action', status: response.status })
      }
      return response.json() as Promise<CsrfToken>
    })
    .catch((error: unknown) => {
      csrfTokenPromise = null
      throw error
    })
  return csrfTokenPromise
}
