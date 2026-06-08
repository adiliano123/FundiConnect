'use client';

import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { adminPaymentService } from '@/services/payment.service';
import { WithdrawalRequest } from '@/types';
import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatus]     = useState('pending');
  const [page, setPage]               = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [notes, setNotes]             = useState<Record<number, string>>({});

  useEffect(() => { load(); }, [statusFilter, page]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminPaymentService.getWithdrawals({ status: statusFilter || undefined, page });
      setWithdrawals(res.data);
      setLastPage(res.last_page);
    } finally { setLoading(false); }
  };

  const approve = async (id: number) => {
    try {
      await adminPaymentService.approveWithdrawal(id, notes[id]);
      toast.success('Withdrawal approved');
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const reject = async (id: number) => {
    if (!notes[id]?.trim()) return toast.error('Rejection reason is required');
    try {
      await adminPaymentService.rejectWithdrawal(id, notes[id]);
      toast.success('Withdrawal rejected');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Withdrawal Requests</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review and process technician withdrawal requests.</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { label: 'Pending', value: 'pending' },
          { label: 'Completed', value: 'completed' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'All', value: '' },
        ].map(t => (
          <button key={t.value} onClick={() => { setStatus(t.value); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${statusFilter === t.value ? 'bg-white text-[#1D234F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><LoadingSpinner size="sm" /></div>
        ) : withdrawals.length === 0 ? (
          <EmptyState icon={CreditCard} title="No withdrawal requests" description="" />
        ) : (
          <div className="space-y-4">
            {withdrawals.map(w => (
              <div key={w.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-[#1C9AD6] font-semibold">{w.reference}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        w.status === 'completed' ? 'bg-green-100 text-green-700' :
                        w.status === 'rejected'  ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{w.status}</span>
                    </div>
                    <p className="font-semibold text-gray-900 mt-1">TZS {w.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {w.technician?.user?.name} · {w.method.toUpperCase()} · {w.account_number} ({w.account_name})
                      {w.bank_name && ` · ${w.bank_name}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(w.created_at).toLocaleString()}</p>
                    {w.admin_notes && <p className="text-xs text-gray-500 mt-1 italic">Note: {w.admin_notes}</p>}
                  </div>

                  {w.status === 'pending' && (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Admin notes (required for reject)"
                        value={notes[w.id] ?? ''}
                        onChange={e => setNotes(n => ({ ...n, [w.id]: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => approve(w.id)} className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200">Approve</button>
                        <button onClick={() => reject(w.id)} className="flex-1 px-3 py-1.5 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200">Reject</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex justify-center gap-2 mt-5 pt-5 border-t border-gray-100">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
            <span className="px-3 py-1.5 text-xs text-gray-500">Page {page} of {lastPage}</span>
            <button disabled={page === lastPage} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        )}
      </Card>
    </div>
  );
}
