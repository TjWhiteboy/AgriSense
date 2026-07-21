import React, { useState, useEffect, useCallback } from 'react';
import { weatherService, WeatherData } from '../services/weatherService';

// Skeleton loader card
const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl ${className}`} />
);

const WeatherPage: React.FC<{ district?: string }> = ({ district = 'Tiruchirappalli' }) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await weatherService.getWeatherByDistrict(district);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [district]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  const w = data?.weather;
  const forecast = data?.forecast || [];
  const agroAdvice = data?.agroAdvice || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">🌦️ Weather Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Live agricultural weather for <span className="font-semibold text-primary-600 dark:text-primary-400">{district}</span>
          </p>
        </div>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="glass-light dark:glass rounded-2xl p-6 border border-red-200 dark:border-red-800 text-center">
          <p className="text-4xl mb-3">🌐</p>
          <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Weather Unavailable</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchWeather}
            className="px-5 py-2 bg-primary-800 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <>
          <SkeletonCard className="h-48" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-24" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} className="h-28" />)}
          </div>
        </>
      )}

      {/* Real Weather Data */}
      {!loading && !error && w && (
        <>
          {/* Main Weather Card */}
          <div className="glass-light dark:glass rounded-2xl p-8 hero-gradient text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl opacity-20 pointer-events-none select-none">{w.icon}</div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between relative z-10 gap-4">
              <div>
                <p className="text-white/80 text-sm font-mono tracking-wide uppercase">
                  {w.city}{w.city !== w.district ? `, ${w.district}` : ''}
                </p>
                <div className="flex items-end gap-2 my-2">
                  <span className="font-heading font-extrabold text-7xl">{w.temp}°</span>
                  <span className="text-2xl mb-2 text-white/80">C</span>
                </div>
                <p className="text-white/80">{w.condition} · Feels like {w.feels_like}°C</p>
              </div>
              <div className="text-sm text-white/80 space-y-2 pt-2 grid grid-cols-2 md:grid-cols-1 gap-x-6">
                <p>💧 Humidity: <strong className="text-white">{w.humidity}%</strong></p>
                <p>🌬️ Wind: <strong className="text-white">{w.wind_speed} km/h</strong></p>
                <p>🌧️ Rain (1h): <strong className="text-white">{w.rain1h} mm</strong></p>
                {w.pressure && <p>📊 Pressure: <strong className="text-white">{w.pressure} hPa</strong></p>}
                {w.visibility && <p>👁️ Visibility: <strong className="text-white">{w.visibility} km</strong></p>}
              </div>
            </div>
          </div>

          {/* Forecast */}
          {forecast.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">📅 6-Day Forecast</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {forecast.map((d, i) => (
                  <div key={i} className="glass-light dark:glass rounded-xl p-3 text-center hover:shadow-lg transition-all">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{d.day}</p>
                    <div className="text-2xl my-1">{d.icon}</div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{d.high}°</p>
                    <p className="text-xs text-gray-400">{d.low}°</p>
                    <p className="text-xs text-blue-500 font-semibold mt-1">{d.rain}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agro Advice (AI-generated on backend) */}
          {agroAdvice.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">🌱 Agriculture Advice</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agroAdvice.map((a) => (
                  <div key={a.title} className="glass-light dark:glass rounded-2xl p-4 hover:-translate-y-0.5 transition-all">
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{a.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            Live data via OpenWeatherMap · Cached for 30 minutes · Last updated {new Date().toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
};

export default WeatherPage;
