'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { useTheme } from '@/context/ThemeContext'

/**
 * ThemeApplier component that applies the current theme to the DOM.
 * This component calls the useApplyTheme hook to synchronize the React theme state
 * with the HTML element's class list, enabling CSS variable changes.
 *
 * This component should be rendered within the ThemeProvider to ensure proper functionality.
 */
function ThemeApplier() {
  // Call the hook to apply theme changes to the DOM
  useTheme()

  // This component doesn't render anything; it only applies side effects
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeApplier />
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
