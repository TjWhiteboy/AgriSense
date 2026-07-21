import React, { useState, useEffect } from 'react';

const MOCK_WEATHER = {
  city: 'Tiruchirappalli',
  state: 'Tamil Nadu',
  temp: 34,
  feels_like: 38,
  humidity: 72,
  wind_speed: 14,
  rain_prob: 35,
  condition: 'Partly Cloudy',
  icon: '⛅',
  forecast: [
    { day: 'Mon', icon: '☀️', high: 36, low: 26, rain: 10 },
    { day: 'Tue', icon: '🌦️', high: 33, low: 25, rain: 60 },
    { day: 'Wed', icon: '🌧️', high: 30, low: 24, rain: 80 },
    { day: 'Thu', icon: '⛅', high: 32, low: 25, rain: 30 },
    { day: 'Fri', icon: '☀️', high: 35, low: 26, rain: 10 },
    { day: 'Sat', icon: '☀️', high: 37, low: 27, rain: 5 },
  ]
};

const AGRO_ADVICE = [
  { icon: '💧', title: 'Irrigation Tip', text: 'Rain probability is 35% tonight. Consider delaying irrigation by 1 day to save water.' },
  { icon: '🌾', title: 'Harvest Window', text: 'Low wind speeds and clear skies on Mon-Tue make it an ideal harvesting window.' },
  { icon: '⚠️', title: 'Humidity Alert', text: '72% humidity increases risk of fungal infections. Monitor crops closely.' },
];

const WeatherPage: React.FC<{ district?: string }> = ({ district = 'Your Location' }) => {
  const [w] = useState(MOCK_WEATHER);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">🌦️ Weather Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Live agricultural weather for {district}</p>
      </div>

      {/* Main Weather Card */}
      <div className="glass-light dark:glass rounded-2xl p-8 hero-gradient text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-20 pointer-events-none">{w.icon}</div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-white/80 text-sm font-mono tracking-wide uppercase">{w.city}, {w.state}</p>
            <div className="flex items-end gap-2 my-2">
              <span className="font-heading font-extrabold text-7xl">{w.temp}°</span>
              <span className="text-2xl mb-2 text-white/80">C</span>
            </div>
            <p className="text-white/80">{w.condition} · Feels like {w.feels_like}°C</p>
          </div>
          <div className="text-right text-sm text-white/80 space-y-2 pt-2">
            <p>💧 Humidity: <strong className="text-white">{w.humidity}%</strong></p>
            <p>🌬️ Wind: <strong className="text-white">{w.wind_speed} km/h</strong></p>
            <p>🌧️ Rain: <strong className="text-white">{w.rain_prob}%</strong></p>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">📅 6-Day Forecast</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {w.forecast.map(d => (
            <div key={d.day} className="glass-light dark:glass rounded-xl p-3 text-center hover:shadow-lg transition-all">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{d.day}</p>
              <div className="text-2xl my-1">{d.icon}</div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{d.high}°</p>
              <p className="text-xs text-gray-400">{d.low}°</p>
              <p className="text-xs text-blue-500 font-semibold mt-1">{d.rain}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agro Advice */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">🌱 Agriculture Advice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AGRO_ADVICE.map(a => (
            <div key={a.title} className="glass-light dark:glass rounded-2xl p-4 hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-2">{a.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{a.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
