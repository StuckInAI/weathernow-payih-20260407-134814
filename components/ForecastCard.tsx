'use client';

import { ForecastData, ForecastDay } from '@/types/weather';
import { getWeatherIcon, formatDate } from '@/lib/utils';
import styles from './ForecastCard.module.css';

interface ForecastCardProps {
  data: ForecastData;
}

function DayForecast({ day }: { day: ForecastDay }) {
  const icon = getWeatherIcon(day.condition);
  const dayName = formatDate(day.date);

  return (
    <div className={styles.dayCard}>
      <span className={styles.dayName}>{dayName}</span>
      <span className={styles.dayIcon}>{icon}</span>
      <span className={styles.dayCondition}>{day.condition}</span>
      <div className={styles.tempRange}>
        <span className={styles.maxTemp}>{day.maxTemp}°</span>
        <span className={styles.separator}>/</span>
        <span className={styles.minTemp}>{day.minTemp}°</span>
      </div>
      <div className={styles.humidity}>
        <span>💧</span>
        <span>{day.humidity}%</span>
      </div>
    </div>
  );
}

export default function ForecastCard({ data }: ForecastCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <span>📅</span>
        <span>5-Day Forecast</span>
      </h3>
      <div className={styles.grid}>
        {data.days.map((day) => (
          <DayForecast key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}
