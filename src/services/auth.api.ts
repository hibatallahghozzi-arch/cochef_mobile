import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/auth';

import { api } from './api';

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    console.log('LOGIN PAYLOAD:', payload);

    const { data } = await api.post<AuthResponse>(
      '/auth/login',
      payload,
    );

    console.log('LOGIN RESPONSE:', data);

    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    console.log('REGISTER PAYLOAD:', payload);

    const { data } = await api.post<AuthResponse>(
      '/auth/register',
      payload,
    );

    console.log('REGISTER RESPONSE:', data);

    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/users/me');

    return data;
  },
  async updatePushToken(expoPushToken: string): Promise<void> {
  await api.post('/users/push-token', {
    expoPushToken,
  });
},
};