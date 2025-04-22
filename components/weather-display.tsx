/**
 * Weather Display Component
 *
 * This component displays the current weather information including
 * temperature and weather condition with an appropriate icon.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

import type React from "react"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog } from "lucide-react"
import type { Weather } from "@/types/journal-types"

interface WeatherDisplayProps {
  weather: Weather
  showLocation?: boolean
}

/**
 * Component to display weather information with appropriate icon
 */
const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, showLocation = false }) => {
  /**
   * Get the appropriate weather icon based on condition
   * @returns React component for the weather icon
   */
  const getWeatherIcon = () => {
    const condition = weather.condition.toLowerCase()

    // Map weather conditions to appropriate icons
    switch (true) {
      case condition.includes("clear"):
        return <Sun className="h-5 w-5" />
      case condition.includes("cloud"):
        return <Cloud className="h-5 w-5" />
      case condition.includes("rain"):
        return <CloudRain className="h-5 w-5" />
      case condition.includes("drizzle"):
        return <CloudDrizzle className="h-5 w-5" />
      case condition.includes("snow"):
        return <CloudSnow className="h-5 w-5" />
      case condition.includes("thunder"):
        return <CloudLightning className="h-5 w-5" />
      case condition.includes("fog") || condition.includes("mist"):
        return <CloudFog className="h-5 w-5" />
      default:
        return <Sun className="h-5 w-5" />
    }
  }

  return (
    <div className="flex items-center text-white">
      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1" title={weather.location}>
        {getWeatherIcon()}
        <span className="ml-1 font-medium">{weather.temp}°C</span>

        {/* Show location if requested */}
        {showLocation && weather.location && <span className="ml-2 text-xs opacity-80">{weather.location}</span>}
      </div>
    </div>
  )
}

export default WeatherDisplay
