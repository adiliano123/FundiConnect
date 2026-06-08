'use client';

import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { bookingService } from '@/services/booking.service';
import { Booking, BookingStatus } from '@/types';
import { formatDate, statusColors, statusLabels } from '@/utils/format';
import { Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const tabs = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
];

export default function TechnicianJobsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => { load(); }, [status, page]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAll({ status: status as BookingStatus || undefined, page, per_page: 10 });
      setBookings(res.data);
      setLastPage(res.last_page);
    } finally { setLoading(false); }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await bookingService.updateStatus(id, { status: newStatus as BookingStatus });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as BookingStatus } : b));
      toast.success(`Job ${newStatus}`);
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Jobs</h1>
        <p className="text-gray-500 text-sm mt-0.5">All service requests assigned to you.</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.value} onClick={() => { setStatus(t.value); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${status === t.value ? 'bg-white text-[#1D234F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><LoadingSpinner size="sm" /></div>
        ) : bookings.length === 0 ? (
          <EmptyState icon={Briefcase} title="No jobs found" description="No service requests yet." />
        ) : (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50/70 transition-colors">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-[#1C9AD6] font-semibold">{b.booking_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm mt-1">{b.category?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{b.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span>👤 {b.customer?.name}</span>
                      <span>📍 {b.city}</span>
                      <span>📅 {formatDate(b.scheduled_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {b.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(b.id, 'accepted')} className="px-3 py-1.5 bg-[#59BD7B] text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors">Accept</button>
                        <button onClick={() => updateStatus(b.id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">Reject</button>
                      </>
                    )}
                    {b.status === 'accepted' && (
                      <button onClick={() => updateStatus(b.id, 'in_progress')} className="px-3 py-1.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors">Start Job</button>
                    )}
                    {b.status === 'in_progress' && (
                      <button onClick={() => updateStatus(b.id, 'completed')} className="px-3 py-1.5 bg-[#1D234F] text-white text-xs font-semibold rounded-lg hover:bg-[#161b3d] transition-colors">Mark Complete</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {lastPage > 1 && (
          <div className="flex justify-center gap-2 mt-5 pt-5 border-t border-gray-100">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
            <span className="px-3 py-1.5 text-xs text-gray-500">Page {page} of {lastPage}</span>
            <button disabled={page === lastPage} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        )}
      </Card>
    </div>
  );
}
