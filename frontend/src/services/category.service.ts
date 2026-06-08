import api from '@/lib/axios';
import { Category } from '@/types';

export const categoryService = {
  async getAll(): Promise<{ data: Category[] }> {
    const { data } = await api.get('/categories');
    return data;
  },

  async getById(id: number): Promise<{ data: Category }> {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },
};
