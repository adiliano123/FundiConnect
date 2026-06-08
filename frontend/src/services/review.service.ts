import api from '@/lib/axios';
import { PaginatedResponse, Review } from '@/types';

export const reviewService = {
  async create(payload: { booking_id: number; rating: number; comment?: string }): Promise<{ data: Review }> {
    const { data } = await api.post('/reviews', payload);
    return data;
  },

  async getTechnicianReviews(technicianId: number, page = 1): Promise<PaginatedResponse<Review>> {
    const { data } = await api.get(`/technicians/${technicianId}/reviews`, { params: { page } });
    return data;
  },

  async getMyReviews(page = 1): Promise<PaginatedResponse<Review>> {
    const { data } = await api.get('/technician/reviews', { params: { page } });
    return data;
  },
};
