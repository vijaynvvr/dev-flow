
import { type Theme } from '@/context/ThemeContext'

// Storage key constant for theme preference
const THEME_STORAGE_KEY = 'theme-preference'

/**
 * Retrieves the stored theme preference from localStorage.
 * Handles SSR environments and storage errors gracefully.
 * 
 * @returns The stored theme ('light' or 'dark') or 'light' as default
 */
function getStoredTheme(): Theme {
  // Check if window object exists (SSR safety)
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    // Attempt to retrieve the theme from localStorage
    const storedValue = localStorage.getItem(THEME_STORAGE_KEY)

    // Validate that the retrieved value is exactly 'light' or 'dark'
    if (storedValue === 'light' || storedValue === 'dark') {
      return storedValue
    }

    // Return default theme if value is missing or invalid
    return 'light'
  } catch (error) {
    // Handle errors from privacy modes or disabled storage
    // Return default theme to prevent application crashes
    return 'light'
  }
}

/**
 * Stores the theme preference in localStorage.
 * Handles SSR environments and storage errors gracefully.
 * 
 * @param theme - The theme to store ('light' or 'dark')
 */
function setStoredTheme(theme: Theme): void {
  // Check if window object exists (SSR safety)
  if (typeof window === 'undefined') {
    return
  }

  try {
    // Attempt to store the theme in localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (error) {
    // Handle errors from full storage or disabled storage
    // Silently fail to prevent application crashes
    // In production, you might want to log this error for monitoring
  }
}

// Export the functions and constant for use throughout the application
export { getStoredTheme, setStoredTheme, THEME_STORAGE_KEY }

