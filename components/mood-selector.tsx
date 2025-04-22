/**
 * Mood Selector Component
 *
 * This component displays a set of mood options as emojis and allows
 * the user to select their current mood.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Mood } from "@/types/journal-types"

interface MoodSelectorProps {
  selectedMood: Mood | null
  onSelectMood: (mood: Mood) => void
}

/**
 * Component that displays mood options as interactive emoji buttons
 */
const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  // Define available moods with their emoji and description
  const moods: { type: Mood; emoji: string; description: string }[] = [
    { type: "happy", emoji: "😊", description: "Happy" },
    { type: "neutral", emoji: "😐", description: "Neutral" },
    { type: "sad", emoji: "😔", description: "Sad" },
    { type: "angry", emoji: "😠", description: "Angry" },
    { type: "sick", emoji: "🤢", description: "Sick" },
  ]

  // State for hover effects
  const [hoveredMood, setHoveredMood] = useState<Mood | null>(null)

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        {moods.map((mood) => (
          <motion.button
            key={mood.type}
            className={`relative text-3xl p-3 rounded-full transition-all ${
              selectedMood === mood.type
                ? "bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-900/30 dark:to-rose-900/30 shadow-md"
                : "hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => onSelectMood(mood.type)}
            onMouseEnter={() => setHoveredMood(mood.type)}
            onMouseLeave={() => setHoveredMood(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Select ${mood.description} mood`}
          >
            {mood.emoji}

            {/* Show mood description on hover */}
            {hoveredMood === mood.type && (
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {mood.description}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Display selected mood description */}
      {selectedMood && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
          You selected: {moods.find((m) => m.type === selectedMood)?.description}
        </div>
      )}
    </div>
  )
}

export default MoodSelector
