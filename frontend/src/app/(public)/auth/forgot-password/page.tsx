'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch {
      // Still show success to prevent email enumeration
      setSubmittedEmail(data.email);
      setSubmitted(true);
      toast.success('If that email exists, a reset link has been sent.');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#1D234F] rounded-lg flex items-center justify-center">
              <span className="text-[#FFD530] font-black text-sm">FC</span>
            </div>
            <span className="font-extrabold text-[#1D234F] text-lg">FundiConnect</span>
          </Link>

          {submitted ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Check your inbox</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                We sent a password reset link to:
              </p>
              <p className="font-semibold text-[#1D234F] text-sm mb-6">{submittedEmail}</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-8">
                Didn&apos;t receive it? Check your spam folder or wait a minute and try again.
                The link expires in <strong>60 minutes</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#1C9AD6] text-sm font-medium hover:underline"
              >
                Try a different email
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Forgot your password?</h1>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  No worries. Enter the email address linked to your account and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  required
                  {...register('email')}
                />

                <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
                  Send Reset Link
                </Button>
              </form>
            </>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1C9AD6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>

        </div>
      </div>

      {/* Right: Brand panel */}
      <div className="hidden lg:flex flex-col justify-center flex-1 bg-[#0f1a2e] px-12 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1C9AD6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#59BD7B]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-[#1C9AD6]/15 rounded-2xl flex items-center justify-center mb-8">
            <Mail className="w-8 h-8 text-[#1C9AD6]" />
          </div>
          <p className="text-[#1C9AD6] text-xs font-bold uppercase tracking-widest mb-4">
            ACCOUNT RECOVERY
          </p>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Secure &amp; instant<br />password recovery
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Enter your registered email and receive a secure one-time reset link
            delivered straight to your inbox. The link expires in 60 minutes for
            your safety.
          </p>
          <div className="space-y-4">
            {[
              { label: 'One-time secure link', desc: 'Each reset link works exactly once and expires in 60 min.' },
              { label: 'No account exposure', desc: 'We never confirm if an email is registered for your safety.' },
              { label: 'Instant email delivery', desc: 'Reset emails arrive within seconds via our mail server.' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#59BD7B]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#59BD7B]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
