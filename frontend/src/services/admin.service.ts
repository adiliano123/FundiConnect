import api from '@/lib/axios';
import { PaginatedResponse, Technician, User } from '@/types';

export const adminService = {
  async getDashboard() {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },

  async getUsers(params?: { role?: string; search?: string; page?: number }): Promise<PaginatedResponse<User>> {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  async toggleSuspend(userId: number) {
    const { data } = await api.patch(`/admin/users/${userId}/suspend`);
    return data;
  },

  async getPendingTechnicians(): Promise<PaginatedResponse<Technician>> {
    const { data } = await api.get('/admin/technicians/pending');
    return data;
  },

  async verifyTechnician(technicianId: number, payload: { status: 'verified' | 'rejected'; rejection_reason?: string }) {
    const { data } = await api.patch(`/admin/technicians/${technicianId}/verify`, payload);
    return data;
  },
};
