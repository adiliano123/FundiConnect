'use client';

import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { bookingService } from '@/services/booking.service';
import { Booking, BookingStatus } from '@/types';
import { formatCurrency, formatDateTime, statusColors, statusLabels } from '@/utils/format';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type ActionStatus = 'accepted' | 'rejected' | 'in_progress' | 'completed';

export default function TechnicianJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const load = async () => {
    try {
      const res = await bookingService.getById(Number(id));
      setBooking(res.data);
    } catch {
      toast.error('Job not found');
      router.push('/dashboard/technician/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatus = async (status: ActionStatus, extra?: Record<string, string>) => {
    if (!booking) return;
    setUpdating(true);
    try {
      await bookingService.updateStatus(booking.id, { status, ...extra } as { status: BookingStatus; rejection_reason?: string });
      toast.success(`Job ${statusLabels[status].toLowerCase()}`);
      load();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!booking) return null;

  const isPaid   = booking.payment?.status === 'completed';

  const timeline = [
    { label: 'Booking Received',      time: booking.created_at,    done: true,                                                      icon: CheckCircle, color: 'text-[#59BD7B]' },
    { label: 'Accepted',              time: booking.accepted_at ?? null, done: ['accepted','paid','in_progress','completed'].includes(booking.status), failed: booking.status === 'rejected', icon: booking.status === 'rejected' ? AlertCircle : CheckCircle, color: booking.status === 'rejected' ? 'text-red-500' : 'text-[#59BD7B]' },
    { label: 'Payment Received',      time: booking.payment?.paid_at ?? null, done: isPaid,                                         icon: CreditCard,  color: 'text-[#1C9AD6]' },
    { label: 'Work Started',          time: booking.started_at ?? null,  done: ['in_progress','completed'].includes(booking.status), icon: Clock,       color: 'text-purple-500' },
    { label: 'Job Completed',         time: booking.completed_at ?? null, done: booking.status === 'completed',                     icon: CheckCircle, color: 'text-[#FFD530]' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/technician/jobs"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Job Detail</h1>
          <p className="text-xs font-mono text-[#1C9AD6] mt-0.5">{booking.booking_number}</p>
        </div>
        <div className="ml-auto">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusColors[booking.status]}`}>
            {statusLabels[booking.status]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Main info ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Customer */}
          <Card>
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#1C9AD6]" /> Customer
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1D234F] flex items-center justify-center text-white font-bold text-lg shrink-0">
                {booking.customer?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{booking.customer?.name}</p>
                <p className="text-sm text-gray-500">{booking.customer?.email}</p>
                {booking.customer?.phone && (
                  <a href={`tel:${booking.customer.phone}`} className="flex items-center gap-1 text-xs text-[#1C9AD6] mt-1 hover:underline">
                    <Phone className="w-3 h-3" /> {booking.customer.phone}
                  </a>
                )}
              </div>
            </div>
          </Card>

          {/* Job details */}
          <Card>
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#1C9AD6]" /> Job Details
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Service</p>
                  <p className="text-sm font-semibold text-gray-800">{booking.category?.name ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Scheduled</p>
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {formatDateTime(booking.scheduled_at)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {booking.address}, {booking.city}
                  </p>
                </div>
                {booking.estimated_cost != null && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Estimated Cost</p>
                    <p className="text-sm font-semibold text-gray-800">{formatCurrency(booking.estimated_cost)}</p>
                  </div>
                )}
                {booking.final_cost != null && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Final Cost</p>
                    <p className="text-sm font-bold text-[#1D234F]">{formatCurrency(booking.final_cost)}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                  {booking.description}
                </p>
              </div>

              {booking.rejection_reason && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-700 mb-0.5">Rejection Reason</p>
                  <p className="text-sm text-red-600">{booking.rejection_reason}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment info */}
          {booking.payment && (
            <Card>
              <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1C9AD6]" /> Payment
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                  <p className="font-bold text-gray-900">{formatCurrency(booking.payment.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Your Payout</p>
                  <p className="font-bold text-[#59BD7B]">{formatCurrency(booking.payment.technician_payout)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Platform Fee</p>
                  <p className="font-semibold text-gray-600">{formatCurrency(booking.payment.platform_fee)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {isPaid ? '✓ Paid' : booking.payment.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Method</p>
                  <p className="font-semibold text-gray-800 uppercase">{booking.payment.payment_method ?? '—'}</p>
                </div>
                {booking.payment.paid_at && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Paid At</p>
                    <p className="font-semibold text-gray-800">{formatDateTime(booking.payment.paid_at)}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Review left by customer */}
          {booking.review && (
            <Card>
              <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" /> Customer Review
              </h2>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < booking.review!.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
                <span className="text-sm font-semibold text-gray-700 ml-1">{booking.review.rating}/5</span>
              </div>
              {booking.review.comment && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">
                  {booking.review.comment}
                </p>
              )}
            </Card>
          )}
        </div>

        {/* ── Right col: actions + timeline ─────────────── */}
        <div className="space-y-5">

          {/* Actions */}
          <Card>
            <h2 className="text-sm font-bold text-gray-700 mb-4">Actions</h2>
            <div className="space-y-2">
              {booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatus('accepted')}
                    disabled={updating}
                    className="w-full bg-[#59BD7B] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    ✓ Accept Job
                  </button>
                  {!showRejectForm ? (
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="w-full border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      ✕ Reject Job
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection…"
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatus('rejected', { rejection_reason: rejectReason })}
                          disabled={!rejectReason.trim() || updating}
                          className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => setShowRejectForm(false)}
                          className="flex-1 border border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              {booking.status === 'accepted' && (
                <button
                  onClick={() => handleStatus('in_progress')}
                  disabled={updating}
                  className="w-full bg-blue-600 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  ▶ Start Job
                </button>
              )}
              {booking.status === 'in_progress' && (
                <button
                  onClick={() => handleStatus('completed')}
                  disabled={updating}
                  className="w-full bg-[#1D234F] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#161b3d] transition-colors disabled:opacity-50"
                >
                  ✓ Mark Complete
                </button>
              )}
              {['completed', 'rejected', 'cancelled'].includes(booking.status) && (
                <p className="text-xs text-gray-400 text-center py-2">No actions available</p>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1C9AD6]" /> Timeline
            </h2>
            <div>
              {timeline.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        step.done ? 'bg-green-100' : step.failed ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${step.done ? step.color : step.failed ? 'text-red-500' : 'text-gray-300'}`} />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className={`w-px flex-1 my-1 ${step.done ? 'bg-green-200' : 'bg-gray-100'}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-xs font-semibold ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {step.time && (
                        <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(step.time)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
