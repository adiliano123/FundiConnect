'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import api from '@/lib/axios';
import { Review } from '@/types';
import { timeAgo } from '@/utils/format';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/reviews').then(({ data }) => setReviews(data.data || data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
      toast.success('Review deleted');
    } catch { toast.error('Failed to delete review'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500 text-sm mt-0.5">Monitor and manage customer reviews.</p>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><LoadingSpinner size="sm" /></div>
        ) : reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Reviews will appear here once customers start rating." />
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map(r => (
              <div key={r.id} className="py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{r.customer?.name || 'Customer'}</span>
                    <StarRating rating={r.rating} size="sm" />
                    <Badge variant={r.is_published ? 'success' : 'warning'}>{r.is_published ? 'Published' : 'Hidden'}</Badge>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(r.created_at)}</p>
                </div>
                <button onClick={() => handleDelete(r.id)} className="text-xs text-red-500 hover:underline shrink-0">Delete</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
