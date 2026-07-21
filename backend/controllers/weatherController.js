const axios = require('axios');

// Simple in-memory cache: { district => { data, expiresAt } }
const weatherCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const CONDITION_TO_ICON = {
  'clear sky': '☀️', 'few clouds': '🌤️', 'scattered clouds': '⛅',
  'broken clouds': '🌥️', 'overcast clouds': '☁️',
  'light rain': '🌦️', 'moderate rain': '🌧️', 'heavy intensity rain': '🌧️',
  'thunderstorm': '⛈️', 'mist': '🌫️', 'haze': '🌫️', 'fog': '🌫️', 'snow': '❄️',
};

function getIcon(description) {
  for (const [key, icon] of Object.entries(CONDITION_TO_ICON)) {
    if (description.toLowerCase().includes(key)) return icon;
  }
  return '🌡️';
}

function generateAgroAdvice(weather) {
  const advice = [];
  const { temp, humidity, rain1h, windSpeed, description } = weather;

  // Irrigation tip
  if (rain1h > 5) {
    advice.push({ icon: '💧', title: 'Irrigation Tip', text: `${rain1h}mm of rain in the last hour detected. Skip irrigation today to conserve water and avoid waterlogging.` });
  } else if (humidity > 75) {
    advice.push({ icon: '💧', title: 'Irrigation Tip', text: `High humidity (${humidity}%) — reduce irrigation frequency. Root zone moisture is likely adequate.` });
  } else {
    advice.push({ icon: '💧', title: 'Irrigation Tip', text: `Moderate humidity (${humidity}%). Irrigate early morning to minimize evaporation losses.` });
  }

  // Harvest window
  if (windSpeed < 15 && !description.includes('rain') && !description.includes('storm')) {
    advice.push({ icon: '🌾', title: 'Harvest Window', text: `Low wind (${windSpeed} km/h) and clear conditions make today an ideal harvesting window. Plan mechanized operations now.` });
  } else {
    advice.push({ icon: '🌾', title: 'Harvest Window', text: `${description.charAt(0).toUpperCase() + description.slice(1)} conditions — defer harvesting. Wait for a dry spell to reduce post-harvest losses.` });
  }

  // Disease / pest alert
  if (humidity > 70 && temp > 25) {
    advice.push({ icon: '⚠️', title: 'Disease Alert', text: `${humidity}% humidity + ${temp}°C creates high fungal infection risk. Scout for leaf blight and powdery mildew. Consider a preventive fungicide spray.` });
  } else if (temp > 38) {
    advice.push({ icon: '🌡️', title: 'Heat Stress Warning', text: `Temperature of ${temp}°C may cause heat stress. Apply mulching and ensure plants are well-watered during peak afternoon hours.` });
  } else {
    advice.push({ icon: '✅', title: 'Disease Risk: Low', text: `Current conditions (${temp}°C, ${humidity}% RH) are within safe ranges. Continue regular crop scouting as a precaution.` });
  }

  return advice;
}

exports.getWeather = async (req, res) => {
  const { district } = req.query;
  if (!district) {
    return res.status(400).json({ error: 'district query parameter is required' });
  }

  // Check cache
  const cached = weatherCache.get(district);
  if (cached && Date.now() < cached.expiresAt) {
    return res.json(cached.data);
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenWeatherMap API key not configured' });
  }

  try {
    // Current weather
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(district)},IN&appid=${apiKey}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(district)},IN&appid=${apiKey}&units=metric&cnt=40`)
    ]);

    const curr = currentRes.data;
    const description = curr.weather[0].description;

    const weatherSummary = {
      city: curr.name,
      district,
      state: '',
      temp: Math.round(curr.main.temp),
      feels_like: Math.round(curr.main.feels_like),
      humidity: curr.main.humidity,
      wind_speed: Math.round(curr.wind.speed * 3.6), // m/s to km/h
      rain_prob: 0,
      rain1h: curr.rain?.['1h'] || 0,
      condition: description.charAt(0).toUpperCase() + description.slice(1),
      icon: getIcon(description),
      pressure: curr.main.pressure,
      visibility: curr.visibility ? Math.round(curr.visibility / 1000) : null,
    };

    // Process 5-day forecast (extract one entry per day)
    const dayMap = new Map();
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const item of forecastRes.data.list) {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          day: DAYS[date.getDay()],
          icon: getIcon(item.weather[0].description),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          rain: Math.round((item.pop || 0) * 100),
          condition: item.weather[0].description,
        });
      } else {
        const existing = dayMap.get(dayKey);
        existing.high = Math.max(existing.high, Math.round(item.main.temp_max));
        existing.low = Math.min(existing.low, Math.round(item.main.temp_min));
        existing.rain = Math.max(existing.rain, Math.round((item.pop || 0) * 100));
      }
    }
    const forecast = Array.from(dayMap.values()).slice(1, 7); // next 6 days

    // Generate agro advice
    const agroAdvice = generateAgroAdvice({
      temp: weatherSummary.temp,
      humidity: weatherSummary.humidity,
      rain1h: weatherSummary.rain1h,
      windSpeed: weatherSummary.wind_speed,
      description,
    });

    const responseData = { weather: weatherSummary, forecast, agroAdvice };

    // Cache the result
    weatherCache.set(district, { data: responseData, expiresAt: Date.now() + CACHE_TTL_MS });

    res.json(responseData);
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) {
      return res.status(404).json({ error: `Location "${district}" not found. Try a nearby city name.` });
    }
    console.error('Weather API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data', details: err.message });
  }
};
