import api from '@/lib/axios';
import { PaginatedResponse, Payment, Wallet, WalletTransaction, WithdrawalRequest } from '@/types';

export const paymentService = {
  async initiate(bookingId: number, payload: {
    amount: number;
    payment_method: string;
    phone_number?: string;
  }): Promise<{ data: Payment; message: string }> {
    const { data } = await api.post(`/bookings/${bookingId}/pay`, payload);
    return data;
  },

  async verify(paymentId: number): Promise<{ status: string; message: string; data: Payment }> {
    const { data } = await api.post(`/payments/${paymentId}/verify`);
    return data;
  },

  async getAll(params?: { status?: string; page?: number; per_page?: number }): Promise<PaginatedResponse<Payment>> {
    const { data } = await api.get('/payments', { params });
    return data;
  },

  async getById(id: number): Promise<{ data: Payment }> {
    const { data } = await api.get(`/payments/${id}`);
    return data;
  },

  // Wallet
  async getWallet(): Promise<{ data: Wallet }> {
    const { data } = await api.get('/wallet');
    return data;
  },

  async getWalletTransactions(params?: { type?: string; page?: number }): Promise<PaginatedResponse<WalletTransaction>> {
    const { data } = await api.get('/wallet/transactions', { params });
    return data;
  },

  // Withdrawals
  async requestWithdrawal(payload: {
    amount: number;
    method: string;
    account_number: string;
    account_name: string;
    bank_name?: string;
  }): Promise<{ data: WithdrawalRequest; message: string }> {
    const { data } = await api.post('/withdrawals', payload);
    return data;
  },

  async getWithdrawals(params?: { page?: number }): Promise<PaginatedResponse<WithdrawalRequest>> {
    const { data } = await api.get('/withdrawals', { params });
    return data;
  },
};

export const adminPaymentService = {
  async getSummary() {
    const { data } = await api.get('/admin/revenue/summary');
    return data.data;
  },

  async getMonthly(year?: number) {
    const { data } = await api.get('/admin/revenue/monthly', { params: { year } });
    return data;
  },

  async getByMethod() {
    const { data } = await api.get('/admin/revenue/by-method');
    return data.data;
  },

  async getPayments(params?: { status?: string; method?: string; page?: number; per_page?: number }): Promise<PaginatedResponse<Payment>> {
    const { data } = await api.get('/admin/revenue/payments', { params });
    return data;
  },

  async getTopTechnicians(limit = 10) {
    const { data } = await api.get('/admin/revenue/top-technicians', { params: { limit } });
    return data.data;
  },

  async getWithdrawals(params?: { status?: string; page?: number }): Promise<PaginatedResponse<WithdrawalRequest>> {
    const { data } = await api.get('/admin/withdrawals', { params });
    return data;
  },

  async approveWithdrawal(id: number, adminNotes?: string) {
    const { data } = await api.patch(`/admin/withdrawals/${id}/approve`, { admin_notes: adminNotes });
    return data;
  },

  async rejectWithdrawal(id: number, adminNotes: string) {
    const { data } = await api.patch(`/admin/withdrawals/${id}/reject`, { admin_notes: adminNotes });
    return data;
  },
};
