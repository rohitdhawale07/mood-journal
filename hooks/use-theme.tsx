/**
 * Theme Hook
 *
 * Custom hook for managing theme state (light/dark mode) throughout the application.
 * It syncs the theme with localStorage and applies it to the document.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import type { Theme } from "@/types/journal-types"

// Context for theme state
type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Storage key for theme preference
const THEME_STORAGE_KEY = "moodMateTheme"

/**
 * Theme Provider component
 * Provides theme context to the application
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Use stored theme or system preference
    const initialTheme: Theme = storedTheme || (prefersDark ? "dark" : "light")
    setTheme(initialTheme)

    // Apply theme to document
    applyTheme(initialTheme)
  }, [])

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  }

  // Apply theme to document element
  const applyTheme = (newTheme: Theme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

/**
 * Custom hook to use theme context
 * @returns Theme context with current theme and toggle function
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
