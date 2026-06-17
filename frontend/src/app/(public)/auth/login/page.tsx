'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, CreditCard, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const features = [
  {
    icon: Zap,
    title: 'Instant Bookings',
    desc: 'Connect with verified technicians in seconds across Tanzania.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    desc: 'Pay via M-Pesa, Airtel, Tigo, HaloPesa or card — all secured.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Tracking',
    desc: 'Track every booking and payment with live updates.',
  },
  {
    icon: Shield,
    title: 'Verified Professionals',
    desc: '256-bit encryption and admin-verified technician profiles.',
  },
];

function LoginForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') ||
        (user.role === 'admin' ? '/admin/dashboard' :
         user.role === 'technician' ? '/dashboard/technician' : '/dashboard/customer');
      router.push(redirect);
    }
  }, [user, router, searchParams]);

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Form ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-[#1D234F] rounded-lg flex items-center justify-center">
                <span className="text-[#FFD530] font-black text-sm">FC</span>
              </div>
              <span className="font-extrabold text-[#1D234F] text-lg">FundiConnect</span>
            </Link>
            <div className="inline-block border border-[#1C9AD6] text-[#1C9AD6] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              TECHNICIAN MARKETPLACE
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
            <p className="text-gray-500 text-sm mt-2">Manage bookings, track payments, and grow your business.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#1C9AD6] rounded" />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-[#1C9AD6] font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
              Sign In →
            </Button>


          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-[#1C9AD6] font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Brand panel ── */}
      <div className="hidden lg:flex flex-col justify-center flex-1 bg-[#0f1a2e] px-12 py-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1C9AD6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#59BD7B]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[#1C9AD6] text-xs font-bold uppercase tracking-widest mb-4">
            FUNDICONNECT PLATFORM
          </p>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Tanzania&apos;s Marketplace for Skilled Technicians
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Book verified technicians, process payments via mobile money or card,
            and manage everything from one powerful dashboard.
          </p>

          <div className="space-y-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#1C9AD6]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4.5 h-4.5 text-[#1C9AD6]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#1D234F]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
