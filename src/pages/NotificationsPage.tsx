import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { NotificationItem } from '../types.ts';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldX,
  Info,
  CheckCheck,
} from 'lucide-react';

interface Props {
  onRefreshUnread?: () => void;
}

export const NotificationsPage: React.FC<Props> = ({ onRefreshUnread }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        if (onRefreshUnread) onRefreshUnread();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      if (onRefreshUnread) onRefreshUnread();
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      if (onRefreshUnread) onRefreshUnread();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Bell className="w-4 h-4" />
            <span>Activity Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Notifications & Safety Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time notifications regarding your comments and moderation audits.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-slate-700 dark:text-slate-200"
          >
            <CheckCheck className="w-4 h-4 text-indigo-500" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-slate-500">
          No notifications right now. Everything is quiet!
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((item) => {
          const isSafe = item.type === 'safe';
          const isWarning = item.type === 'warning';
          const isBlocked = item.type === 'blocked';

          return (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 shadow-2xs ${
                item.is_read
                  ? 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 opacity-80'
                  : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/80 shadow-xs'
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  isSafe
                    ? 'bg-emerald-500 text-white'
                    : isWarning
                    ? 'bg-amber-500 text-white'
                    : isBlocked
                    ? 'bg-rose-500 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isSafe && <CheckCircle2 className="w-4 h-4" />}
                {isWarning && <AlertTriangle className="w-4 h-4" />}
                {isBlocked && <ShieldX className="w-4 h-4" />}
                {!isSafe && !isWarning && !isBlocked && <Info className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {!item.is_read && (
                <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
