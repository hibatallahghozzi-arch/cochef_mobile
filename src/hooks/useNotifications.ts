import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteAllNotifications,
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/services/notifications.api';

export const notificationsQueryKeys = {
  all: ['notifications'] as const,

  list: () =>
    [...notificationsQueryKeys.all, 'list'] as const,

  unreadCount: () =>
    [...notificationsQueryKeys.all, 'unread-count'] as const,
};

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: notificationsQueryKeys.list(),
    queryFn: getNotifications,
  });

  const unreadCountQuery = useQuery({
    queryKey: notificationsQueryKeys.unreadCount(),
    queryFn: getUnreadCount,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsQueryKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: notificationsQueryKeys.unreadCount(),
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsQueryKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: notificationsQueryKeys.unreadCount(),
      });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotifications,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsQueryKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: notificationsQueryKeys.unreadCount(),
      });
    },
  });

  return {
    notifications: notificationsQuery.data ?? [],

    unreadCount: unreadCountQuery.data?.count ?? 0,

    isLoading:
      notificationsQuery.isLoading ||
      unreadCountQuery.isLoading,

    isRefreshing:
      notificationsQuery.isFetching ||
      unreadCountQuery.isFetching,

    error:
      notificationsQuery.error ??
      unreadCountQuery.error ??
      null,

    refetch: async () => {
      await Promise.all([
        notificationsQuery.refetch(),
        unreadCountQuery.refetch(),
      ]);
    },

    markAsRead: markAsReadMutation.mutateAsync,

    markAllAsRead: markAllAsReadMutation.mutateAsync,

    deleteAll: deleteAllMutation.mutateAsync,

    isMarkingAsRead: markAsReadMutation.isPending,

    isMarkingAllAsRead:
      markAllAsReadMutation.isPending,

    isDeletingAll: deleteAllMutation.isPending,
  };
}