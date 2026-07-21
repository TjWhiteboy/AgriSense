import { apiClient } from './apiClient';

export interface WeatherData {
  weather: {
    city: string;
    district: string;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    rain_prob: number;
    rain1h: number;
    condition: string;
    icon: string;
    pressure: number;
    visibility: number | null;
  };
  forecast: Array<{
    day: string;
    icon: string;
    high: number;
    low: number;
    rain: number;
    condition: string;
  }>;
  agroAdvice: Array<{
    icon: string;
    title: string;
    text: string;
  }>;
}

export const weatherService = {
  getWeatherByDistrict: async (district: string): Promise<WeatherData> => {
    const data = await apiClient.get(`/weather?district=${encodeURIComponent(district)}`);
    if (data.error) throw new Error(data.error);
    return data;
  },
};
