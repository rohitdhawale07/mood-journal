"use client"

import type React from "react"

/**
 * Journal Entry Card Component
 *
 * This component displays a single journal entry with mood emoji,
 * note content, date, and weather information.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

import { motion } from "framer-motion"
import type { JournalEntry } from "@/types/journal-types"

interface JournalEntryCardProps {
  entry: JournalEntry
}

/**
 * Component to display a single journal entry
 */
const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry }) => {
  /**
   * Get the emoji for a specific mood
   * @param mood Mood type
   * @returns Emoji string
   */
  const getMoodEmoji = (mood: string): string => {
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
   * Get background color class based on mood
   * @param mood Mood type
   * @returns Tailwind CSS class string
   */
  const getMoodBackgroundClass = (mood: string): string => {
    switch (mood) {
      case "happy":
        return "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
      case "neutral":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
      case "sad":
        return "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
      case "angry":
        return "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
      case "sick":
        return "bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20"
      default:
        return "bg-gray-50 dark:bg-gray-800/50"
    }
  }

  return (
    <motion.div
      className={`rounded-lg p-4 shadow-sm ${getMoodBackgroundClass(entry.mood)} transition-colors duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start">
        <div className="text-3xl mr-3">{getMoodEmoji(entry.mood)}</div>
        <div className="flex-1">
          <p className="font-medium dark:text-white">{entry.note}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</span>
            {entry.weather && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-1">{entry.weather.temp}°C</span>
                <span>{entry.weather.condition}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default JournalEntryCard
