import { ChevronDown, LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { Link } from 'react-router'
import type { User } from '../types'
import { applyTheme, storedTheme, themeStorageKey, type ThemePreference } from '../theme'
import { PublicationsLogo } from './PublicationsLogo'

type Props = PropsWithChildren<{
  user: User
  loggingOut: boolean
  onLogout: () => void
}>

export function AuthenticatedLayout({ user, loggingOut, onLogout, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<ThemePreference>(storedTheme)
  const menuRef = useRef<HTMLDivElement>(null)
  const initials = (user.name ?? user.email ?? 'User')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    window.localStorage.setItem(themeStorageKey, theme)
    applyTheme(theme)
    if (theme !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystemTheme = () => applyTheme('system')
    media.addEventListener('change', syncSystemTheme)
    return () => media.removeEventListener('change', syncSystemTheme)
  }, [theme])

  useEffect(() => {
    if (!menuOpen) {
      return
    }
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const themeOptions: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="flex h-dvh overflow-hidden flex-col bg-gray-50 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-40 shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="flex h-11 w-full items-center gap-3 px-3">
          <Link
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            to="/"
          >
            <PublicationsLogo className="size-7" size={28} />
            <span className="text-sm font-semibold tracking-tight">Publications</span>
          </Link>
          <div id="editor-toolbar-slot" className="flex min-w-0 flex-1 items-center" />
          <div className="relative ml-auto" ref={menuRef}>
            <button
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-left transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:hover:bg-gray-800"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span
                className="grid size-7 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                aria-hidden="true"
              >
                {initials}
              </span>
              <span className="hidden max-w-44 truncate text-sm font-medium sm:block">
                {user.name ?? 'Signed-in user'}
              </span>
              <ChevronDown
                className={`size-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                role="menu"
              >
                <div className="border-b border-gray-200 px-2 pb-3 pt-1 dark:border-gray-700">
                  <p className="truncate text-sm font-medium">{user.name ?? 'Signed-in user'}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user.email ?? ''}
                  </p>
                </div>
                <div className="p-2">
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Appearance
                  </p>
                  <div
                    className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
                    role="group"
                    aria-label="Color theme"
                  >
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        className={`flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs font-medium transition ${theme === value ? 'bg-white text-violet-700 shadow-sm dark:bg-gray-700 dark:text-violet-300' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'}`}
                        type="button"
                        role="menuitemradio"
                        aria-checked={theme === value}
                        onClick={() => setTheme(value)}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  type="button"
                  role="menuitem"
                  onClick={onLogout}
                  disabled={loggingOut}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  {loggingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
