export type ThemePreference = 'light' | 'dark' | 'system'

export const themeStorageKey = 'publications-theme'

export function storedTheme(): ThemePreference {
  const value = window.localStorage.getItem(themeStorageKey)
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system'
}

export function applyTheme(theme: ThemePreference) {
  const dark = theme === 'dark'
    || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#030712' : '#44403c')
}
