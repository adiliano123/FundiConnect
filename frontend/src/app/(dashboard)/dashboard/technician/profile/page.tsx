'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { categoryService } from '@/services/category.service';
import { technicianService } from '@/services/technician.service';
import { Category, Technician } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  bio:               z.string().max(500).optional(),
  description:       z.string().optional(),
  experience_years:  z.number().min(0).max(50),
  hourly_rate:       z.number().min(0),
  city:              z.string().optional(),
  service_area:      z.string().optional(),
  category_id:       z.number().optional(),
  is_available:      z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function TechnicianProfilePage() {
  const { setUser } = useAuth();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    Promise.all([technicianService.getMyProfile(), categoryService.getAll()])
      .then(([techRes, catRes]) => {
        setTechnician(techRes.data);
        setCategories(catRes.data);
        setSelectedSkills(techRes.data.skills?.map((s) => s.id) || []);
        reset({
          bio: techRes.data.bio || '',
          description: techRes.data.description || '',
          experience_years: techRes.data.experience_years ?? 0,
          hourly_rate: techRes.data.hourly_rate ?? 0,
          city: techRes.data.user?.city || '',
          service_area: techRes.data.service_area || '',
          category_id: techRes.data.category_id ?? undefined,
          is_available: techRes.data.is_available,
        });
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const { city, ...technicianData } = data;
      // Update user city and technician profile in parallel
      await Promise.all([
        api.put('/profile', { city }),
        technicianService.updateProfile({ ...technicianData, skills: selectedSkills as any }),
      ]);
      const [techRes, meRes] = await Promise.all([
        technicianService.getMyProfile(),
        api.get('/auth/me'),
      ]);
      setTechnician(techRes.data);
      setUser(meRes.data.user);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await technicianService.uploadAvatar(file);
      // Refresh both technician profile and auth user
      const [updated, meRes] = await Promise.all([
        technicianService.getMyProfile(),
        api.get('/auth/me'),
      ]);
      setTechnician(updated.data);
      setUser(meRes.data.user); // updates header avatar instantly
      toast.success('Photo updated');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      await technicianService.uploadPortfolio(files);
      toast.success('Portfolio images uploaded');
      const res = await technicianService.getMyProfile();
      setTechnician(res.data);
    } catch {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const toggleSkill = (id: number) => {
    setSelectedSkills((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Keep your profile up-to-date to attract more clients.</p>
      </div>

      {/* Verification banner */}
      {technician?.verification_status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          Your profile is pending verification. You'll start receiving job requests once verified by admin.
        </div>
      )}

      <div className="space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Profile Photo</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-[#1C9AD6] flex items-center justify-center">
              {(technician?.user?.avatar_url || technician?.user?.avatar) ? (
                <img src={technician.user.avatar_url || technician.user.avatar} alt="Profile photo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">{technician?.user?.name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} aria-label="Upload avatar" />
              <Button variant="outline" size="sm" isLoading={uploading} onClick={() => fileRef.current?.click()}>
                Upload Photo
              </Button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-900">Professional Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Years of Experience"
              type="number"
              min={0}
              max={50}
              error={errors.experience_years?.message}
              {...register('experience_years', { valueAsNumber: true })}
            />
            <Input
              label="Hourly Rate (TZS)"
              type="number"
              min={0}
              error={errors.hourly_rate?.message}
              {...register('hourly_rate', { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Short Bio</label>
            <input
              type="text"
              placeholder="Brief professional summary (max 500 chars)"
              maxLength={500}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
              {...register('bio')}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Detailed Description</label>
            <textarea
              rows={4}
              placeholder="Tell clients about your expertise, experience, and approach..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6] resize-none"
              {...register('description')}
            />
          </div>

          <Input
            label="City"
            placeholder="e.g. Dar es Salaam"
            {...register('city')}
          />

          <Input
            label="Service Area"
            placeholder="e.g. Dar es Salaam, Arusha, Mwanza"
            {...register('service_area')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Primary Category</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
              {...register('category_id', { valueAsNumber: true })}
            >
              <option value="">Select primary category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Skills / Services Offered</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleSkill(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selectedSkills.includes(cat.id)
                      ? 'bg-[#1D234F] text-white border-[#1D234F]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-[#1D234F]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="available" className="w-4 h-4 accent-[#1C9AD6]" {...register('is_available')} />
            <label htmlFor="available" className="text-sm text-gray-700">I am currently available for new jobs</label>
          </div>

          <Button type="submit" isLoading={isSubmitting}>Save Profile</Button>
        </form>

        {/* Portfolio Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-2">Portfolio Images</h2>
          <p className="text-sm text-gray-500 mb-4">Showcase your work with before/after photos.</p>

          {technician?.portfolio_images && technician.portfolio_images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {technician.portfolio_images.map((img) => (
                <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={img.image_url} alt={img.caption || 'Portfolio'} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <input ref={portfolioRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePortfolioUpload} aria-label="Upload portfolio images" />
          <Button variant="outline" isLoading={uploading} onClick={() => portfolioRef.current?.click()}>
            Upload Images
          </Button>
        </div>
      </div>
    </div>
  );
}
