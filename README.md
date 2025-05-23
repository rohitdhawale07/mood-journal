# MoodMate - Interactive Mood Journal

## Overview

MoodMate is an interactive mood journal web application that helps users track their daily mood alongside weather conditions. This application allows users to reflect on their emotional well-being, identify patterns, and gain insights into how external factors like weather might influence their mood.

## Features

- *Daily Mood Tracking*: Select from 5 different mood options (Happy, Neutral, Sad, Angry, Sick)
- *Weather Integration*: Automatically fetches real-time weather data based on user location
- *Journal Notes*: Add personal notes to each mood entry
- *Calendar View*: Visualize mood entries on a calendar with color-coded indicators
- *Mood Trends*: View mood distribution statistics and trends over time
- *Weather Correlation*: Analyze the relationship between weather conditions and mood
- *Time-based Filtering*: Filter insights by past week, past month, or all time
- *Dark/Light Mode*: Toggle between dark and light themes
- *Data Export*: Export journal entries in CSV or JSON format
- *Responsive Design*: Works on desktop and mobile devices

## Technologies Used

- *Frontend*: React, Next.js 14, TypeScript
- *Styling*: Tailwind CSS, shadcn/ui components
- *State Management*: React Hooks
- *Animations*: Framer Motion
- *Data Visualization*: Custom chart components
- *Weather API*: OpenWeatherMap API
- *Data Storage*: Local Storage (client-side)
- *Date Handling*: date-fns
- *Icons*: Lucide React

## Installation

1. Clone the repository:
   git clone https://github.com/yourusername/moodmate.git
   cd moodmate

2. Install dependencies:
   npm install

3. Create a .env file in the root directory and add your OpenWeatherMap API key:
   API_KEY=your_api_key_here

4. Start the development server:
   npm run dev

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Adding a Mood Entry

1. Select your current mood from the emoji options
2. Add a note about how you're feeling (optional)
3. Click "Save Entry" to record your mood

The application will automatically fetch your current location's weather data and associate it with your mood entry.

### Viewing Insights

1. Navigate to the Trends page using the chart icon in the bottom navigation
2. Select a time range (Past Week, Past Month, All Time)
3. View your mood distribution and weather correlation statistics

### Exporting Data

1. Go to the Settings page using the settings icon in the bottom navigation
2. Choose your preferred export format (CSV or JSON)
3. Click "Export Data" to download your journal entries

## Project Structure

```
moodmate/
├── app/                  # Next.js app directory
│   ├── entries/          # Journal entries page
│   ├── settings/         # Settings page
│   ├── trends/           # Mood trends and insights page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page component
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── ui-components/    # Custom UI components
│   ├── calendar-view.tsx # Calendar component
│   ├── journal-entries.tsx # Journal entries list
│   ├── mood-selector.tsx # Mood selection component
│   └── ...               # Other components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── services/             # Service modules
│   ├── journal-service.ts # Journal data operations
│   └── weather-service.ts # Weather API integration
├── types/                # TypeScript type definitions
└── ...                   # Configuration files
```

## Weather API

MoodMate uses the OpenWeatherMap API to fetch real-time weather data. The application requires the following permissions:

- *Geolocation*: To determine the user's current location for weather data
- *Internet Access*: To fetch weather data from the API

If geolocation is not available or denied, the application will use a default location or allow manual city selection.

## Future Enhancements

- User authentication and cloud storage
- Mood streak tracking
- Reminder notifications
- Advanced data visualization
- Custom mood categories
- Social sharing features
- Offline support
- Multi-language support

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed as an interview task assignment - April 2025
