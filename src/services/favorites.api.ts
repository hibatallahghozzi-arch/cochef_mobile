import type { Meal } from '@/types/meal';

import { api } from './api';

export const favoritesApi = {
  async getAll(): Promise<Meal[]> {
    const { data } = await api.get<Meal[]>('/favorites');
    return data;
  },

  async add(mealId: string): Promise<void> {
    await api.post(`/favorites/${mealId}`);
  },

  async remove(mealId: string): Promise<void> {
    await api.delete(`/favorites/${mealId}`);
  },
};
