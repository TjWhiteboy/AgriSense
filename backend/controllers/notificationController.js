const Notification = require('../models/Notification');
const axios = require('axios');

// Seed starter notifications for new users
async function seedNotificationsForUser(userId, district) {
  const existing = await Notification.countDocuments({ userId });
  if (existing > 0) return;

  const now = new Date();
  const starters = [
    {
      type: 'ai',
      icon: '🤖',
      title: 'Welcome to AgriSense!',
      message: 'Your AI-powered agriculture assistant is ready. Ask me anything about crops, diseases, or weather.',
      createdAt: new Date(now - 10 * 60 * 1000),
    },
    {
      type: 'scheme',
      icon: '🏛️',
      title: 'PM-KISAN Installment',
      message: 'The next PM-KISAN installment cycle is active. Verify your bank details at pmkisan.gov.in to avoid delays.',
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  // Fetch a real weather alert if district is provided
  if (district && process.env.OPENWEATHER_API_KEY) {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(district)},IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
      const w = res.data;
      const humidity = w.main.humidity;
      const description = w.weather[0].description;
      const temp = Math.round(w.main.temp);

      if (humidity > 75) {
        starters.unshift({
          type: 'disease',
          icon: '⚠️',
          title: `High Humidity Alert — ${w.name}`,
          message: `${humidity}% humidity detected in ${w.name}. This significantly increases risk of fungal infections like leaf blight. Scout your crops and consider a preventive fungicide spray.`,
          createdAt: new Date(now - 30 * 60 * 1000),
        });
      } else if (description.includes('rain')) {
        starters.unshift({
          type: 'weather',
          icon: '🌧️',
          title: `Rain Alert — ${w.name}`,
          message: `${description.charAt(0).toUpperCase() + description.slice(1)} detected in ${w.name}. Delay irrigation and secure machinery. Check drainage for waterlogging risk.`,
          createdAt: new Date(now - 20 * 60 * 1000),
        });
      } else if (temp > 38) {
        starters.unshift({
          type: 'weather',
          icon: '🌡️',
          title: `Heat Stress Warning — ${w.name}`,
          message: `Temperature is ${temp}°C in ${w.name}. Apply mulching and irrigate early morning to protect crops from heat stress.`,
          createdAt: new Date(now - 15 * 60 * 1000),
        });
      }
    } catch (_) { /* silently ignore */ }
  }

  await Notification.insertMany(starters.map(n => ({ ...n, userId })));
}

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const { district } = req.query;
    // Seed if first time
    await seedNotificationsForUser(req.user.id, district);

    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
};

// PUT /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

// PUT /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true }
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
