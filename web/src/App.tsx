import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { DocumentHome } from './components/DocumentHome'
import { EditorPage } from './components/EditorPage'
import { AuthenticatedLayout } from './components/AuthenticatedLayout'
import { PublicationsLogo } from './components/PublicationsLogo'
import type { User } from './types'

type AuthState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; user: User }
  | { status: 'error'; message: string }

function App() {
  const [auth, setAuth] = useState<AuthState>({ status: 'loading' })
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('auth') === 'failed') {
      window.history.replaceState({}, '', window.location.pathname)
      setAuth({ status: 'error', message: 'Google sign-in was not completed. Please try again.' })
      return
    }

    const controller = new AbortController()
    fetch('/api/auth/current-user-identity', { credentials: 'include', signal: controller.signal })
      .then(async (response) => {
        if (response.status === 401) {
          setAuth({ status: 'signed-out' })
          return
        }
        if (!response.ok) throw new Error('Unable to check your session.')
        setAuth({ status: 'signed-in', user: (await response.json()) as User })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setAuth({
          status: 'error',
          message: error instanceof Error ? error.message : 'Something went wrong.',
        })
      })
    return () => controller.abort()
  }, [])

  const login = () => window.location.assign('/oauth2/authorization/google')

  const logout = async () => {
    setLoggingOut(true)
    try {
      const csrfResponse = await fetch('/api/auth/csrf', { credentials: 'include' })
      if (!csrfResponse.ok) throw new Error('Unable to prepare sign out.')
      const csrf = (await csrfResponse.json()) as { headerName: string; token: string }
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { [csrf.headerName]: csrf.token },
      })
      if (!response.ok) throw new Error('Unable to sign out.')
      setAuth({ status: 'signed-out' })
    } catch (error) {
      setAuth({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unable to sign out.',
      })
    } finally {
      setLoggingOut(false)
    }
  }

  if (auth.status === 'signed-in') {
    return (
      <AuthenticatedLayout user={auth.user} loggingOut={loggingOut} onLogout={logout}>
        <Routes>
          <Route path="/" element={<DocumentHome />} />
          <Route path="/documents/:documentId/edit" element={<EditorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthenticatedLayout>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-10 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <section
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
        aria-live="polite"
      >
        <PublicationsLogo className="mx-auto mb-4 size-12" size={48} />
        <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Publications</p>

        {auth.status === 'loading' && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">Opening your workspace</h1>
            <div
              className="mx-auto mt-8 size-7 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600 dark:border-gray-700 dark:border-t-violet-400"
              role="status"
              aria-label="Checking sign-in status"
            />
          </>
        )}

        {auth.status === 'signed-out' && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Create and manage your publications.
            </p>
            <button
              className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              type="button"
              onClick={login}
            >
              <span className="grid size-5 place-items-center rounded-full bg-white text-xs font-bold text-violet-600" aria-hidden="true">G</span>
              Continue with Google
            </button>
          </>
        )}

        {auth.status === 'error' && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">We hit a snag.</h1>
            <p className="mt-3 text-sm leading-6 text-red-600">{auth.message}</p>
            <button
              className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </>
        )}
      </section>
      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        A modern home for page layout and print design.
      </p>
    </main>
  )
}

export default App
