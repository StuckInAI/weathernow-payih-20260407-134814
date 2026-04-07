export function getWeatherIcon(condition: string): string {
  const map: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Smoke: '🌫️',
    Dust: '🌫️',
    Sand: '🌫️',
    Ash: '🌫️',
    Squall: '🌬️',
    Tornado: '🌪️',
  };
  return map[condition] ?? '🌡️';
}

export function formatTime(unixSeconds: number, timezoneOffsetSeconds: number): string {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00Z');
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}
