import { NextRequest, NextResponse } from 'next/server';
import { getMockForecast } from '@/lib/mockWeather';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');

  if (!city || city.trim() === '') {
    return NextResponse.json({ error: 'City name is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (apiKey && apiKey !== 'demo') {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=40`;
      const response = await fetch(url, { next: { revalidate: 300 } });

      if (response.status === 404) {
        return NextResponse.json({ error: `City "${city}" not found.` }, { status: 404 });
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const dailyMap = new Map<string, { temps: number[]; conditions: string[]; icons: string[]; humidity: number[] }>();

      data.list.forEach((item: {
        dt: number;
        main: { temp: number; humidity: number };
        weather: Array<{ main: string; icon: string }>;
      }) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];

        if (!dailyMap.has(dayKey)) {
          dailyMap.set(dayKey, { temps: [], conditions: [], icons: [], humidity: [] });
        }

        const day = dailyMap.get(dayKey)!;
        day.temps.push(Math.round(item.main.temp));
        day.conditions.push(item.weather[0].main);
        day.icons.push(item.weather[0].icon);
        day.humidity.push(item.main.humidity);
      });

      const today = new Date().toISOString().split('T')[0];
      const days = Array.from(dailyMap.entries())
        .filter(([key]) => key !== today)
        .slice(0, 5)
        .map(([key, val]) => ({
          date: key,
          minTemp: Math.min(...val.temps),
          maxTemp: Math.max(...val.temps),
          condition: val.conditions[Math.floor(val.conditions.length / 2)],
          icon: val.icons[Math.floor(val.icons.length / 2)],
          humidity: Math.round(val.humidity.reduce((a, b) => a + b, 0) / val.humidity.length),
        }));

      return NextResponse.json({ city: data.city.name, country: data.city.country, days });
    } else {
      const mockForecast = getMockForecast(city);
      if (!mockForecast) {
        return NextResponse.json({ error: `City "${city}" not found.` }, { status: 404 });
      }
      return NextResponse.json(mockForecast);
    }
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json({ error: 'Failed to fetch forecast data. Please try again.' }, { status: 500 });
  }
}
