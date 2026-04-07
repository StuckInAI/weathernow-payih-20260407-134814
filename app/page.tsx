'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import ForecastCard from '@/components/ForecastCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { WeatherData, ForecastData } from '@/types/weather';
import styles from './page.module.css';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast(null);

    try {
      const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const weatherData = await weatherRes.json();

      if (!weatherRes.ok) {
        throw new Error(weatherData.error || 'Failed to fetch weather data');
      }

      setWeather(weatherData);

      const forecastRes = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
      const forecastData = await forecastRes.json();

      if (!forecastRes.ok) {
        throw new Error(forecastData.error || 'Failed to fetch forecast data');
      }

      setForecast(forecastData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🌤️</span>
            <h1 className={styles.title}>WeatherNow</h1>
          </div>
          <p className={styles.subtitle}>Real-time weather for any city in the world</p>
        </header>

        <SearchBar onSearch={fetchWeather} loading={loading} />

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {weather && !loading && <WeatherCard data={weather} />}
        {forecast && !loading && <ForecastCard data={forecast} />}

        {!weather && !loading && !error && (
          <div className={styles.welcome}>
            <div className={styles.welcomeIcon}>🌍</div>
            <h2 className={styles.welcomeTitle}>Search for a city to get started</h2>
            <p className={styles.welcomeText}>
              Enter any city name to see current weather conditions and a 5-day forecast.
            </p>
            <div className={styles.suggestions}>
              <span className={styles.suggestionsLabel}>Try:</span>
              {['London', 'New York', 'Tokyo', 'Paris', 'Sydney'].map((city) => (
                <button
                  key={city}
                  className={styles.suggestionBtn}
                  onClick={() => fetchWeather(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
