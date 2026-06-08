'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import { useAuth } from '@/context/AuthContext';
import { technicianService } from '@/services/technician.service';
import { Technician } from '@/types';
import { formatDate } from '@/utils/format';
import { CheckCircle, MapPin, Shield, Star, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TechnicianProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    technicianService.getById(Number(id))
      .then(({ data }) => setTechnician(data))
      .catch(() => router.push('/technicians'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!technician) return null;

  const handleBook = () => {
    if (!user) return router.push(`/auth/login?redirect=/technicians/${id}`);
    router.push(`/dashboard/customer/bookings/new?technician_id=${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-[#1D234F] h-40" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="-mt-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl bg-[#1C9AD6] flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
                  {technician.user?.name?.charAt(0)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-gray-900">{technician.user?.name}</h1>
                      {technician.verification_status === 'verified' && (
                        <Shield className="w-5 h-5 text-[#59BD7B]" aria-label="Verified technician" />
                      )}
                    </div>
                    <p className="text-[#1C9AD6] font-semibold mt-0.5">{technician.category?.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={Math.round(technician.rating)} size="sm" />
                      <span className="text-sm text-gray-600">
                        {technician.rating.toFixed(1)} ({technician.total_reviews} reviews)
                      </span>
                    </div>
                    {technician.user?.city && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        {technician.user.city}, Tanzania
                      </div>
                    )}
                  </div>

                  {/* Book button */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#1D234F]">TZS {technician.hourly_rate?.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">per hour</div>
                    </div>
                    <Button onClick={handleBook} size="lg" className="px-8">
                      Book Now
                    </Button>
                    {!technician.is_available && (
                      <span className="text-xs text-red-500">Currently unavailable</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                  {[
                    { label: 'Jobs Done', value: technician.total_jobs },
                    { label: 'Experience', value: `${technician.experience_years} yrs` },
                    { label: 'Reviews', value: technician.total_reviews },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <div className="text-xl font-bold text-[#1D234F]">{value}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {technician.description && (
                <Card>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{technician.description}</p>
                </Card>
              )}

              {/* Skills */}
              {technician.skills && technician.skills.length > 0 && (
                <Card>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Skills & Services</h2>
                  <div className="flex flex-wrap gap-2">
                    {technician.skills.map((skill) => (
                      <span key={skill.id} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> {skill.name}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Portfolio */}
              {technician.portfolio_images && technician.portfolio_images.length > 0 && (
                <Card>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Portfolio</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {technician.portfolio_images.map((img) => (
                      <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img src={img.image_url} alt={img.caption || 'Portfolio'} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Reviews */}
              {technician.reviews && technician.reviews.length > 0 && (
                <Card>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Reviews</h2>
                  <div className="space-y-4">
                    {technician.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                              {review.customer?.name?.charAt(0)}
                            </div>
                            <span className="font-medium text-sm text-gray-900">{review.customer?.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                        {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <h3 className="font-bold text-gray-900 mb-3">Service Area</h3>
                <p className="text-sm text-gray-600">{technician.service_area || technician.user?.city || 'Not specified'}</p>
              </Card>

              {technician.bio && (
                <Card>
                  <h3 className="font-bold text-gray-900 mb-3">Quick Summary</h3>
                  <p className="text-sm text-gray-600">{technician.bio}</p>
                </Card>
              )}

              <Card className="bg-[#1D234F] border-0 text-white">
                <h3 className="font-bold mb-2">Ready to hire?</h3>
                <p className="text-gray-300 text-sm mb-4">Book {technician.user?.name?.split(' ')[0]} for your next job.</p>
                <Button onClick={handleBook} variant="secondary" className="w-full">
                  Book Now
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
