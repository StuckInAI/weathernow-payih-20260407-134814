export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  visibility: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

export interface ForecastDay {
  date: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  icon: string;
  humidity: number;
}

export interface ForecastData {
  city: string;
  country: string;
  days: ForecastDay[];
}
