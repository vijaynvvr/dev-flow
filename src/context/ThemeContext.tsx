'use client'

import React, { useContext, useEffect } from 'react'

// Type alias for theme values
type Theme = 'light' | 'dark'

// Interface for the theme context structure
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// Create the React Context with undefined as initial value
const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

// Custom hook to consume the ThemeContext
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  
  // Safety check: ensure the hook is used within a ThemeProvider
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  // Synchronize theme state with DOM class list
  useEffect(() => {
    // Guard against SSR environments where window or document may not be available
    if (typeof window === 'undefined' || !document) {
      return
    }

    // Access the root HTML element
    const htmlElement = document.documentElement

    // Apply or remove the 'dark' class based on the current theme
    if (context.theme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [context.theme])
  
  return context
}

// Export the context and hook for use in provider and components
export { ThemeContext, useTheme, type Theme, type ThemeContextType }
