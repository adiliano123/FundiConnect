'use client';

import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { adminService } from '@/services/admin.service';
import { formatCurrency, formatDate, statusColors, statusLabels } from '@/utils/format';
import {
  AlertCircle, BookOpen, CheckCircle, DollarSign,
  Star, TrendingUp, Users, Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (!data) return null;

  const { stats, recent_bookings } = data;

  const statCards = [
    { label: 'Total Users',           value: stats.total_users,           icon: Users,       bg: 'bg-blue-50',   color: 'text-blue-600',   href: '/admin/users' },
    { label: 'Technicians',           value: stats.total_technicians,     icon: Wrench,      bg: 'bg-purple-50', color: 'text-purple-600', href: '/admin/technicians' },
    { label: 'Total Bookings',        value: stats.total_bookings,        icon: BookOpen,    bg: 'bg-green-50',  color: 'text-green-600',  href: '/admin/bookings' },
    { label: 'Revenue',               value: formatCurrency(stats.total_revenue), icon: DollarSign, bg: 'bg-yellow-50', color: 'text-yellow-600', href: '/admin/revenue' },
    { label: 'Pending Verifications', value: stats.pending_verifications, icon: CheckCircle, bg: 'bg-orange-50', color: 'text-orange-600', href: '/admin/technicians' },
    { label: 'Open Complaints',       value: stats.open_complaints,       icon: AlertCircle, bg: 'bg-red-50',    color: 'text-red-600',    href: '/admin/complaints' },
    { label: 'Total Reviews',         value: stats.total_reviews,         icon: Star,        bg: 'bg-cyan-50',   color: 'text-cyan-600',   href: '/admin/reviews' },
    { label: 'Platform Earnings',     value: formatCurrency(stats.platform_earnings), icon: TrendingUp, bg: 'bg-teal-50', color: 'text-teal-600', href: '/admin/revenue' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Platform overview and key metrics.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, bg, color, href }) => (
          <Link key={label} href={href}>
            <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{label}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs text-[#1C9AD6] hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left border-b border-gray-100">
                {['Booking #', 'Customer', 'Technician', 'Service', 'Date', 'Status'].map((h) => (
                  <th key={h} className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recent_bookings?.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 font-mono text-xs text-[#1C9AD6] font-semibold">{b.booking_number}</td>
                  <td className="py-3 text-gray-700">{b.customer?.name || '—'}</td>
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
      </Card>
    </div>
  );
}
