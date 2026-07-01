'use client';

import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PaymentModal from '@/components/ui/PaymentModal';
import { bookingService } from '@/services/booking.service';
import { Booking } from '@/types';
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
  Star,
  User,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CustomerBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const load = async () => {
    try {
      const res = await bookingService.getById(Number(id));
      setBooking(res.data);
    } catch {
      toast.error('Booking not found');
      router.push('/dashboard/customer/bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = async () => {
    if (!booking) return;
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await bookingService.updateStatus(booking.id, { status: 'cancelled' });
      toast.success('Booking cancelled');
      load();
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!booking) return null;

  const isPaid = booking.payment?.status === 'completed';
  const canPay =
    ['accepted', 'awaiting_payment', 'in_progress'].includes(booking.status) && !isPaid;
  const canCancel = booking.status === 'pending';

  /* ── timeline steps ─────────────────────────────────────── */
  const timeline = [
    {
      label: 'Booking Submitted',
      time: booking.created_at,
      done: true,
      icon: CheckCircle,
      color: 'text-[#59BD7B]',
    },
    {
      label: booking.status === 'rejected' ? 'Booking Rejected' : 'Accepted by Technician',
      time: booking.accepted_at ?? null,
      done: ['accepted', 'paid', 'in_progress', 'completed'].includes(booking.status),
      failed: booking.status === 'rejected',
      icon: booking.status === 'rejected' ? AlertCircle : CheckCircle,
      color: booking.status === 'rejected' ? 'text-red-500' : 'text-[#59BD7B]',
    },
    {
      label: 'Payment Completed',
      time: booking.payment?.paid_at ?? null,
      done: isPaid,
      icon: CreditCard,
      color: 'text-[#1C9AD6]',
    },
    {
      label: 'Work Started',
      time: booking.started_at ?? null,
      done: ['in_progress', 'completed'].includes(booking.status),
      icon: Wrench,
      color: 'text-purple-500',
    },
    {
      label: 'Job Completed',
      time: booking.completed_at ?? null,
      done: booking.status === 'completed',
      icon: CheckCircle,
      color: 'text-[#FFD530]',
    },
  ];

  return (
    <>
      {showPayment && (
        <PaymentModal
          booking={booking}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setShowPayment(false); load(); }}
        />
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* ── Back + title ─────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/customer/bookings"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Back to bookings"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Booking Detail</h1>
            <p className="text-xs font-mono text-[#1C9AD6] mt-0.5">{booking.booking_number}</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusColors[booking.status]}`}>
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left col (main info) ──────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Technician */}
            <Card>
              <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1C9AD6]" />
                Technician
              </h2>
              {booking.technician ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1C9AD6] flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {booking.technician.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{booking.technician.user?.name}</p>
                    <p className="text-sm text-[#1C9AD6]">{booking.technician.category?.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">
                        {(booking.technician.rating ?? 0).toFixed(1)} ({booking.technician.total_reviews} reviews)
                      </span>
                    </div>
                    {booking.technician.user?.city && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {booking.technician.user.city}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/technicians/${booking.technician.id}`}
                    className="ml-auto text-xs text-[#1C9AD6] hover:underline shrink-0"
                  >
                    View profile →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Technician info unavailable</p>
              )}
            </Card>

            {/* Booking info */}
            <Card>
              <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1C9AD6]" />
                Job Details
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
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Location</p>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {booking.address}, {booking.city}
                    </p>
                  </div>
                  {booking.estimated_cost != null && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Estimated Cost</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatCurrency(booking.estimated_cost)}
                      </p>
                    </div>
                  )}
                  {booking.final_cost != null && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Final Cost</p>
                      <p className="text-sm font-bold text-[#1D234F]">
                        {formatCurrency(booking.final_cost)}
                      </p>
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

                {booking.cancellation_reason && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-orange-700 mb-0.5">Cancellation Reason</p>
                    <p className="text-sm text-orange-600">{booking.cancellation_reason}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Payment */}
            {booking.payment && (
              <Card>
                <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#1C9AD6]" />
                  Payment
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Amount Paid</p>
                    <p className="font-bold text-gray-900">{formatCurrency(booking.payment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Method</p>
                    <p className="font-semibold text-gray-800 uppercase">{booking.payment.payment_method ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Status</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      booking.payment.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.payment.status === 'completed' ? '✓ Paid' : booking.payment.status}
                    </span>
                  </div>
                  {booking.payment.paid_at && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Paid At</p>
                      <p className="font-semibold text-gray-800">{formatDateTime(booking.payment.paid_at)}</p>
                    </div>
                  )}
                  {booking.payment.reference && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 mb-0.5">Reference</p>
                      <p className="font-mono text-xs text-gray-600">{booking.payment.reference}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Review */}
            {booking.review && (
              <Card>
                <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Your Review
                </h2>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < booking.review!.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                    />
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

          {/* ── Right col (timeline + actions) ───────────── */}
          <div className="space-y-5">

            {/* Actions */}
            <Card>
              <h2 className="text-sm font-bold text-gray-700 mb-4">Actions</h2>
              <div className="space-y-3">
                {canPay && (
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-[#1C9AD6] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#1587bc] transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="w-full border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling…' : 'Cancel Booking'}
                  </button>
                )}
                {booking.status === 'completed' && !booking.review && (
                  <Link
                    href={`/dashboard/customer/bookings/new?review=${booking.id}`}
                    className="w-full border border-yellow-300 text-yellow-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Leave a Review
                  </Link>
                )}
                {!canPay && !canCancel && booking.status !== 'completed' && (
                  <p className="text-xs text-gray-400 text-center py-2">No actions available</p>
                )}
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1C9AD6]" />
                Timeline
              </h2>
              <div className="space-y-0">
                {timeline.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          step.done
                            ? 'bg-green-100'
                            : step.failed
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-3.5 h-3.5 ${
                            step.done ? step.color : step.failed ? 'text-red-500' : 'text-gray-300'
                          }`} />
                        </div>
                        {i < timeline.length - 1 && (
                          <div className={`w-px flex-1 my-1 ${step.done ? 'bg-green-200' : 'bg-gray-100'}`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-xs font-semibold ${
                          step.done ? 'text-gray-800' : 'text-gray-400'
                        }`}>
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
    </>
  );
}
