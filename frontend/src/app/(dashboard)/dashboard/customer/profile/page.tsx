'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const profileSchema = z.object({
  name:  z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  city:  z.string().optional(),
});

const passwordSchema = z.object({
  current_password:      z.string().min(1),
  password:              z.string().min(8, 'At least 8 characters'),
  password_confirmation: z.string(),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Passwords do not match', path: ['password_confirmation'],
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function CustomerProfilePage() {
  const { user, setUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '', city: user?.city || '' },
  });

  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = async (data: ProfileData) => {
    try {
      const res = await api.put('/profile', data);
      setUser(res.data.user);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
  };

  const onPasswordSubmit = async (data: PasswordData) => {
    try {
      await api.post('/profile/password', data);
      toast.success('Password changed');
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      await api.post('/profile/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const meRes = await api.get('/auth/me');
      setUser(meRes.data.user);
      toast.success('Photo updated');
    } catch { toast.error('Failed to upload photo'); }
    finally { setUploading(false); }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account information.</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#1C9AD6] flex items-center justify-center">
            {(user?.avatar_url || user?.avatar) ? (
              <img src={user.avatar_url || user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-6 h-6 bg-[#1C9AD6] rounded-full flex items-center justify-center text-white hover:bg-[#1587bc] transition-colors shadow"
            aria-label="Upload photo"
          >
            <Camera className="w-3 h-3" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">{user?.role}</span>
          <p className="text-xs text-gray-400 mt-1">Click the camera icon to update your photo</p>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Personal Information</h2>
        <Input label="Full Name" error={profileForm.formState.errors.name?.message} required {...profileForm.register('name')} />
        <Input label="Phone Number" placeholder="+255 700 000 000" {...profileForm.register('phone')} />
        <Input label="City" placeholder="Dar es Salaam" {...profileForm.register('city')} />
        <Button type="submit" isLoading={profileForm.formState.isSubmitting}>Save Changes</Button>
      </form>

      {/* Password form */}
      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Change Password</h2>
        <Input label="Current Password" type="password" error={passwordForm.formState.errors.current_password?.message} required {...passwordForm.register('current_password')} />
        <Input label="New Password" type="password" error={passwordForm.formState.errors.password?.message} required {...passwordForm.register('password')} />
        <Input label="Confirm New Password" type="password" error={passwordForm.formState.errors.password_confirmation?.message} required {...passwordForm.register('password_confirmation')} />
        <Button type="submit" variant="outline" isLoading={passwordForm.formState.isSubmitting}>Update Password</Button>
      </form>
    </div>
  );
}
