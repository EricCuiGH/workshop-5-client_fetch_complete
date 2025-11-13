// This is a CLIENT COMPONENT - it runs in the browser, not on the server
'use client';

import { useState } from 'react';

export default function Home() {

  // State to store city input, temperature, and loading status
  const [cityInput, setCityInput] = useState('San Francisco');
  const [cityName, setCityName] = useState('San Francisco');
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch weather data based on city name
  async function fetchWeather() {
    if (!cityInput.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      // Step 1: Convert city name to coordinates using Open-Meteo Geocoding API
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found. Please try another city.');
        setLoading(false);
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];
      setCityName(name);

      // Step 2: Fetch weather data using the coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
      );
      
      const weatherData = await weatherResponse.json();
      setTemperature(weatherData.current.temperature_2m);
      console.log(weatherData);
      
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
          Weather Workshop
        </h1>
        
        {/* City Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex gap-2">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </div>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 min-w-[400px]">
          <div className="text-center">
            {error ? (
              <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
            ) : (
              <>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                  Current temperature in
                </p>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
                  {cityName}
                </h2>
                <div className="text-7xl font-bold text-indigo-600 dark:text-indigo-400">
                  {temperature === null ? (
                    <span className="text-2xl text-gray-400">Enter a city to get started</span>
                  ) : loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    `${temperature}°C`
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
