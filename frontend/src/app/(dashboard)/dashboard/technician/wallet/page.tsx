'use client';

import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { paymentService } from '@/services/payment.service';
import { Wallet, WalletTransaction, WithdrawalRequest } from '@/types';
import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const WITHDRAWAL_METHODS = [
  { value: 'mpesa',     label: 'M-Pesa' },
  { value: 'airtel',    label: 'Airtel Money' },
  { value: 'tigopesa',  label: 'Tigo Pesa' },
  { value: 'halopesa',  label: 'HaloPesa' },
  { value: 'bank',      label: 'Bank Transfer' },
];

export default function TechnicianWalletPage() {
  const [wallet, setWallet]               = useState<Wallet | null>(null);
  const [transactions, setTransactions]   = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals]     = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading]             = useState(true);
  const [showForm, setShowForm]           = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [form, setForm] = useState({
    amount: '',
    method: 'mpesa',
    account_number: '',
    account_name: '',
    bank_name: '',
  });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [w, tx, wr] = await Promise.all([
        paymentService.getWallet(),
        paymentService.getWalletTransactions({ per_page: 20 } as any),
        paymentService.getWithdrawals(),
      ]);
      setWallet(w.data);
      setTransactions(tx.data);
      setWithdrawals(wr.data);
    } catch {
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await paymentService.requestWithdrawal({
        amount: Number(form.amount),
        method: form.method,
        account_number: form.account_number,
        account_name: form.account_name,
        bank_name: form.method === 'bank' ? form.bank_name : undefined,
      });
      toast.success('Withdrawal request submitted');
      setShowForm(false);
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track your earnings and request withdrawals.</p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Available Balance', value: wallet?.balance ?? 0, color: 'text-green-600' },
          { label: 'Total Earned',      value: wallet?.total_earned ?? 0, color: 'text-blue-600' },
          { label: 'Total Withdrawn',   value: wallet?.total_withdrawn ?? 0, color: 'text-gray-600' },
          { label: 'Pending',           value: wallet?.pending_balance ?? 0, color: 'text-yellow-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>TZS {s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Withdraw button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2.5 bg-[#1D234F] text-white text-sm font-semibold rounded-xl hover:bg-[#161b3d] transition-colors"
        >
          {showForm ? 'Cancel' : '+ Request Withdrawal'}
        </button>
      </div>

      {/* Withdrawal form */}
      {showForm && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">Request Withdrawal</h2>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Amount (TZS)</label>
                <input
                  type="number" required min={1000}
                  value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                  placeholder="Minimum TZS 1,000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Method</label>
                <select
                  value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                >
                  {WITHDRAWAL_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Account Number / Phone</label>
                <input
                  type="text" required
                  value={form.account_number} onChange={e => setForm(f => ({ ...f, account_number: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                  placeholder="+255 7XX XXX XXX"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Account Name</label>
                <input
                  type="text" required
                  value={form.account_name} onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                />
              </div>
              {form.method === 'bank' && (
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Bank Name</label>
                  <input
                    type="text" required={form.method === 'bank'}
                    value={form.bank_name} onChange={e => setForm(f => ({ ...f, bank_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                  />
                </div>
              )}
            </div>
            <button
              type="submit" disabled={submitting}
              className="px-6 py-2.5 bg-[#1C9AD6] text-white text-sm font-semibold rounded-xl hover:bg-[#1587bc] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        </Card>
      )}

      {/* Withdrawal history */}
      <Card>
        <h2 className="font-bold text-gray-900 mb-4">Withdrawal Requests</h2>
        {withdrawals.length === 0 ? (
          <EmptyState icon={CreditCard} title="No withdrawals yet" description="Your withdrawal requests will appear here." />
        ) : (
          <div className="space-y-3">
            {withdrawals.map(w => (
              <div key={w.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                <div>
                  <p className="font-mono text-xs text-[#1C9AD6] font-semibold">{w.reference}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">TZS {w.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{w.method.toUpperCase()} · {w.account_number}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  w.status === 'completed' ? 'bg-green-100 text-green-700' :
                  w.status === 'rejected'  ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{w.status}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Transaction history */}
      <Card>
        <h2 className="font-bold text-gray-900 mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <EmptyState icon={CreditCard} title="No transactions yet" description="Transactions will appear once you receive payments." />
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <p className="font-mono text-xs text-gray-400 mt-0.5">{tx.reference}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'}TZS {tx.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Balance: TZS {tx.balance_after.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
