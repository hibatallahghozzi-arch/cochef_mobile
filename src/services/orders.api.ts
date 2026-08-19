import type {
  CreateOrderPayload,
  Order,
} from '@/types/order';

import { api } from './api';

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    const { data } =
      await api.get<Order[]>('/orders');

    return data;
  },

  async getById(
    id: string,
  ): Promise<Order> {
    const { data } =
      await api.get<Order>(
        `/orders/${id}`,
      );

    return data;
  },

  async create(
    payload: CreateOrderPayload,
  ): Promise<Order> {
    const { data } =
      await api.post<Order>(
        '/orders',
        payload,
      );

    return data;
  },
};