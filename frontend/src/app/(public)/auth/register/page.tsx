'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authService } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  name:                  z.string().min(2, 'Name must be at least 2 characters'),
  email:                 z.string().email('Enter a valid email'),
  phone:                 z.string().optional(),
  password:              z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  role:                  z.enum(['customer', 'technician']),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

type FormData = z.infer<typeof schema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'customer' | 'technician') || 'customer';

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authService.register(data);
      localStorage.setItem('fc_token', res.token);
      localStorage.setItem('fc_user', JSON.stringify(res.user));
      toast.success('Account created successfully!');
      const redirect = res.user.role === 'technician' ? '/dashboard/technician' : '/dashboard/customer';
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#1D234F] rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-[#FFD530] font-black text-lg">FC</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Join FundiConnect today</p>
          </div>

          <div className="flex rounded-xl border border-gray-200 p-1 mb-6">
            {(['customer', 'technician'] as const).map((r) => (
              <button key={r} type="button" onClick={() => setValue('role', r)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${role === r ? 'bg-[#1D234F] text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                {r === 'customer' ? '👤 I need services' : '🔧 I am a technician'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input label="Full name" placeholder="John Mwangi" error={errors.name?.message} required {...register('name')} />
            <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} required {...register('email')} />
            <Input label="Phone number" type="tel" placeholder="+254 7XX XXX XXX" {...register('phone')} />
            <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} required {...register('password')} />
            <Input label="Confirm password" type="password" placeholder="Repeat your password" error={errors.password_confirmation?.message} required {...register('password_confirmation')} />
            <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#1C9AD6] font-medium hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-4">
            By registering, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#1D234F]" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
