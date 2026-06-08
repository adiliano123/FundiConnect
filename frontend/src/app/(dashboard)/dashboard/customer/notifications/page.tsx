'use client';

import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import api from '@/lib/axios';
import { AppNotification } from '@/types';
import { timeAgo } from '@/utils/format';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then(({ data }) => setNotifications(data.data)).finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch { toast.error('Failed to mark as read'); }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      toast.success('All notifications marked as read');
    } catch { toast.error('Failed to update notifications'); }
  };

  const unread = notifications.filter(n => !n.read_at).length;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-[#1C9AD6] hover:underline font-medium">Mark all read</button>
        )}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><LoadingSpinner size="sm" /></div>
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-start gap-3 py-4 px-1 ${!n.read_at ? 'bg-blue-50/30' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read_at ? 'bg-[#1C9AD6]' : 'bg-gray-200'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{n.data.message}</p>
                  {n.data.booking_number && (
                    <p className="text-xs text-gray-400 mt-0.5">Booking #{n.data.booking_number}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                </div>
                {!n.read_at && (
                  <button onClick={() => markRead(n.id)} className="text-xs text-[#1C9AD6] hover:underline flex-shrink-0">Mark read</button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
