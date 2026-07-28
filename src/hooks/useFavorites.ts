import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { favoritesApi } from '@/services/favorites.api';

export function useFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites.all,
    queryFn: favoritesApi.getAll,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });

  const addMutation = useMutation({
    mutationFn: favoritesApi.add,
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: invalidate,
  });

  return {
    addFavorite: addMutation.mutateAsync,
    removeFavorite: removeMutation.mutateAsync,
    isUpdating: addMutation.isPending || removeMutation.isPending,
  };
}
