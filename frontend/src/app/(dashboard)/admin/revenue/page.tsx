'use client';

import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { adminPaymentService } from '@/services/payment.service';
import { Payment } from '@/types';
import { useEffect, useState } from 'react';

export default function AdminRevenuePage() {
  const [summary, setSummary]     = useState<any>(null);
  const [monthly, setMonthly]     = useState<any[]>([]);
  const [methods, setMethods]     = useState<any[]>([]);
  const [payments, setPayments]   = useState<Payment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setStatus] = useState('');
  const [page, setPage]           = useState(1);
  const [lastPage, setLastPage]   = useState(1);

  useEffect(() => { loadSummary(); }, []);
  useEffect(() => { loadPayments(); }, [statusFilter, page]);

  const loadSummary = async () => {
    const [s, m, by] = await Promise.all([
      adminPaymentService.getSummary(),
      adminPaymentService.getMonthly(),
      adminPaymentService.getByMethod(),
    ]);
    setSummary(s);
    setMonthly(m.data);
    setMethods(by);
    setLoading(false);
  };

  const loadPayments = async () => {
    const res = await adminPaymentService.getPayments({ status: statusFilter || undefined, page, per_page: 15 });
    setPayments(res.data);
    setLastPage(res.last_page);
  };

  if (loading) return <LoadingSpinner fullPage />;

  const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Revenue</h1>
        <p className="text-gray-500 text-sm mt-0.5">Platform financial overview.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',      value: summary?.total_revenue,        color: 'text-blue-600' },
          { label: 'Platform Earnings',  value: summary?.platform_earnings,     color: 'text-green-600' },
          { label: 'Technician Payouts', value: summary?.technician_payouts,    color: 'text-purple-600' },
          { label: 'Pending Payments',   value: summary?.pending_payments,      color: 'text-yellow-600', isCount: true },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>
              {s.isCount ? s.value : `TZS ${Number(s.value ?? 0).toLocaleString()}`}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly */}
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="space-y-2">
            {monthly.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : monthly.map((m: any) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">{MONTH_NAMES[m.month]}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-[#1C9AD6] rounded-full"
                    style={{ width: `${Math.min(100, (m.total_revenue / (monthly[0]?.total_revenue || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-28 text-right">TZS {Number(m.total_revenue).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* By method */}
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">By Payment Method</h2>
          <div className="space-y-3">
            {methods.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : methods.map((m: any) => (
              <div key={m.payment_method} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 uppercase">{m.payment_method || 'Unknown'}</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">TZS {Number(m.total).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{m.count} transactions</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* All payments */}
      <Card>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-bold text-gray-900">All Payments</h2>
          <select
            value={statusFilter}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                {['Reference', 'Customer', 'Technician', 'Amount', 'Fee', 'Method', 'Status', 'Date'].map(h => (
                  <th key={h} className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70">
                  <td className="py-3 font-mono text-xs text-[#1C9AD6] font-semibold">{p.reference}</td>
                  <td className="py-3 text-gray-700">{(p as any).customer?.name || '—'}</td>
                  <td className="py-3 text-gray-700">{(p as any).technician?.user?.name || '—'}</td>
                  <td className="py-3 font-semibold">TZS {p.amount.toLocaleString()}</td>
                  <td className="py-3 text-gray-500">TZS {p.platform_fee.toLocaleString()}</td>
                  <td className="py-3 uppercase text-xs">{p.payment_method || '—'}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'completed' ? 'bg-green-100 text-green-700' :
                      p.status === 'failed' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{p.status}</span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
