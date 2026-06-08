import api from '@/lib/axios';
import { PaginatedResponse, Technician } from '@/types';

export interface TechnicianFilters {
  category_id?: number;
  city?: string;
  search?: string;
  available?: boolean;
  page?: number;
  per_page?: number;
}

export const technicianService = {
  async getAll(filters: TechnicianFilters = {}): Promise<PaginatedResponse<Technician>> {
    const { data } = await api.get('/technicians', { params: filters });
    return data;
  },

  async getById(id: number): Promise<{ data: Technician }> {
    const { data } = await api.get(`/technicians/${id}`);
    return data;
  },

  async getMyProfile(): Promise<{ data: Technician }> {
    const { data } = await api.get('/technician/profile');
    return data;
  },

  async updateProfile(payload: Partial<Technician> & { skills?: number[] }): Promise<{ data: Technician }> {
    const { data } = await api.put('/technician/profile', payload);
    return data;
  },

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.post('/technician/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async uploadPortfolio(files: File[]): Promise<{ data: { id: number; image_url: string }[] }> {
    const form = new FormData();
    files.forEach((f) => form.append('images[]', f));
    const { data } = await api.post('/technician/portfolio', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
