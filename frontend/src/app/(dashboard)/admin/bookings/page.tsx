'use client';

import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { bookingService } from '@/services/booking.service';
import { Booking, BookingStatus } from '@/types';
import { formatDate, statusColors, statusLabels } from '@/utils/format';
import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

const tabs = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => { load(); }, [status, page]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAll({ status: status as BookingStatus || undefined, page, per_page: 15 });
      setBookings(res.data);
      setLastPage(res.last_page);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 text-sm mt-0.5">All platform service bookings.</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.value} onClick={() => { setStatus(t.value); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${status === t.value ? 'bg-white text-[#1D234F] shadow-sm' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><LoadingSpinner size="sm" /></div>
        ) : bookings.length === 0 ? (
          <EmptyState icon={BookOpen} title="No bookings found" description="" />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {['Booking #', 'Customer', 'Technician', 'Service', 'City', 'Date', 'Status'].map(h => (
                    <th key={h} className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/70">
                    <td className="py-3 font-mono text-xs text-[#1C9AD6] font-semibold">{b.booking_number}</td>
                    <td className="py-3 text-gray-700">{b.customer?.name || '—'}</td>
                    <td className="py-3 text-gray-700">{b.technician?.user?.name || '—'}</td>
                    <td className="py-3 text-gray-700">{b.category?.name || '—'}</td>
                    <td className="py-3 text-gray-500 text-xs">{b.city}</td>
                    <td className="py-3 text-gray-500 text-xs">{formatDate(b.scheduled_at)}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
