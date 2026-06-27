'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Guard — if token or email missing, show error
  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-500 text-sm mb-6">
            This password reset link is missing required parameters. Please request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center gap-2 bg-[#1C9AD6] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1587bc] transition-colors"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/reset-password', {
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to reset password. The link may have expired.');
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

          {success ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Password reset!</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full"
                size="lg"
              >
                Sign in now →
              </Button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Set new password</h1>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Choose a strong password for{' '}
                  <span className="font-medium text-[#1D234F]">{email}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <Input
                  label="New password"
                  type="password"
                  placeholder="Min. 8 characters"
                  error={errors.password?.message}
                  required
                  {...register('password')}
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  placeholder="Repeat your new password"
                  error={errors.password_confirmation?.message}
                  required
                  {...register('password_confirmation')}
                />

                <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {!success && (
            <div className="mt-8 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1C9AD6] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Right: Brand panel */}
      <div className="hidden lg:flex flex-col justify-center flex-1 bg-[#0f1a2e] px-12 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1C9AD6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#FFD530]/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[#1C9AD6] text-xs font-bold uppercase tracking-widest mb-4">
            ACCOUNT SECURITY
          </p>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Choose a strong<br />new password
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            A strong password keeps your account and earnings safe. Use a combination
            of letters, numbers, and symbols for best security.
          </p>
          <div className="space-y-4">
            {[
              { label: 'At least 8 characters', desc: 'Longer passwords are harder to crack.' },
              { label: 'Mix of characters', desc: 'Use uppercase, numbers, and symbols.' },
              { label: 'Never share it', desc: 'FundiConnect staff will never ask for your password.' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFD530]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#FFD530]" />
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#1D234F]" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
