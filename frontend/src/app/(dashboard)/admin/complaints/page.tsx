'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import api from '@/lib/axios';
import { Complaint } from '@/types';
import { formatDate } from '@/utils/format';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const statusVariant: Record<string, any> = {
  open: 'danger', under_review: 'warning', resolved: 'success', dismissed: 'default',
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints').then(({ data }) => setComplaints(data.data || data)).finally(() => setLoading(false));
  }, []);

  const resolve = async (id: number, status: string, notes?: string) => {
    try {
      await api.patch(`/admin/complaints/${id}/resolve`, { status, resolution_notes: notes });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: status as any } : c));
      toast.success('Complaint updated');
    } catch { toast.error('Failed to update complaint'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Complaints</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review and resolve customer and technician complaints.</p>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><LoadingSpinner size="sm" /></div>
        ) : complaints.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No complaints" description="No open complaints at the moment." />
        ) : (
          <div className="divide-y divide-gray-50">
            {complaints.map(c => (
              <div key={c.id} className="py-4 space-y-2">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-900">{c.subject}</p>
                      <Badge variant={statusVariant[c.status]}>{c.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(c.created_at)}</p>
                  </div>
                  {c.status === 'open' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => resolve(c.id, 'resolved')} className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200">Resolve</button>
                      <button onClick={() => resolve(c.id, 'dismissed')} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200">Dismiss</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
