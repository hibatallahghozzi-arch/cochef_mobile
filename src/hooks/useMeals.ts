import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { mealsApi } from '@/services/meals.api';

export function useMeals() {
  return useQuery({
    queryKey: queryKeys.meals.all,
    queryFn: mealsApi.getAll,
  });
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: queryKeys.meals.detail(id),
    queryFn: () => mealsApi.getById(id),
    enabled: Boolean(id),
  });
}
