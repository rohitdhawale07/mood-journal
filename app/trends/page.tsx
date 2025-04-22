/**
 * Trends Page
 *
 * This page displays mood trends and analytics, including mood distribution
 * over time and correlations between mood and weather.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, PlusCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Components
import MoodTrends from "@/components/mood-trends"
import WeatherCorrelation from "@/components/weather-correlation"
import TimeRangeSelector from "@/components/time-range-selector"
import ActionButton from "@/components/ui-components/action-button"

// Services and hooks
import { getJournalEntries, filterEntriesByTimeRange, addSampleEntries } from "@/services/journal-service"
import { useTheme } from "@/hooks/use-theme"
import { useToast } from "@/hooks/use-toast"

// Types
import type { JournalEntry, TimeRange } from "@/types/journal-types"

export default function TrendsPage() {
  // State management
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>("week")
  const [addingSamples, setAddingSamples] = useState(false)

  // Hooks
  const { theme } = useTheme()
  const { toast } = useToast()

  // Load entries on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const journalEntries = await getJournalEntries()
        setEntries(journalEntries)

        // Apply initial time range filter
        const filtered = filterEntriesByTimeRange(journalEntries, timeRange)
        setFilteredEntries(filtered)

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading entries:", error)
        setIsLoading(false)
      }
    }

    loadEntries()
  }, [])

  // Update filtered entries when time range changes or entries change
  useEffect(() => {
    const filtered = filterEntriesByTimeRange(entries, timeRange)
    setFilteredEntries(filtered)
  }, [entries, timeRange])

  // Update filtered entries when time range changes
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range)
  }

  // Add sample entries for testing
  const handleAddSampleEntries = async () => {
    try {
      setAddingSamples(true)
      await addSampleEntries()

      // Reload entries
      const journalEntries = await getJournalEntries()
      setEntries(journalEntries)

      toast({
        title: "Sample entries added",
        description: "Sample mood entries have been added for testing",
      })
    } catch (error) {
      console.error("Error adding sample entries:", error)
      toast({
        title: "Error",
        description: "Failed to add sample entries",
        variant: "destructive",
      })
    } finally {
      setAddingSamples(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-400 to-orange-300 dark:from-slate-800 dark:to-slate-900">
        <div className="animate-pulse text-white text-xl font-medium">Analyzing your moods...</div>
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
            <h1 className="text-2xl font-bold text-white">Mood Insights</h1>
          </div>

          {/* Add sample entries button (for testing) */}
          <button
            onClick={handleAddSampleEntries}
            disabled={addingSamples}
            className="flex items-center text-white text-sm bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5"
            title="Add sample entries for testing"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            {addingSamples ? "Adding..." : "Add Samples"}
          </button>
        </header>

        {/* Time range selector */}
        <TimeRangeSelector selectedRange={timeRange} onChange={handleTimeRangeChange} />

        {/* Main content */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg mt-4 transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Display time range info */}
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Showing {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"} from{" "}
              {timeRange === "week" ? "the past week" : timeRange === "month" ? "the past month" : "all time"}
            </p>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-2">No entries available for analysis</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                Add more mood entries to see trends and insights
              </p>
              <Link href="/">
                <ActionButton variant="primary">Add New Entry</ActionButton>
              </Link>
            </div>
          ) : (
            <>
              {/* Mood distribution */}
              <section className="mb-8">
                <h2 className="text-xl font-medium mb-4 dark:text-white">Your Mood Distribution</h2>
                <MoodTrends entries={filteredEntries} />
              </section>

              {/* Weather correlation */}
              <section>
                <h2 className="text-xl font-medium mb-4 dark:text-white">Weather & Mood Correlation</h2>
                <WeatherCorrelation entries={filteredEntries} />
              </section>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
