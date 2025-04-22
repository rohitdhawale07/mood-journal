/**
 * Mood Trends Component
 *
 * This component visualizes mood distribution with animated bars
 * showing the percentage of each mood type.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import type React from "react"

import { useMemo } from "react"
import { motion } from "framer-motion"
import type { JournalEntry, Mood } from "@/types/journal-types"

interface MoodTrendsProps {
  entries: JournalEntry[]
}

/**
 * Component to display mood distribution visualization
 */
const MoodTrends: React.FC<MoodTrendsProps> = ({ entries }) => {
  /**
   * Get human-readable label for mood
   * @param mood Mood type
   * @returns String label
   */
  const getMoodLabel = (mood: Mood): string => {
    switch (mood) {
      case "happy":
        return "Happy"
      case "neutral":
        return "Neutral"
      case "sad":
        return "Sad"
      case "angry":
        return "Angry"
      case "sick":
        return "Sick"
      default:
        return mood
    }
  }

  /**
   * Get emoji for mood
   * @param mood Mood type
   * @returns Emoji string
   */
  const getMoodEmoji = (mood: Mood): string => {
    switch (mood) {
      case "happy":
        return "😊"
      case "neutral":
        return "😐"
      case "sad":
        return "😔"
      case "angry":
        return "😠"
      case "sick":
        return "🤢"
      default:
        return "😐"
    }
  }

  /**
   * Get CSS class for mood color
   * @param mood Mood type
   * @returns CSS class string
   */
  const getMoodColorClass = (mood: Mood): string => {
    switch (mood) {
      case "happy":
        return "bg-green-400 dark:bg-green-500"
      case "neutral":
        return "bg-blue-400 dark:bg-blue-500"
      case "sad":
        return "bg-indigo-400 dark:bg-indigo-500"
      case "angry":
        return "bg-red-400 dark:bg-red-500"
      case "sick":
        return "bg-emerald-600 dark:bg-emerald-700"
      default:
        return "bg-gray-400 dark:bg-gray-500"
    }
  }

  // Calculate mood counts and percentages
  const moodStats = useMemo(() => {
    // Count occurrences of each mood
    const counts = entries.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      },
      {} as Record<Mood, number>,
    )

    const totalEntries = entries.length

    // Define all possible moods to ensure they all appear in the visualization
    const allMoods: Mood[] = ["happy", "neutral", "sad", "angry", "sick"]

    // Create stats for each mood with count, percentage and label
    return allMoods
      .map((mood) => {
        const count = counts[mood] || 0
        const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0

        return {
          mood,
          count,
          percentage,
          label: getMoodLabel(mood),
          emoji: getMoodEmoji(mood),
          colorClass: getMoodColorClass(mood),
        }
      })
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage descending
  }, [entries])

  if (entries.length === 0) {
    return <div className="text-center py-4 text-gray-500 dark:text-gray-400">No entries yet to show trends.</div>
  }

  return (
    <div className="space-y-4">
      {moodStats.map(({ mood, count, percentage, label, emoji, colorClass }) => (
        <div key={mood} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl mr-2">{emoji}</span>
              <span className="font-medium dark:text-white">{label}</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {count} {count === 1 ? "entry" : "entries"} ({Math.round(percentage)}%)
            </div>
          </div>

          <div className="h-6 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${colorClass} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default MoodTrends
