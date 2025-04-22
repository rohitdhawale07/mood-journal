"use client"

import type React from "react"

/**
 * Time Range Selector Component
 *
 * This component provides buttons to filter data by different time ranges
 * such as week, month, or all time.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

import { motion } from "framer-motion"
import type { TimeRange } from "@/types/journal-types"
import { useTheme } from "@/hooks/use-theme"

interface TimeRangeSelectorProps {
  selectedRange: TimeRange
  onChange: (range: TimeRange) => void
}

/**
 * Component for selecting time range filters
 */
const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ selectedRange, onChange }) => {
  const { theme } = useTheme()

  // Time range options
  const ranges: { value: TimeRange; label: string }[] = [
    { value: "week", label: "Past Week" },
    { value: "month", label: "Past Month" },
    { value: "all", label: "All Time" },
  ]

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 flex">
      {ranges.map((range) => (
        <motion.button
          key={range.value}
          className={`relative flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            selectedRange === range.value ? "text-orange-600 dark:text-orange-300" : "text-white hover:bg-white/10"
          }`}
          onClick={() => onChange(range.value)}
          whileTap={{ scale: 0.95 }}
        >
          {selectedRange === range.value && (
            <motion.div
              className="absolute inset-0 bg-white dark:bg-white/90 rounded-lg"
              layoutId="timeRangeIndicator"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{range.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export default TimeRangeSelector
