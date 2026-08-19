import { api } from './api';

export type NotificationType =
  | 'ORDER'
  | 'PROMOTION'
  | 'ANNOUNCEMENT';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  orderId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UnreadCountResponse {
  count: number;
}

/**
 * Get all notifications for the authenticated user.
 */
export async function getNotifications(): Promise<
  Notification[]
> {
  const response = await api.get<Notification[]>(
    '/notifications',
  );

  return response.data;
}

/**
 * Get the number of unread notifications.
 */
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const response = await api.get<UnreadCountResponse>(
    '/notifications/unread-count',
  );

  return response.data;
}

/**
 * Mark one notification as read.
 */
export async function markNotificationAsRead(
  notificationId: string,
): Promise<Notification> {
  const response = await api.patch<Notification>(
    `/notifications/${notificationId}/read`,
  );

  return response.data;
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsAsRead(): Promise<{
  updated: number;
}> {
  const response = await api.patch<{
    updated: number;
  }>('/notifications/read-all');

  return response.data;
}

/**
 * Delete all notifications for the authenticated user.
 */
export async function deleteAllNotifications(): Promise<{
  deleted: number;
}> {
  const response = await api.delete<{
    deleted: number;
  }>('/notifications');

  return response.data;
}