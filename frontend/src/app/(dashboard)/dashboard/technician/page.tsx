'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/booking.service';
import { technicianService } from '@/services/technician.service';
import { Booking, Technician } from '@/types';
import { formatDate, statusColors, statusLabels } from '@/utils/format';
import { Briefcase, CheckCircle, Clock, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingService.getAll({ per_page: 10 }),
      technicianService.getMyProfile(),
    ]).then(([bookRes, techRes]) => {
      setBookings(bookRes.data);
      setTechnician(techRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    try {
      await bookingService.updateStatus(bookingId, { status: status as any });
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: status as any } : b));
      toast.success(`Booking ${status}`);
    } catch {
      toast.error('Failed to update booking status');
    }
  };

  const pendingJobs   = bookings.filter((b) => b.status === 'pending');
  const activeJobs    = bookings.filter((b) => ['accepted', 'in_progress'].includes(b.status));
  const completedJobs = bookings.filter((b) => b.status === 'completed');

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your jobs and track your performance.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {technician && (
            <Badge variant={technician.is_available ? 'success' : 'danger'}>
              {technician.is_available ? 'Available' : 'Unavailable'}
            </Badge>
          )}
          {technician?.verification_status !== 'verified' && (
            <Badge variant="warning">{technician?.verification_status}</Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'New Requests',  value: pendingJobs.length,   icon: Clock,       bg: 'bg-yellow-50', color: 'text-yellow-600' },
          { label: 'Active Jobs',   value: activeJobs.length,    icon: Briefcase,   bg: 'bg-blue-50',   color: 'text-blue-600' },
          { label: 'Completed',     value: completedJobs.length, icon: CheckCircle, bg: 'bg-green-50',  color: 'text-green-600' },
          {
            label: 'Rating',
            value: technician ? `${(technician.rating ?? 0).toFixed(1)}★` : '—',
            icon: Star, bg: 'bg-purple-50', color: 'text-purple-600',
          },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile summary */}
      {technician && (
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-4xl font-black text-[#1D234F]">{(technician.rating ?? 0).toFixed(1)}</div>
                <StarRating rating={Math.round(technician.rating ?? 0)} size="sm" />
                <p className="text-xs text-gray-400 mt-1">{technician.total_reviews} reviews</p>
              </div>
              <div className="text-sm space-y-1 text-gray-600">
                <p>Jobs completed: <span className="font-semibold text-gray-900">{technician.total_jobs}</span></p>
                <p>Experience: <span className="font-semibold text-gray-900">{technician.experience_years} yrs</span></p>
                <p>Category: <span className="font-semibold text-gray-900">{technician.category?.name || '—'}</span></p>
              </div>
            </div>
            <Link
              href="/dashboard/technician/profile"
              className="text-sm font-semibold text-[#1C9AD6] border border-[#1C9AD6] px-4 py-2 rounded-xl hover:bg-[#1C9AD6] hover:text-white transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </Card>
      )}

      {/* Pending job requests */}
      {pendingJobs.length > 0 && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            New Job Requests
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">
              {pendingJobs.length}
            </span>
          </h2>
          <div className="space-y-3">
            {pendingJobs.map((b) => (
              <div key={b.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50/70 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{b.category?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{b.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span>📍 {b.city}</span>
                      <span>📅 {formatDate(b.scheduled_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'accepted')}
                      className="px-3 py-1.5 bg-[#59BD7B] text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All jobs table */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">All Jobs</h2>
          <Link href="/dashboard/technician/jobs" className="text-xs text-[#1C9AD6] hover:underline font-medium">
            View all →
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <TrendingUp className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No jobs yet. Complete your profile to start receiving requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking #</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.slice(0, 8).map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 font-mono text-xs text-[#1C9AD6] font-semibold">{b.booking_number}</td>
                    <td className="py-3 text-gray-700">{b.customer?.name || '—'}</td>
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
