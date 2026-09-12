import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { ApiError, api } from './api'
import { AuthenticatedLayout } from './components/AuthenticatedLayout'
import { DocumentHome } from './components/DocumentHome'
import { EditorPage } from './components/EditorPage'
import { PublicationsLogo } from './components/PublicationsLogo'

function App() {
  const [authFailure, setAuthFailure] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('auth') === 'failed'
      ? 'Google sign-in was not completed. Please try again.'
      : null,
  )
  const [signedOut, setSignedOut] = useState(false)
  const currentUser = api.useQuery('get', '/api/auth/current-user-identity')
  const logoutMutation = api.useMutation('post', '/api/auth/logout', {
    onSuccess: () => setSignedOut(true),
  })

  useEffect(() => {
    if (!authFailure) {
      return
    }
    window.history.replaceState({}, '', window.location.pathname)
  }, [authFailure])

  if (currentUser.data && !signedOut) {
    return (
      <AuthenticatedLayout
        user={currentUser.data}
        loggingOut={logoutMutation.isPending}
        onLogout={logout}
      >
        <Routes>
          <Route path="/" element={<DocumentHome />} />
          <Route path="/documents/:documentId/edit" element={<EditorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthenticatedLayout>
    )
  }

  const currentUserError: unknown = currentUser.error
  const unauthorized = currentUserError instanceof ApiError && currentUserError.status === 401
  const errorMessage =
    authFailure ??
    (!unauthorized && currentUserError instanceof Error ? currentUserError.message : null)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-10 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <section
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
        aria-live="polite"
      >
        <PublicationsLogo className="mx-auto mb-4 size-12" size={48} />
        <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Publications</p>
        {errorMessage
          ? renderError({ message: errorMessage })
          : currentUser.isPending
            ? renderLoading()
            : renderSignedOut()}
      </section>
      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        A modern home for page layout and print design.
      </p>
    </main>
  )

  function login() {
    window.location.assign('/oauth2/authorization/google')
  }

  function logout() {
    logoutMutation.mutate({})
  }

  function retry() {
    setAuthFailure(null)
    void currentUser.refetch()
  }

  function renderLoading() {
    return (
      <>
        <h1 className="text-2xl font-semibold tracking-tight">Opening your workspace</h1>
        <div
          className="mx-auto mt-8 size-7 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600 dark:border-gray-700 dark:border-t-violet-400"
          role="status"
          aria-label="Checking sign-in status"
        />
      </>
    )
  }

  function renderSignedOut() {
    return (
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
          <span
            className="grid size-5 place-items-center rounded-full bg-white text-xs font-bold text-violet-600"
            aria-hidden="true"
          >
            G
          </span>
          Continue with Google
        </button>
      </>
    )
  }

  function renderError({ message }: { message: string }) {
    return (
      <>
        <h1 className="text-2xl font-semibold tracking-tight">We hit a snag.</h1>
        <p className="mt-3 text-sm leading-6 text-red-600">{message}</p>
        <button
          className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          type="button"
          onClick={retry}
        >
          Try again
        </button>
      </>
    )
  }
}

export default App
