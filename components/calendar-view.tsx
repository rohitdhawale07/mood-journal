/**
 * Calendar View Component
 *
 * This component displays a calendar that highlights dates with journal entries
 * and allows the user to select a date.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import type React from "react"
import { Calendar } from "@/components/ui/calendar"
import { format, parse, isValid } from "date-fns"
import type { JournalEntry, Mood } from "@/types/journal-types"

interface CalendarViewProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  entries: JournalEntry[]
}

/**
 * Component to display and interact with a calendar showing mood entries
 */
const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onSelectDate, entries }) => {
  /**
   * Get dates with entries for calendar highlighting
   * @returns Record mapping date strings to mood types
   */
  const getDatesWithEntries = (): Record<string, Mood> => {
    return entries.reduce(
      (acc, entry) => {
        try {
          // Try to parse the date string from the entry
          const dateStr = entry.date
          // First try to parse with the format "MMMM d, yyyy"
          let entryDate = parse(dateStr, "MMMM d, yyyy", new Date())

          // If that fails, try creating a date directly
          if (!isValid(entryDate)) {
            entryDate = new Date(dateStr)
          }

          // Only proceed if we have a valid date
          if (isValid(entryDate)) {
            const dateKey = format(entryDate, "yyyy-MM-dd")
            acc[dateKey] = entry.mood
          }
        } catch (error) {
          console.error("Error parsing date:", error)
        }
        return acc
      },
      {} as Record<string, Mood>,
    )
  }

  /**
   * Get CSS class for mood indicator dots
   * @param mood Mood type
   * @returns CSS class string for the mood color
   */
  const getMoodColorClass = (mood: Mood): string => {
    switch (mood) {
      case "happy":
        return "bg-green-400"
      case "neutral":
        return "bg-blue-400"
      case "sad":
        return "bg-indigo-400"
      case "angry":
        return "bg-red-400"
      case "sick":
        return "bg-green-700"
      default:
        return "bg-gray-400"
    }
  }

  // Get dates with entries for highlighting
  const datesWithEntries = getDatesWithEntries()

  return (
    <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden shadow-sm w-full">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        className="w-full"
        components={{
          DayContent: ({ date }) => {
            if (!date || !isValid(date)) {
              return <span>-</span>
            }

            const dateKey = format(date, "yyyy-MM-dd")
            const hasMood = dateKey in datesWithEntries
            const mood = datesWithEntries[dateKey]

            return (
              <div className="relative flex items-center justify-center w-full h-full">
                <span>{date.getDate()}</span>
                {hasMood && (
                  <span
                    className={`absolute -bottom-1 w-2 h-2 rounded-full ${getMoodColorClass(mood)}`}
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          },
        }}
      />
    </div>
  )
}

export default CalendarView
