import React, { useState } from 'react';

const NOTIFICATIONS = [
  { id: 1, type: 'weather', icon: '🌧️', title: 'Heavy Rain Alert', message: 'Heavy rainfall expected in Tiruchirappalli on Wednesday. Take precautions for your crops.', time: '2 hours ago', read: false },
  { id: 2, type: 'disease', icon: '⚠️', title: 'Disease Risk: High Humidity', message: '72% humidity increases risk of fungal infections. Consider fungicide application.', time: '5 hours ago', read: false },
  { id: 3, type: 'market', icon: '📈', title: 'Cotton Prices Up ₹150', message: 'Cotton prices have risen ₹150/quintal today. A good time to consider selling.', time: '1 day ago', read: true },
  { id: 4, type: 'scheme', icon: '🏛️', title: 'PM-KISAN Installment', message: 'The next PM-KISAN installment is due this month. Verify your bank details at pmkisan.gov.in', time: '2 days ago', read: true },
  { id: 5, type: 'ai', icon: '🤖', title: 'AI Tip for Your Crop', message: 'Based on the current weather, delay irrigation for paddy by 2 days for optimal water usage.', time: '3 days ago', read: true },
];

const typeColors: Record<string, string> = {
  weather: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400',
  disease: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400',
  market: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400',
  scheme: 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400',
  ai: 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400',
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">🔔 Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {unread > 0 ? `${unread} unread alerts` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary-700 dark:text-primary-400 font-semibold hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md ${typeColors[n.type]} ${!n.read ? 'opacity-100' : 'opacity-70'}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-semibold text-gray-900 dark:text-white ${!n.read ? 'font-bold' : ''}`}>{n.title}</h3>
                  {!n.read && <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔕</div>
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
