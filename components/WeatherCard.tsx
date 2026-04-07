'use client';

import { WeatherData } from '@/types/weather';
import { getWeatherIcon, formatTime } from '@/lib/utils';
import styles from './WeatherCard.module.css';

interface WeatherCardProps {
  data: WeatherData;
}

export default function WeatherCard({ data }: WeatherCardProps) {
  const icon = getWeatherIcon(data.condition);

  const sunriseTime = formatTime(data.sunrise, data.timezone);
  const sunsetTime = formatTime(data.sunset, data.timezone);

  return (
    <div className={styles.card}>
      <div className={styles.topSection}>
        <div className={styles.locationInfo}>
          <h2 className={styles.cityName}>
            {data.city}, {data.country}
          </h2>
          <p className={styles.condition}>{data.description}</p>
        </div>
        <div className={styles.tempSection}>
          <span className={styles.weatherIcon}>{icon}</span>
          <div className={styles.tempDisplay}>
            <span className={styles.temperature}>{data.temperature}°</span>
            <span className={styles.unit}>C</span>
          </div>
        </div>
      </div>

      <div className={styles.feelsLike}>
        Feels like {data.feelsLike}°C
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>💧</span>
          <span className={styles.statValue}>{data.humidity}%</span>
          <span className={styles.statLabel}>Humidity</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>💨</span>
          <span className={styles.statValue}>{data.windSpeed} km/h</span>
          <span className={styles.statLabel}>Wind</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>👁️</span>
          <span className={styles.statValue}>{data.visibility} km</span>
          <span className={styles.statLabel}>Visibility</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🌡️</span>
          <span className={styles.statValue}>{data.pressure} hPa</span>
          <span className={styles.statLabel}>Pressure</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🌅</span>
          <span className={styles.statValue}>{sunriseTime}</span>
          <span className={styles.statLabel}>Sunrise</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🌇</span>
          <span className={styles.statValue}>{sunsetTime}</span>
          <span className={styles.statLabel}>Sunset</span>
        </div>
      </div>
    </div>
  );
}
