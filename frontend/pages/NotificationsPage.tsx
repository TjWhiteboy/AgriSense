import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface Notification {
  _id: string;
  type: 'weather' | 'disease' | 'market' | 'scheme' | 'ai' | 'system';
  icon: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const typeColors: Record<string, string> = {
  weather: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400',
  disease: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400',
  market: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400',
  scheme: 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400',
  ai: 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400',
  system: 'bg-gray-50 dark:bg-gray-900/20 border-l-4 border-gray-400',
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} minutes ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? 's' : ''} ago`;
}

const NotificationsPage: React.FC<{ district?: string }> = ({ district = '' }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const query = district ? `?district=${encodeURIComponent(district)}` : '';
        const res = await apiClient.get(`/notifications${query}`);
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [district]);

  const markRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`, {});
      setNotifications(ns => ns.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (_) {}
  };

  const markAllRead = async () => {
    try {
      await apiClient.put('/notifications/read-all', {});
      setNotifications(ns => ns.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">🔔 Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {loading ? 'Loading…' : unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary-700 dark:text-primary-400 font-semibold hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))
          : notifications.map(n => (
              <div
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                className={`rounded-2xl p-4 transition-all hover:shadow-md ${typeColors[n.type]} ${!n.read ? 'opacity-100 cursor-pointer' : 'opacity-70'}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm text-gray-900 dark:text-white ${!n.read ? 'font-bold' : 'font-semibold'}`}>{n.title}</h3>
                      {!n.read && <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{relativeTime(n.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {!loading && notifications.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔕</div>
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
