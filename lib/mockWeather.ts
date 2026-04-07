import { WeatherData, ForecastData } from '@/types/weather';

const cities: Record<string, { lat: number; lon: number; country: string; timezone: number }> = {
  london: { lat: 51.5074, lon: -0.1278, country: 'GB', timezone: 0 },
  'new york': { lat: 40.7128, lon: -74.006, country: 'US', timezone: -18000 },
  tokyo: { lat: 35.6762, lon: 139.6503, country: 'JP', timezone: 32400 },
  paris: { lat: 48.8566, lon: 2.3522, country: 'FR', timezone: 3600 },
  sydney: { lat: -33.8688, lon: 151.2093, country: 'AU', timezone: 36000 },
  berlin: { lat: 52.52, lon: 13.405, country: 'DE', timezone: 3600 },
  moscow: { lat: 55.7558, lon: 37.6173, country: 'RU', timezone: 10800 },
  dubai: { lat: 25.2048, lon: 55.2708, country: 'AE', timezone: 14400 },
  toronto: { lat: 43.6532, lon: -79.3832, country: 'CA', timezone: -18000 },
  mumbai: { lat: 19.076, lon: 72.8777, country: 'IN', timezone: 19800 },
  beijing: { lat: 39.9042, lon: 116.4074, country: 'CN', timezone: 28800 },
  cairo: { lat: 30.0444, lon: 31.2357, country: 'EG', timezone: 7200 },
  amsterdam: { lat: 52.3676, lon: 4.9041, country: 'NL', timezone: 3600 },
  chicago: { lat: 41.8781, lon: -87.6298, country: 'US', timezone: -21600 },
  singapore: { lat: 1.3521, lon: 103.8198, country: 'SG', timezone: 28800 },
};

const conditions = [
  { main: 'Clear', description: 'clear sky', icon: '01d' },
  { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
  { main: 'Rain', description: 'light rain', icon: '10d' },
  { main: 'Snow', description: 'light snow', icon: '13d' },
  { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getConditionForCity(cityName: string): typeof conditions[0] {
  const seed = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return conditions[seed % conditions.length];
}

function getTempForCity(cityName: string): number {
  const seed = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const base = (seededRandom(seed) * 40) - 5;
  return Math.round(base);
}

export function getMockWeather(city: string): WeatherData | null {
  const key = city.toLowerCase();
  const cityInfo = cities[key];

  if (!cityInfo) {
    const isKnown = Object.keys(cities).some(
      (k) => k.includes(key) || key.includes(k)
    );
    if (!isKnown && city.length < 3) return null;
    if (!isKnown && !/^[a-zA-Z\s-]+$/.test(city)) return null;
  }

  const country = cityInfo?.country ?? 'XX';
  const timezone = cityInfo?.timezone ?? 0;
  const condition = getConditionForCity(city);
  const temp = getTempForCity(city);
  const now = Math.floor(Date.now() / 1000);

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country,
    temperature: temp,
    feelsLike: temp - 2,
    humidity: 60 + Math.round(seededRandom(city.length) * 30),
    windSpeed: 10 + Math.round(seededRandom(city.charCodeAt(0)) * 20),
    condition: condition.main,
    description: condition.description,
    icon: condition.icon,
    visibility: 8 + Math.round(seededRandom(city.charCodeAt(1) ?? 1) * 7),
    pressure: 1010 + Math.round(seededRandom(city.length + 1) * 20),
    sunrise: now - 3600 * 5,
    sunset: now + 3600 * 7,
    timezone,
  };
}

export function getMockForecast(city: string): ForecastData | null {
  const weather = getMockWeather(city);
  if (!weather) return null;

  const days = [];
  const conditionList = ['Clear', 'Clouds', 'Rain', 'Clear', 'Clouds'];
  const iconList = ['01d', '02d', '10d', '01d', '03d'];
  const baseTemp = weather.temperature;

  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const seed = i + city.length;
    const offset = Math.round((seededRandom(seed) - 0.5) * 10);

    days.push({
      date: date.toISOString().split('T')[0],
      minTemp: baseTemp + offset - 3,
      maxTemp: baseTemp + offset + 3,
      condition: conditionList[i - 1],
      icon: iconList[i - 1],
      humidity: 55 + Math.round(seededRandom(seed + 10) * 30),
    });
  }

  return {
    city: weather.city,
    country: weather.country,
    days,
  };
}
