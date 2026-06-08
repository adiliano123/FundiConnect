import api from '@/lib/axios';
import { User } from '@/types';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; password_confirmation: string; role?: 'customer' | 'technician'; phone?: string; }
export interface AuthResponse { user: User; token: string; message: string; }

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<{ user: User }> {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
