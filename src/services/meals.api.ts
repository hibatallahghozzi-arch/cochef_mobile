import type { Meal } from '@/types/meal';

import { api } from './api';

export const mealsApi = {
  async getAll(): Promise<Meal[]> {
    const { data } = await api.get<Meal[]>('/meals');
    return data;
  },

  async getById(id: string): Promise<Meal> {
    const { data } = await api.get<Meal>(`/meals/${id}`);
    return data;
  },
};
