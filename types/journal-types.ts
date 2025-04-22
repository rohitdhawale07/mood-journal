/**
 * Type Definitions for Journal Application
 *
 * This file contains all the type definitions used throughout the application
 * to ensure type safety and consistency.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

// Mood options available in the application
export type Mood = "happy" | "neutral" | "sad" | "angry" | "sick"

// Weather information structure
export type Weather = {
  temp: number
  condition: string
  icon: string
  location?: string
}

// Structure for a complete journal entry
export interface JournalEntry {
  id: string
  date: string
  mood: Mood
  note: string
  weather: Weather
  timestamp: number // For sorting and filtering
}

// Filter options for journal entries
export type TimeRange = "week" | "month" | "all"

// Theme options
export type Theme = "light" | "dark"

// Export format options
export type ExportFormat = "csv" | "json"
