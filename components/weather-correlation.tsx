"use client"

import type React from "react"

/**
 * Weather Correlation Component
 *
 * This component analyzes and displays the correlation between
 * weather conditions and mood entries.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

import { useMemo } from "react"
import type { JournalEntry, Mood } from "@/types/journal-types"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog } from "lucide-react"

interface WeatherCorrelationProps {
  entries: JournalEntry[]
}

/**
 * Component to display weather and mood correlation analysis
 */
const WeatherCorrelation: React.FC<WeatherCorrelationProps> = ({ entries }) => {
  // Calculate weather-mood correlation
  const correlation = useMemo(() => {
    // Group entries by weather condition
    const weatherGroups: Record<string, JournalEntry[]> = {}

    entries.forEach((entry) => {
      const condition = entry.weather.condition
      if (!weatherGroups[condition]) {
        weatherGroups[condition] = []
      }
      weatherGroups[condition].push(entry)
    })

    // Calculate dominant mood for each weather condition
    return Object.entries(weatherGroups)
      .map(([condition, conditionEntries]) => {
        // Count occurrences of each mood for this weather condition
        const moodCounts: Record<Mood, number> = {
          happy: 0,
          neutral: 0,
          sad: 0,
          angry: 0,
          sick: 0,
        }

        conditionEntries.forEach((entry) => {
          moodCounts[entry.mood]++
        })

        // Find the dominant mood (highest count)
        let dominantMood: Mood = "neutral"
        let highestCount = 0

        Object.entries(moodCounts).forEach(([mood, count]) => {
          if (count > highestCount) {
            highestCount = count
            dominantMood = mood as Mood
          }
        })

        // Calculate percentage of dominant mood
        const totalEntries = conditionEntries.length
        const dominantPercentage = Math.round((highestCount / totalEntries) * 100)

        return {
          condition,
          totalEntries,
          dominantMood,
          dominantPercentage,
          averageTemp: Math.round(conditionEntries.reduce((sum, entry) => sum + entry.weather.temp, 0) / totalEntries),
        }
      })
      .sort((a, b) => b.totalEntries - a.totalEntries) // Sort by number of entries
  }, [entries])

  /**
   * Get weather icon component based on condition
   * @param condition Weather condition string
   * @returns React component
   */
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()

    switch (true) {
      case lowerCondition.includes("clear"):
        return <Sun className="h-5 w-5 text-yellow-500" />
      case lowerCondition.includes("cloud"):
        return <Cloud className="h-5 w-5 text-gray-500" />
      case lowerCondition.includes("rain"):
        return <CloudRain className="h-5 w-5 text-blue-500" />
      case lowerCondition.includes("drizzle"):
        return <CloudDrizzle className="h-5 w-5 text-blue-400" />
      case lowerCondition.includes("snow"):
        return <CloudSnow className="h-5 w-5 text-blue-200" />
      case lowerCondition.includes("thunder"):
        return <CloudLightning className="h-5 w-5 text-purple-500" />
      case lowerCondition.includes("fog") || lowerCondition.includes("mist"):
        return <CloudFog className="h-5 w-5 text-gray-400" />
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />
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

  if (entries.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        No entries yet to analyze weather correlation.
      </div>
    )
  }

  if (correlation.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Not enough weather data to show correlations.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {correlation.map(({ condition, totalEntries, dominantMood, dominantPercentage, averageTemp }) => (
        <div key={condition} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {getWeatherIcon(condition)}
              <span className="ml-2 font-medium dark:text-white">{condition}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className="mr-1">Most common mood:</span>
              <span className="text-lg mr-1">{getMoodEmoji(dominantMood)}</span>
              <span className="font-medium">{dominantPercentage}%</span>
            </div>
            <div className="text-gray-500 dark:text-gray-400">Avg: {averageTemp}°C</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WeatherCorrelation
