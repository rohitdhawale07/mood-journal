/**
 * Note Input Component
 *
 * This component provides a textarea for users to enter notes about their mood.
 * It includes character counting and animations for a better user experience.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import type React from "react"
import { useState, useRef } from "react"

interface NoteInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

/**
 * Component for entering and managing journal notes
 */
const NoteInput: React.FC<NoteInputProps> = ({ value, onChange, maxLength = 200 }) => {
  // Track focus state for animation
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Calculate remaining characters
  const remainingChars = maxLength - value.length
  const isNearLimit = remainingChars <= 20

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  return (
    <div className="relative">
      <div
        className={`absolute inset-0 rounded-lg ${
          isFocused ? "ring-2 ring-orange-400 dark:ring-orange-500" : "ring-1 ring-gray-200 dark:ring-gray-700"
        }`}
        style={{ pointerEvents: "none" }}
      />

      <textarea
        ref={textareaRef}
        className="w-full p-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none resize-none dark:text-white relative z-10"
        placeholder="Add a note about how you're feeling..."
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={3}
        maxLength={maxLength}
        aria-label="Journal note"
      />

      {/* Character counter */}
      <div
        className={`text-xs mt-1 text-right ${
          isNearLimit ? (remainingChars <= 0 ? "text-red-500" : "text-orange-500") : "text-gray-400"
        }`}
      >
        {remainingChars} characters remaining
      </div>
    </div>
  )
}

export default NoteInput
