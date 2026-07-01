'use client';

import { paymentService } from '@/services/payment.service';
import { Booking, PaymentMethod } from '@/types';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Button from './Button';

const MOBILE_METHODS: { value: PaymentMethod; label: string; color: string }[] = [
  { value: 'mpesa',    label: 'M-Pesa',      color: '#00A550' },
  { value: 'airtel',   label: 'Airtel Money', color: '#E40000' },
  { value: 'tigopesa', label: 'Tigo Pesa',   color: '#00AEEF' },
  { value: 'halopesa', label: 'HaloPesa',    color: '#F7941D' },
];

const CARD_METHODS: { value: PaymentMethod; label: string; color: string }[] = [
  { value: 'visa',       label: 'Visa',       color: '#1A1F71' },
  { value: 'mastercard', label: 'Mastercard', color: '#EB001B' },
];

type Step = 'form' | 'processing' | 'polling' | 'success' | 'failed';

interface Props {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ booking, onClose, onSuccess }: Props) {
  const [method, setMethod]   = useState<PaymentMethod>('mpesa');
  const [phone, setPhone]     = useState('');
  const [amount, setAmount]   = useState(booking.final_cost ?? booking.estimated_cost ?? 0);
  const [step, setStep]       = useState<Step>('form');
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Waiting for payment confirmation…');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isMobile = MOBILE_METHODS.some(m => m.value === method);
  const MAX_POLLS = 24; // 2 minutes at 5s intervals

  // Start polling after STK push
  useEffect(() => {
    if (step !== 'polling' || !paymentId) return;

    pollRef.current = setInterval(async () => {
      setPollCount(c => {
        if (c >= MAX_POLLS) {
          clearInterval(pollRef.current!);
          setStep('failed');
          setStatusMsg('Payment timed out. Please try again.');
          return c;
        }
        return c + 1;
      });

      try {
        const res = await paymentService.verify(paymentId);
        if (res.status === 'COMPLETED') {
          clearInterval(pollRef.current!);
          setStep('success');
          toast.success('Payment confirmed! Check your email for the receipt.');
        } else if (res.status === 'FAILED' || res.status === 'CANCELLED') {
          clearInterval(pollRef.current!);
          setStep('failed');
          setStatusMsg(res.message || 'Payment failed. Please try again.');
        }
      } catch {
        // keep polling on network errors
      }
    }, 5000);

    return () => clearInterval(pollRef.current!);
  }, [step, paymentId]);

  const handlePay = async () => {
    if (amount <= 0) return toast.error('Enter a valid amount');
    if (isMobile && !phone.trim()) return toast.error('Enter your phone number');

    setLoading(true);
    setStep('processing');

    try {
      const res = await paymentService.initiate(booking.id, {
        amount,
        payment_method: method,
        phone_number:   isMobile ? phone : undefined,
      });

      if (!res.data?.id) {
        setStep('form');
        toast.error(res.message || 'Payment initiation failed');
        setLoading(false);
        return;
      }

      setPaymentId(res.data.id);

      if (isMobile) {
        setStatusMsg(`STK push sent to ${phone}. Check your phone and enter your PIN.`);
        setStep('polling');
      } else {
        // Cards — polling still works as webhook will fire
        setStatusMsg('Processing card payment…');
        setStep('polling');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setStep('form');
      toast.error(e.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-[#1D234F] px-6 py-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-white font-bold text-base">Pay for Booking</p>
            <p className="text-blue-200 text-xs font-mono mt-0.5">{booking.booking_number}</p>
          </div>
          {step !== 'polling' && step !== 'processing' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        <div className="p-6">

          {/* ── FORM ── */}
          {step === 'form' && (
            <div className="space-y-5">
              {/* Amount */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Amount (TZS)</label>
                <input
                  type="number" min={100} value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                />
              </div>

              {/* Mobile money */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Mobile Money</label>
                <div className="grid grid-cols-2 gap-2">
                  {MOBILE_METHODS.map(m => (
                    <button key={m.value} type="button" onClick={() => setMethod(m.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                        method === m.value ? 'border-[#1C9AD6] bg-blue-50 text-[#1C9AD6]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Card</label>
                <div className="grid grid-cols-2 gap-2">
                  {CARD_METHODS.map(m => (
                    <button key={m.value} type="button" onClick={() => setMethod(m.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                        method === m.value ? 'border-[#1C9AD6] bg-blue-50 text-[#1C9AD6]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone */}
              {isMobile && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="0712 345 678 or 255712345678"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                  />
                </div>
              )}

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between text-gray-500"><span>Amount</span><span className="font-semibold text-gray-900">TZS {amount.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Method</span><span className="font-semibold text-gray-900 uppercase">{method}</span></div>
              </div>

              <Button onClick={handlePay} isLoading={loading} className="w-full">
                Pay TZS {amount.toLocaleString()}
              </Button>
            </div>
          )}

          {/* ── PROCESSING ── */}
          {step === 'processing' && (
            <div className="py-10 text-center space-y-3">
              <div className="text-5xl animate-pulse">📡</div>
              <p className="font-semibold text-gray-800">Sending payment request…</p>
              <p className="text-gray-400 text-sm">Connecting to {method.toUpperCase()}</p>
            </div>
          )}

          {/* ── POLLING / WAITING ── */}
          {step === 'polling' && (
            <div className="py-8 text-center space-y-4">
              <div className="text-5xl animate-bounce">📱</div>
              <p className="font-bold text-gray-900">{statusMsg}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 text-left space-y-1">
                <p className="font-semibold">How to complete:</p>
                <p>1. Check your phone for a payment prompt</p>
                <p>2. Enter your {method.toUpperCase()} PIN</p>
                <p>3. This page will update automatically</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block" />
                Checking payment status… ({Math.min(pollCount * 5, MAX_POLLS * 5)}s)
              </div>
              <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 underline mt-2">
                I&apos;ll check later
              </button>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="text-6xl">✅</div>
              <p className="text-xl font-bold text-green-700">Payment Confirmed!</p>
              <p className="text-gray-500 text-sm">TZS {amount.toLocaleString()} paid via {method.toUpperCase()}.<br />Receipt sent to your email.</p>
              <Button onClick={onSuccess} className="w-full">Done</Button>
            </div>
          )}

          {/* ── FAILED ── */}
          {step === 'failed' && (
            <div className="py-8 text-center space-y-4">
              <div className="text-6xl">❌</div>
              <p className="text-xl font-bold text-red-600">Payment Failed</p>
              <p className="text-gray-500 text-sm">{statusMsg}</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setStep('form'); setPollCount(0); }} className="flex-1">Try Again</Button>
                <Button onClick={onClose} className="flex-1">Close</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
