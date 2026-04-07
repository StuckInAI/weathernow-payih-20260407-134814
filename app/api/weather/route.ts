import { NextRequest, NextResponse } from 'next/server';
import { getMockWeather } from '@/lib/mockWeather';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');

  if (!city || city.trim() === '') {
    return NextResponse.json({ error: 'City name is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (apiKey && apiKey !== 'demo') {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await fetch(url, { next: { revalidate: 300 } });

      if (response.status === 404) {
        return NextResponse.json({ error: `City "${city}" not found. Please check the spelling and try again.` }, { status: 404 });
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      return NextResponse.json({
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        visibility: Math.round(data.visibility / 1000),
        pressure: data.main.pressure,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
      });
    } else {
      const mockData = getMockWeather(city);
      if (!mockData) {
        return NextResponse.json({ error: `City "${city}" not found. Please check the spelling and try again.` }, { status: 404 });
      }
      return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data. Please try again.' }, { status: 500 });
  }
}
