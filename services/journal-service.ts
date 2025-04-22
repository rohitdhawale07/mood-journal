/**
 * Journal Service
 *
 * This service handles all operations related to journal entries including
 * saving, retrieving, and exporting entries.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

import { format as dateFormat } from "date-fns"
import type { JournalEntry, Mood, Weather, ExportFormat, TimeRange } from "@/types/journal-types"

// Storage key for journal entries in localStorage
const STORAGE_KEY = "moodJournalEntries"

/**
 * Get all journal entries from localStorage
 * @returns Array of journal entries
 */
export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const entriesJson = localStorage.getItem(STORAGE_KEY)
    if (!entriesJson) return []

    const entries = JSON.parse(entriesJson) as JournalEntry[]
    return entries.sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first
  } catch (error) {
    console.error("Error getting journal entries:", error)
    return []
  }
}

/**
 * Save a new journal entry
 * @param entryData Entry data without ID and timestamp
 * @returns The newly created entry
 */
export const saveJournalEntry = async (entryData: {
  date: Date
  mood: Mood
  note: string
  weather: Weather
}): Promise<JournalEntry> => {
  try {
    // Create new entry with ID and timestamp
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: dateFormat(entryData.date, "MMMM d, yyyy"),
      mood: entryData.mood,
      note: entryData.note,
      weather: entryData.weather,
      timestamp: entryData.date.getTime(), // Use the selected date's timestamp, not current time
    }

    // Get existing entries
    const existingEntries = await getJournalEntries()

    // Save updated entries list
    const updatedEntries = [newEntry, ...existingEntries]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries))

    return newEntry
  } catch (error) {
    console.error("Error saving journal entry:", error)
    throw error
  }
}

/**
 * Filter entries by time range
 * @param entries All journal entries
 * @param range Time range to filter by
 * @returns Filtered entries
 */
export const filterEntriesByTimeRange = (entries: JournalEntry[], range: TimeRange): JournalEntry[] => {
  if (range === "all") return entries

  const now = Date.now()
  const msInDay = 86400000 // Milliseconds in a day

  let cutoffTime: number

  if (range === "week") {
    cutoffTime = now - 7 * msInDay
    console.log(`Filtering for week: Cutoff time ${new Date(cutoffTime).toISOString()}`)
  } else if (range === "month") {
    cutoffTime = now - 30 * msInDay
    console.log(`Filtering for month: Cutoff time ${new Date(cutoffTime).toISOString()}`)
  } else {
    return entries
  }

  // Debug logging
  console.log(`Total entries: ${entries.length}`)
  console.log(
    `Entries timestamps:`,
    entries.map((e) => ({ date: e.date, timestamp: e.timestamp, formattedDate: new Date(e.timestamp).toISOString() })),
  )

  const filtered = entries.filter((entry) => entry.timestamp >= cutoffTime)
  console.log(`Filtered entries: ${filtered.length}`)

  return filtered
}

/**
 * Export journal entries to a file
 * @param entries Journal entries to export
 * @param format Export format (csv or json)
 * @returns Filename of the exported file
 */
export const exportJournalEntries = (entries: JournalEntry[], format: ExportFormat): string => {
  try {
    if (entries.length === 0) {
      throw new Error("No entries to export")
    }

    let dataStr: string
    let fileName: string
    let mimeType: string

    // Get current date formatted as YYYY-MM-DD
    const currentDate = dateFormat(new Date(), "yyyy-MM-dd")

    if (format === "csv") {
      // Create CSV header
      const headers = "Date,Mood,Note,Temperature,Weather Condition,Location\n"

      // Convert entries to CSV rows
      const csvRows = entries.map(
        (entry) =>
          `"${entry.date}","${entry.mood}","${entry.note.replace(/"/g, '""')}","${entry.weather.temp}°C","${entry.weather.condition}","${entry.weather.location || "Unknown"}"`,
      )

      dataStr = headers + csvRows.join("\n")
      fileName = `moodmate-journal-${currentDate}.csv`
      mimeType = "text/csv"
    } else {
      // JSON format
      dataStr = JSON.stringify(entries, null, 2)
      fileName = `moodmate-journal-${currentDate}.json`
      mimeType = "application/json"
    }

    // Create and trigger download
    const blob = new Blob([dataStr], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.display = "none"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return fileName
  } catch (error) {
    console.error("Error exporting journal entries:", error)
    throw error
  }
}

/**
 * Add sample entries for testing
 * This is useful for development and testing
 */
export const addSampleEntries = async (): Promise<void> => {
  const now = new Date()
  const msInDay = 86400000 // Milliseconds in a day

  // Sample entries spanning different time periods
  const sampleEntries = [
    // Today
    {
      date: new Date(),
      mood: "happy" as Mood,
      note: "Feeling great today!",
      weather: { temp: 25, condition: "Clear", icon: "01d", location: "Sample City" },
    },
    // 2 days ago
    {
      date: new Date(now.getTime() - 2 * msInDay),
      mood: "neutral" as Mood,
      note: "Just an ordinary day",
      weather: { temp: 22, condition: "Clouds", icon: "02d", location: "Sample City" },
    },
    // 5 days ago
    {
      date: new Date(now.getTime() - 5 * msInDay),
      mood: "sad" as Mood,
      note: "Not feeling my best",
      weather: { temp: 18, condition: "Rain", icon: "10d", location: "Sample City" },
    },
    // 10 days ago
    {
      date: new Date(now.getTime() - 10 * msInDay),
      mood: "angry" as Mood,
      note: "Frustrated with work",
      weather: { temp: 27, condition: "Clear", icon: "01d", location: "Sample City" },
    },
    // 20 days ago
    {
      date: new Date(now.getTime() - 20 * msInDay),
      mood: "happy" as Mood,
      note: "Had a great weekend!",
      weather: { temp: 24, condition: "Clouds", icon: "02d", location: "Sample City" },
    },
    // 40 days ago
    {
      date: new Date(now.getTime() - 40 * msInDay),
      mood: "sick" as Mood,
      note: "Caught a cold",
      weather: { temp: 15, condition: "Rain", icon: "10d", location: "Sample City" },
    },
  ]

  // Save each sample entry
  for (const entry of sampleEntries) {
    await saveJournalEntry(entry)
  }
}
