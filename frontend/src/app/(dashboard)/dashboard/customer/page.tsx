'use client';

import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/booking.service';
import { Booking } from '@/types';
import { formatDate, statusColors, statusLabels } from '@/utils/format';
import { BookOpen, CheckCircle, Clock, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getAll({ per_page: 5 })
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === 'pending').length,
    active:    bookings.filter((b) => ['accepted', 'in_progress'].includes(b.status)).length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening with your bookings.</p>
        </div>
        <Link
          href="/technicians"
          className="inline-flex items-center gap-2 bg-[#1D234F] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#161b3d] transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Booking
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: stats.total,     icon: BookOpen,    bg: 'bg-blue-50',   icon_color: 'text-blue-600' },
          { label: 'Pending',        value: stats.pending,   icon: Clock,       bg: 'bg-yellow-50', icon_color: 'text-yellow-600' },
          { label: 'Active',         value: stats.active,    icon: CheckCircle, bg: 'bg-green-50',  icon_color: 'text-green-600' },
          { label: 'Completed',      value: stats.completed, icon: CheckCircle, bg: 'bg-purple-50', icon_color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, bg, icon_color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-5 h-5 ${icon_color}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/technicians">
          <div className="bg-gradient-to-br from-[#1D234F] to-[#1C9AD6] rounded-2xl p-5 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <Search className="w-8 h-8 mb-3 opacity-80" aria-hidden="true" />
            <h3 className="font-bold text-base mb-1">Find a Technician</h3>
            <p className="text-blue-100 text-sm">Browse verified professionals near you.</p>
          </div>
        </Link>
        <Link href="/dashboard/customer/bookings">
          <div className="bg-gradient-to-br from-[#59BD7B] to-green-600 rounded-2xl p-5 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <BookOpen className="w-8 h-8 mb-3 opacity-80" aria-hidden="true" />
            <h3 className="font-bold text-base mb-1">View All Bookings</h3>
            <p className="text-green-100 text-sm">Track and manage all your service requests.</p>
          </div>
        </Link>
      </div>

      {/* Recent bookings table */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
          <Link href="/dashboard/customer/bookings" className="text-xs text-[#1C9AD6] hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><LoadingSpinner size="sm" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10">
            <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No bookings yet.</p>
            <Link href="/technicians" className="text-sm text-[#1C9AD6] hover:underline mt-1 inline-block">
              Find a technician
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking #</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Technician</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3">
                      <Link href={`/dashboard/customer/bookings/${b.id}`} className="font-mono text-xs text-[#1C9AD6] hover:underline font-semibold">
                        {b.booking_number}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-700">{b.technician?.user?.name || '—'}</td>
                    <td className="py-3 text-gray-700">{b.category?.name || '—'}</td>
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
      </Card>
    </div>
  );
}
