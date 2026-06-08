'use client';

import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import { reviewService } from '@/services/review.service';
import { technicianService } from '@/services/technician.service';
import { Review } from '@/types';
import { timeAgo } from '@/utils/format';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TechnicianReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      technicianService.getMyProfile(),
      reviewService.getMyReviews(),
    ]).then(([{ data: tech }, res]) => {
      setRating(tech.rating ?? 0);
      setReviews(res.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-500 text-sm mt-0.5">Feedback from your customers.</p>
      </div>

      {/* Summary */}
      <Card className="flex items-center gap-5 p-5">
        <div className="text-center">
          <p className="text-5xl font-black text-[#1D234F]">{rating.toFixed(1)}</p>
          <StarRating rating={Math.round(rating)} size="sm" />
          <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => Math.round(r.rating) === star).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-4">{star}★</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFD530] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-4 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reviews list */}
      <Card>
        {reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Complete jobs to start earning reviews." />
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map(r => (
              <div key={r.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1C9AD6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {r.customer?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.customer?.name}</p>
                      <p className="text-xs text-gray-400">{timeAgo(r.created_at)}</p>
                    </div>
                  </div>
                  <StarRating rating={r.rating} size="sm" />
                </div>
                {r.comment && <p className="text-sm text-gray-600 mt-2 ml-10">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
