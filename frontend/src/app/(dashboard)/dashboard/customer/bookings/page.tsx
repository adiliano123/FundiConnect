/* eslint-disable react-hooks/immutability */
'use client';

import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PaymentModal from '@/components/ui/PaymentModal';
import { bookingService } from '@/services/booking.service';
import { Booking, BookingStatus } from '@/types';
import { formatDate, statusColors, statusLabels } from '@/utils/format';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const tabs: { label: string; value: string }[] = [
  { label: 'All',       value: ''          },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Active',    value: 'accepted'  },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function CustomerBookingsPage() {
  const [bookings, setBookings]       = useState<Booking[]>([]);
  const [loading, setLoading]         = useState(true);
  const [status, setStatus]           = useState('');
  const [page, setPage]               = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);

  useEffect(() => { loadBookings(); }, [status, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAll({
        status: (status as BookingStatus) || undefined,
        page,
        per_page: 10,
      });
      setBookings(res.data);
      setLastPage(res.last_page);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await bookingService.updateStatus(id, { status: 'cancelled' });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div className="space-y-5">
      {payingBooking && (
        <PaymentModal
          booking={payingBooking}
          onClose={() => setPayingBooking(null)}
          onSuccess={() => { setPayingBooking(null); loadBookings(); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track all your service requests.</p>
        </div>
        <Link
          href="/technicians"
          className="inline-flex items-center gap-2 bg-[#1D234F] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#161b3d] transition-colors"
        >
          + New Booking
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => { setStatus(t.value); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              status === t.value ? 'bg-white text-[#1D234F] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="sm" />
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No bookings found"
            description="You haven't made any bookings yet."
          />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {['Booking #', 'Technician', 'Service', 'Date', 'Status', 'Payment', 'Actions'].map((h) => (
                    <th key={h} className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Booking number — links to detail */}
                    <td className="py-3">
                      <Link
                        href={`/dashboard/customer/bookings/${booking.id}`}
                        className="font-mono text-xs text-[#1C9AD6] font-semibold hover:underline"
                      >
                        {booking.booking_number}
                      </Link>
                    </td>

                    <td className="py-3 text-gray-700 text-xs">
                      {booking.technician?.user?.name ?? '—'}
                    </td>

                    <td className="py-3 text-gray-700 text-xs">
                      {booking.category?.name ?? '—'}
                    </td>

                    <td className="py-3 text-gray-500 text-xs">
                      {formatDate(booking.scheduled_at)}
                    </td>

                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </td>

                    <td className="py-3">
                      {booking.payment ? (
                        <div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            booking.payment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.payment.status === 'completed' ? '✓ Paid' : 'Pending'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            TZS {booking.payment.amount.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    <td className="py-3">
                      <div className="flex gap-2 items-center">
                        <Link
                          href={`/dashboard/customer/bookings/${booking.id}`}
                          className="px-2.5 py-1 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View
                        </Link>

                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Cancel
                          </button>
                        )}

                        {['accepted', 'awaiting_payment', 'in_progress'].includes(booking.status) &&
                          booking.payment?.status !== 'completed' && (
                            <button
                              onClick={() => setPayingBooking(booking)}
                              className="px-2.5 py-1 bg-[#1C9AD6] text-white text-xs font-semibold rounded-lg hover:bg-[#1587bc] transition-colors"
                            >
                              Pay
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex justify-center gap-2 mt-5 pt-5 border-t border-gray-100">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 text-xs text-gray-500">Page {page} of {lastPage}</span>
            <button
              disabled={page === lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
