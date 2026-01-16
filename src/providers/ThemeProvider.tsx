'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ThemeContext, useTheme, type Theme } from '@/context/ThemeContext'
import { getStoredTheme, setStoredTheme } from '@/utils/themeStorage'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

interface ThemeProviderProps {
  children: React.ReactNode
}

/**
 * ThemeProvider component manages the global theme state and provides it to the component tree.
 * It handles theme persistence using localStorage and ensures the initial state matches user preferences.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme state with lazy initializer to avoid unnecessary storage reads on re-renders
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  // Memoized toggle function to prevent unnecessary downstream re-renders
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }, [])

  // Persist theme preference whenever it changes
  useEffect(() => {
    setStoredTheme(theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function ThemeToggler() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}
