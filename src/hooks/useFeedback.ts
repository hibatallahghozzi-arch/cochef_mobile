import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { feedbackApi } from '@/services/feedback.api';

const feedbackQueryKey = ['feedback', 'mine'];

export function useMyFeedback() {
  return useQuery({
    queryKey: feedbackQueryKey,
    queryFn: feedbackApi.getMine,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedbackApi.create,
    onSuccess: (data) => {
      queryClient.setQueryData(
        feedbackQueryKey,
        data,
      );
    },
  });
}

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedbackApi.update,
    onSuccess: (data) => {
      queryClient.setQueryData(
        feedbackQueryKey,
        data,
      );
    },
  });
}