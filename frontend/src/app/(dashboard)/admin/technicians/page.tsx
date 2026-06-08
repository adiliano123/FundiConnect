'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { adminService } from '@/services/admin.service';
import { technicianService } from '@/services/technician.service';
import { Technician } from '@/types';
import { Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'pending'>('pending');

  useEffect(() => { load(); }, [tab]);

  const load = async () => {
    setLoading(true);
    try {
      const res = tab === 'pending'
        ? await adminService.getPendingTechnicians()
        : await technicianService.getAll({ per_page: 50 });
      setTechnicians(res.data);
    } finally { setLoading(false); }
  };

  const handleVerify = async (id: number, status: 'verified' | 'rejected') => {
    try {
      await adminService.verifyTechnician(id, { status });
      setTechnicians(prev => prev.filter(t => t.id !== id));
      toast.success(`Technician ${status}`);
    } catch { toast.error('Action failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Technicians</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage and verify technician accounts.</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['pending', 'all'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${tab === t ? 'bg-white text-[#1D234F] shadow-sm' : 'text-gray-500'}`}>
            {t === 'pending' ? 'Pending Verification' : 'All Technicians'}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><LoadingSpinner size="sm" /></div>
        ) : technicians.length === 0 ? (
          <EmptyState icon={Wrench} title={tab === 'pending' ? 'No pending verifications' : 'No technicians'} description="" />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {['Name', 'Category', 'City', 'Rate', 'Status', 'Actions'].map(h => (
                    <th key={h} className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {technicians.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/70">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1C9AD6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {t.user?.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{t.user?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{t.category?.name || '—'}</td>
                    <td className="py-3 text-gray-600">{t.user?.city || '—'}</td>
                    <td className="py-3 text-gray-600">TZS {t.hourly_rate?.toLocaleString()}/hr</td>
                    <td className="py-3">
                      <Badge variant={t.verification_status === 'verified' ? 'success' : t.verification_status === 'rejected' ? 'danger' : 'warning'}>
                        {t.verification_status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {t.verification_status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleVerify(t.id, 'verified')} className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200">Verify</button>
                          <button onClick={() => handleVerify(t.id, 'rejected')} className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
