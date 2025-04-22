import type React from "react"
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun } from "lucide-react"

type Mood = "happy" | "neutral" | "sad" | "angry" | "sick"
type Weather = {
  temp: number
  condition: string
  icon: string
}
type JournalEntry = {
  id: string
  date: string
  mood: Mood
  note: string
  weather: Weather
}

interface JournalEntriesProps {
  entries: JournalEntry[]
}

const JournalEntries: React.FC<JournalEntriesProps> = ({ entries }) => {
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

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="h-4 w-4" />
      case "clouds":
        return <Cloud className="h-4 w-4" />
      case "rain":
        return <CloudRain className="h-4 w-4" />
      case "snow":
        return <CloudSnow className="h-4 w-4" />
      case "thunderstorm":
        return <CloudLightning className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  if (entries.length === 0) {
    return <div className="text-center py-8 text-gray-500">No entries yet. Start by adding your mood today!</div>
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-orange-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-start">
            <div className="text-2xl mr-3">{getMoodEmoji(entry.mood)}</div>
            <div className="flex-1">
              <p className="font-medium">{entry.note}</p>
              <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                <span>{entry.date}</span>
                {entry.weather && (
                  <div className="flex items-center">
                    {getWeatherIcon(entry.weather.condition)}
                    <span className="ml-1">{entry.weather.temp}°C</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default JournalEntries
