/**
 * Journal Entries Page
 *
 * This page displays all journal entries with filtering options.
 * Users can view, filter, and search through their past mood entries.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Filter } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Components
import JournalEntryCard from "@/components/journal-entry-card"
import ActionButton from "@/components/ui-components/action-button"

// Services and hooks
import { getJournalEntries } from "@/services/journal-service"
import { useTheme } from "@/hooks/use-theme"

// Types
import type { JournalEntry, Mood } from "@/types/journal-types"

export default function EntriesPage() {
  // State management
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [moodFilter, setMoodFilter] = useState<Mood | "all">("all")
  const [showFilters, setShowFilters] = useState(false)

  // Hooks
  const { theme } = useTheme()

  // Load entries on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const journalEntries = await getJournalEntries()
        setEntries(journalEntries)
        setFilteredEntries(journalEntries)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading entries:", error)
        setIsLoading(false)
      }
    }

    loadEntries()
  }, [])

  // Filter entries when search or mood filter changes
  useEffect(() => {
    let result = entries

    // Apply mood filter
    if (moodFilter !== "all") {
      result = result.filter((entry) => entry.mood === moodFilter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (entry) => entry.note.toLowerCase().includes(query) || entry.date.toLowerCase().includes(query),
      )
    }

    setFilteredEntries(result)
  }, [entries, searchQuery, moodFilter])

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setMoodFilter("all")
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-400 to-orange-300 dark:from-slate-800 dark:to-slate-900">
        <div className="animate-pulse text-white text-xl font-medium">Loading entries...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-orange-300 dark:from-slate-800 dark:to-slate-900 p-4 transition-colors duration-300">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/" className="text-white mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Journal Entries</h1>
          </div>
          <button
            onClick={toggleFilters}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="Toggle filters"
          >
            <Filter className="h-5 w-5" />
          </button>
        </header>

        {/* Search and filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-transparent focus:border-orange-300 focus:outline-none dark:text-white"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => setMoodFilter("all")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      moodFilter === "all" ? "bg-white text-orange-500" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setMoodFilter("happy")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      moodFilter === "happy" ? "bg-white text-orange-500" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    😊 Happy
                  </button>
                  <button
                    onClick={() => setMoodFilter("neutral")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      moodFilter === "neutral" ? "bg-white text-orange-500" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    😐 Neutral
                  </button>
                  <button
                    onClick={() => setMoodFilter("sad")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      moodFilter === "sad" ? "bg-white text-orange-500" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    😔 Sad
                  </button>
                  <button
                    onClick={() => setMoodFilter("angry")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      moodFilter === "angry" ? "bg-white text-orange-500" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    😠 Angry
                  </button>
                  <button
                    onClick={() => setMoodFilter("sick")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      moodFilter === "sick" ? "bg-white text-orange-500" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    🤢 Sick
                  </button>
                </div>

                <button onClick={clearFilters} className="text-sm text-white hover:underline">
                  Clear filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries list */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg transition-colors duration-300">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No entries found</p>
              <Link href="/">
                <ActionButton variant="primary">Add Your First Entry</ActionButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
