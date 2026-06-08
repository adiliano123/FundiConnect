'use client';

import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { bookingService } from '@/services/booking.service';
import { technicianService } from '@/services/technician.service';
import { Booking, Technician } from '@/types';
import { formatDate } from '@/utils/format';
import { useEffect, useState } from 'react';

export default function TechnicianEarningsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingService.getAll({ status: 'completed', per_page: 50 }),
      technicianService.getMyProfile(),
    ]).then(([bRes, tRes]) => {
      setBookings(bRes.data);
      setTechnician(tRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const totalEarnings = bookings.reduce((sum, b) => {
    return sum + (b.payment?.status === 'completed' ? b.payment.technician_payout : (b.final_cost || b.estimated_cost || 0));
  }, 0);
  const thisMonth = bookings.filter(b => {
    const d = new Date(b.completed_at || b.scheduled_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthEarnings = thisMonth.reduce((sum, b) => {
    return sum + (b.payment?.status === 'completed' ? b.payment.technician_payout : (b.final_cost || b.estimated_cost || 0));
  }, 0);

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of your completed jobs and income.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Earnings', value: `TZS ${totalEarnings.toLocaleString()}`, color: 'text-[#1D234F]' },
          { label: 'This Month', value: `TZS ${monthEarnings.toLocaleString()}`, color: 'text-[#59BD7B]' },
          { label: 'Completed Jobs', value: bookings.length, color: 'text-[#1C9AD6]' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-5">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-bold text-gray-900 mb-5">Completed Jobs</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No completed jobs yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {['Booking #', 'Customer', 'Service', 'Date', 'Amount'].map(h => (
                    <th key={h} className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/70">
                    <td className="py-3 font-mono text-xs text-[#1C9AD6] font-semibold">{b.booking_number}</td>
                    <td className="py-3 text-gray-700">{b.customer?.name || '—'}</td>
                    <td className="py-3 text-gray-700">{b.category?.name || '—'}</td>
                    <td className="py-3 text-gray-500 text-xs">{formatDate(b.scheduled_at)}</td>
                    <td className="py-3 font-semibold text-gray-900">
                      {b.payment?.status === 'completed' ? (
                        <div>
                          <span className="text-green-600">TZS {b.payment.technician_payout.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 block">of TZS {b.payment.amount.toLocaleString()}</span>
                        </div>
                      ) : (b.final_cost || b.estimated_cost) ? (
                        `TZS ${(b.final_cost || b.estimated_cost)!.toLocaleString()}`
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
