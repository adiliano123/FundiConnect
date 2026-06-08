import api from '@/lib/axios';
import { Booking, BookingStatus, PaginatedResponse } from '@/types';

export interface CreateBookingPayload {
  technician_id: number;
  category_id: number;
  service_id?: number;
  description: string;
  address: string;
  city: string;
  scheduled_at: string;
}

export const bookingService = {
  async getAll(params?: { status?: BookingStatus; page?: number; per_page?: number }): Promise<PaginatedResponse<Booking>> {
    const { data } = await api.get('/bookings', { params });
    return data;
  },

  async getById(id: number): Promise<{ data: Booking }> {
    const { data } = await api.get(`/bookings/${id}`);
    return data;
  },

  async create(payload: CreateBookingPayload): Promise<{ data: Booking; message: string }> {
    const { data } = await api.post('/bookings', payload);
    return data;
  },

  async updateStatus(id: number, payload: {
    status: BookingStatus;
    rejection_reason?: string;
    cancellation_reason?: string;
    final_cost?: number;
  }): Promise<{ data: Booking; message: string }> {
    const { data } = await api.patch(`/bookings/${id}/status`, payload);
    return data;
  },
};
