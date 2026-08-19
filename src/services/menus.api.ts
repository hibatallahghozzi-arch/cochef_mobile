import { api } from './api';

export interface TodayMenuMeal {
  id: string;
  name: string;
  price: number | string;
  calories: number | string;
  proteinsG: number | string;
  lipidsG: number | string;
  fibersG: number | string;
  ingredients: string[];
  allergens: string[];
  isActive: boolean;
}

export interface TodayMenu {
  id: string;
  date: string;
  meals: TodayMenuMeal[];
}

export const menusApi = {
  getToday: async (): Promise<TodayMenu> => {
    const response = await api.get<TodayMenu>('/menus/today');

    return response.data;
  },
};