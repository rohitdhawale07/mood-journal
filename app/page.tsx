/**
 * Main Page Component
 *
 * This is the entry point of the application that renders the mood journal interface.
 * It handles the state management for the current mood entry and coordinates between
 * different components.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sun, Moon, BarChart2, Settings, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

// Components
import MoodSelector from "@/components/mood-selector"
import NoteInput from "@/components/note-input"
import WeatherDisplay from "@/components/weather-display"
import CalendarView from "@/components/calendar-view"
import ActionButton from "@/components/ui-components/action-button"

// Services and utilities
import { getWeatherData, getWeatherByCity } from "@/services/weather-service"
import { saveJournalEntry, getJournalEntries } from "@/services/journal-service"
import { useTheme } from "@/hooks/use-theme"

// Types
import type { JournalEntry, Mood, Weather } from "@/types/journal-types"

export default function Home() {
  // State management
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [note, setNote] = useState("")
  const [weather, setWeather] = useState<Weather | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [cityInput, setCityInput] = useState("")
  const [showCityInput, setShowCityInput] = useState(false)

  // Hooks
  const { toast } = useToast()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  // Load entries from localStorage on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const savedEntries = await getJournalEntries()
        setEntries(savedEntries)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading entries:", error)
        toast({
          title: "Error loading entries",
          description: "There was a problem loading your journal entries",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadEntries()
  }, [toast])

  // Get weather data
  useEffect(() => {
    const loadWeatherData = async () => {
      setIsLoadingWeather(true)
      try {
        // Get weather data
        const weatherData = await getWeatherData()
        setWeather(weatherData)
      } catch (error) {
        console.error("Error loading weather:", error)
        toast({
          title: "Weather data unavailable",
          description: "Could not fetch weather data. Try refreshing or entering a city manually.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingWeather(false)
      }
    }

    loadWeatherData()
  }, [toast])

  // Handle refreshing weather data
  const handleRefreshWeather = async () => {
    setIsLoadingWeather(true)
    try {
      const weatherData = await getWeatherData()
      setWeather(weatherData)
      toast({
        title: "Weather updated",
        description: `Current weather for ${weatherData.location}: ${weatherData.temp}°C, ${weatherData.condition}`,
      })
    } catch (error) {
      console.error("Error refreshing weather:", error)
      toast({
        title: "Could not update weather",
        description: "Try entering a city name manually",
        variant: "destructive",
      })
    } finally {
      setIsLoadingWeather(false)
    }
  }

  // Handle getting weather for a specific city
  const handleCityWeather = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cityInput.trim()) return

    setIsLoadingWeather(true)
    try {
      const weatherData = await getWeatherByCity(cityInput)
      setWeather(weatherData)
      setShowCityInput(false)
      setCityInput("")
      toast({
        title: "Weather updated",
        description: `Current weather for ${weatherData.location}: ${weatherData.temp}°C, ${weatherData.condition}`,
      })
    } catch (error) {
      console.error("Error getting city weather:", error)
      toast({
        title: "City not found",
        description: "Could not find weather data for this city",
        variant: "destructive",
      })
    } finally {
      setIsLoadingWeather(false)
    }
  }

  // Handle saving a new journal entry
  const handleSaveEntry = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "You need to select how you're feeling today",
        variant: "destructive",
      })
      return
    }

    if (!weather) {
      toast({
        title: "Weather data not available",
        description: "Please wait for weather data to load",
        variant: "destructive",
      })
      return
    }

    try {
      // Create and save the new entry
      const newEntry = await saveJournalEntry({
        date: selectedDate,
        mood: selectedMood,
        note: note.trim() || `Feeling ${selectedMood} today`,
        weather: weather,
      })

      // Update local state
      setEntries([newEntry, ...entries])

      // Reset form
      setSelectedMood(null)
      setNote("")

      toast({
        title: "Entry saved!",
        description: "Your mood has been recorded",
      })
    } catch (error) {
      console.error("Error saving entry:", error)
      toast({
        title: "Error saving entry",
        description: "There was a problem saving your journal entry",
        variant: "destructive",
      })
    }
  }

  // Navigate to entries view
  const navigateToEntries = () => {
    router.push("/entries")
  }

  // Navigate to trends view
  const navigateToTrends = () => {
    router.push("/trends")
  }

  // Navigate to settings
  const navigateToSettings = () => {
    router.push("/settings")
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-400 to-orange-300 dark:from-slate-800 dark:to-slate-900">
        <div className="animate-pulse text-white text-xl font-medium">Loading MoodMate...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-orange-300 dark:from-slate-800 dark:to-slate-900 p-4 transition-colors duration-300">
      <div className="max-w-md mx-auto">
        {/* Header with app name and controls */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">MoodMate</h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              {weather && !isLoadingWeather ? (
                <div className="flex items-center">
                  <WeatherDisplay weather={weather} />
                  <button
                    onClick={() => setShowCityInput(!showCityInput)}
                    className="ml-1 p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                    aria-label="Change city"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm animate-pulse">Loading weather...</span>
                </div>
              )}

              {/* City input dropdown */}
              {showCityInput && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 z-10 w-64">
                  <form onSubmit={handleCityWeather} className="flex flex-col space-y-2">
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="Enter city name"
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        disabled={isLoadingWeather}
                      >
                        {isLoadingWeather ? "Loading..." : "Update"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCityInput(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Main content card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg transition-colors duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-medium dark:text-white">{format(selectedDate, "MMMM d, yyyy")}</h2>
              <p className="text-gray-600 dark:text-gray-300">How are you feeling today?</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={navigateToEntries}
                className="flex items-center bg-orange-100 dark:bg-slate-700 hover:bg-orange-200 dark:hover:bg-slate-600 text-orange-800 dark:text-orange-300 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                All Notes
              </button>
            </div>
          </div>

          {/* Mood selection component */}
          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

          {/* Note input component */}
          <div className="mt-5">
            <NoteInput value={note} onChange={setNote} />
          </div>

          {/* Action buttons and calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <ActionButton
              onClick={handleSaveEntry}
              className="bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white"
              disabled={isLoadingWeather}
            >
              Save Entry
            </ActionButton>
            <div className="w-full">
              <CalendarView selectedDate={selectedDate} onSelectDate={setSelectedDate} entries={entries} />
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-center mt-6">
          <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full">
            <div className="flex space-x-1">
              <button
                onClick={navigateToTrends}
                className="p-2.5 rounded-full text-white hover:bg-white/20 transition-colors"
                aria-label="View trends"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <button
                onClick={navigateToSettings}
                className="p-2.5 rounded-full text-white hover:bg-white/20 transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
