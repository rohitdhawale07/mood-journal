import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/hooks/use-theme"

// Load Inter font
const inter = Inter({ subsets: ["latin"] })

// Metadata for the application
export const metadata: Metadata = {
  title: "MoodMate - Interactive Mood Journal",
  description: "Track your daily mood and see how it correlates with weather",
  keywords: ["mood journal", "mood tracker", "weather", "journal", "mental health"],
  authors: [{ name: "Rohit Dhawale" }],
    generator: 'moodmate'
}

/**
 * Root layout component that wraps all pages
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
