'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Select from '@/components/ui/Select';
import { bookingService } from '@/services/booking.service';
import { categoryService } from '@/services/category.service';
import { technicianService } from '@/services/technician.service';
import { Category, Technician } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  technician_id: z.string().min(1, 'Select a technician'),
  category_id:   z.string().min(1, 'Select a category'),
  description:   z.string().min(20, 'Please describe the work needed (at least 20 characters)'),
  address:       z.string().min(5, 'Enter your address'),
  city:          z.string().min(2, 'Enter your city'),
  scheduled_at:  z.string().min(1, 'Select a date and time'),
});

type FormData = z.infer<typeof schema>;

function NewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const technicianId = searchParams.get('technician_id');

  const [categories, setCategories] = useState<Category[]>([]);
  const [technician, setTechnician] = useState<Technician | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { technician_id: technicianId || '' },
  });

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data)).catch(() => {});
    if (technicianId) {
      technicianService.getById(Number(technicianId)).then(({ data }) => setTechnician(data)).catch(() => {});
    }
  }, [technicianId]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await bookingService.create({
        ...data,
        technician_id: Number(data.technician_id),
        category_id:   Number(data.category_id),
      });
      toast.success('Booking submitted successfully!');
      router.push(`/dashboard/customer/bookings/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit booking');
    }
  };

  const minDatetime = new Date(Date.now() + 3600000).toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book a Technician</h1>
        {technician && (
          <p className="text-gray-500 text-sm mt-1">
            Booking: <span className="font-medium text-[#1C9AD6]">{technician.user?.name}</span> – {technician.category?.name}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <input type="hidden" {...register('technician_id')} />

          <Select
            label="Service Category"
            placeholder="Select a category"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            error={errors.category_id?.message}
            required
            {...register('category_id')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Describe the work needed <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Please describe in detail what needs to be done..."
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6] resize-none ${
                errors.description ? 'border-red-400' : 'border-gray-300'
              }`}
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <Input
            label="Service address"
            placeholder="123 Kariakoo Street"
            error={errors.address?.message}
            required
            {...register('address')}
          />

          <Input
            label="City"
            placeholder="Dar es Salaam"
            error={errors.city?.message}
            required
            {...register('city')}
          />

          <Input
            label="Preferred date & time"
            type="datetime-local"
            min={minDatetime}
            error={errors.scheduled_at?.message}
            required
            {...register('scheduled_at')}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Submit Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <NewBookingForm />
    </Suspense>
  );
}
