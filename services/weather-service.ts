/**
 * Weather Service
 *
 * This service handles fetching weather data from the OpenWeatherMap API
 * using the browser's geolocation API.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

import type { Weather } from "@/types/journal-types"

// OpenWeatherMap API key 
const API_KEY = "1028ab98069aec2a1dfccd1607595da3"
/**
 * Get the user's current location using the browser's Geolocation API
 * @returns Promise with coordinates {latitude, longitude}
 */
const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    try {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser")
        resolve(getDefaultLocation())
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Geolocation error:", error.message)
          resolve(getDefaultLocation())
        },
        { timeout: 5000, enableHighAccuracy: false, maximumAge: 60000 },
      )
    } catch (error) {
      console.error("Error in getCurrentLocation:", error)
      resolve(getDefaultLocation())
    }
  })
}

/**
 * Get default location coordinates when geolocation fails
 * @returns Default coordinates (New York City)
 */
const getDefaultLocation = () => {
  return {
    latitude: 40.7128,
    longitude: -74.006,
  }
}

/**
 * Fetch weather data from OpenWeatherMap API
 * @returns Promise with weather data
 */
export const fetchWeatherData = async (): Promise<Weather> => {
  try {
    // Get user's location
    const { latitude, longitude } = await getCurrentLocation()

    // Create an AbortController to handle timeouts
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      // Fetch weather data from API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
        { signal: controller.signal },
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()

      // Return formatted weather data
      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        location: data.name,
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Weather API request timed out")
      } else {
        console.error("API fetch error:", error)
      }
      return getFallbackWeather()
    }
  } catch (error) {
    console.error("Error in fetchWeatherData:", error)
    return getFallbackWeather()
  }
}

/**
 * Get weather data - tries API first, falls back to default data
 * @returns Weather data
 */
export const getWeatherData = async (): Promise<Weather> => {
  try {
    return await fetchWeatherData()
  } catch (error) {
    console.error("Failed to get weather data:", error)
    return getFallbackWeather()
  }
}

/**
 * Generate fallback weather data when API fails
 * @returns Default weather data
 */
export const getFallbackWeather = (): Weather => {
  // Default weather for New York City
  return {
    temp: 22,
    condition: "Clear",
    icon: "01d",
    location: "New York",
  }
}

/**
 * Try to fetch weather data for a specific city
 * This can be used as a backup method if geolocation fails
 * @param city City name
 * @returns Weather data
 */
export const getWeatherByCity = async (city: string): Promise<Weather> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      location: data.name,
    }
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error)
    throw error
  }
}
