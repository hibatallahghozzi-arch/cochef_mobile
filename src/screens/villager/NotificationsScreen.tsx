import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '@/constants/colors';
import type { RootStackParamList } from '@/navigation/types';
import { useNotifications } from '@/hooks/useNotifications';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Notifications'
>;

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  orderId?: string | null;
};

function getNotificationIcon(
  type: string,
): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'ORDER':
      return 'receipt-outline';

    case 'PROMOTION':
      return 'pricetag-outline';

    case 'ANNOUNCEMENT':
      return 'megaphone-outline';

    default:
      return 'notifications-outline';
  }
}

function getNotificationIconColor(type: string) {
  switch (type) {
    case 'ORDER':
      return colors.secondary;

    case 'PROMOTION':
      return colors.orange;

    case 'ANNOUNCEMENT':
      return colors.pink;

    default:
      return colors.primary;
  }
}

function formatNotificationDate(date: string) {
  const notificationDate = new Date(date);
  const now = new Date();

  const diff = now.getTime() - notificationDate.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return 'À l’instant';
  }

  if (minutes < 60) {
    return `Il y a ${minutes} min`;
  }

  if (hours < 24) {
    return `Il y a ${hours} h`;
  }

  if (days < 7) {
    return `Il y a ${days} j`;
  }

  return notificationDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function NotificationsScreen({
  navigation,
}: Props) {
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteAll,
    isMarkingAllAsRead,
    isDeletingAll,
  } = useNotifications();

  const typedNotifications =
    (notifications as NotificationItem[]) ?? [];

  const handleNotificationPress = useCallback(
    async (notification: NotificationItem) => {
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }

      if (notification.orderId) {
        navigation.navigate('OrderDetail', {
          orderId: notification.orderId,
        });
      }
    },
    [markAsRead, navigation],
  );

  const renderNotification = ({
    item,
  }: {
    item: NotificationItem;
  }) => {
    const iconName = getNotificationIcon(item.type);
    const iconColor = getNotificationIconColor(item.type);

    return (
      <Pressable
        onPress={() => handleNotificationPress(item)}
        className={`mx-4 mb-3 rounded-2xl p-4 ${
          item.isRead ? 'bg-white' : 'bg-blue-50'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View className="flex-row">
          <View
            className="mr-3 h-11 w-11 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${iconColor}18`,
            }}
          >
            <Ionicons
              name={iconName}
              size={21}
              color={iconColor}
            />
          </View>

          <View className="flex-1">
            <View className="flex-row items-start justify-between">
              <Text className="mr-2 flex-1 font-sans-semibold text-[15px] text-primary">
                {item.title}
              </Text>

              {!item.isRead && (
                <View className="mt-1 h-2.5 w-2.5 rounded-full bg-pink" />
              )}
            </View>

            <Text className="mt-1 font-sans text-[13px] leading-5 text-text-secondary">
              {item.message}
            </Text>

            <Text className="mt-2 font-sans text-[11px] text-text-secondary">
              {formatNotificationDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text className="mt-4 text-center font-sans text-sm text-text-secondary">
            Chargement de vos notifications...
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center px-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Ionicons
            name="notifications-off-outline"
            size={38}
            color={colors.primary}
          />
        </View>

        <Text className="mt-5 font-sans-bold text-lg text-primary">
          Aucune notification
        </Text>

        <Text className="mt-2 text-center font-sans text-sm leading-5 text-text-secondary">
          Vous êtes à jour ! Les nouvelles notifications
          apparaîtront ici.
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* =========================
          HEADER
      ========================== */}
      <View className="flex-row items-center justify-between px-5 pb-4 pt-14">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.primary}
            />
          </Pressable>

          <View>
            <Text className="font-sans-bold text-xl text-primary">
              Notifications
            </Text>

            {unreadCount > 0 && (
              <Text className="mt-0.5 font-sans text-xs text-text-secondary">
                {unreadCount}{' '}
                {unreadCount === 1
                  ? 'notification non lue'
                  : 'notifications non lues'}
              </Text>
            )}
          </View>
        </View>

        {typedNotifications.length > 0 && (
          <Pressable
            onPress={() => markAllAsRead()}
            disabled={
              isMarkingAllAsRead || unreadCount === 0
            }
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Marquer toutes les notifications comme lues"
          >
            <Text
              className={`font-sans-semibold text-xs ${
                unreadCount === 0
                  ? 'text-text-secondary'
                  : 'text-primary'
              }`}
            >
              Tout lire
            </Text>
          </Pressable>
        )}
      </View>

      {/* =========================
          NOTIFICATIONS LIST
      ========================== */}
      <FlatList
        data={typedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 110,
          flexGrow:
            typedNotifications.length === 0 ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          typedNotifications.length > 0 ? (
            <Pressable
              onPress={() => deleteAll()}
              disabled={isDeletingAll}
              accessibilityRole="button"
              accessibilityLabel="Supprimer toutes les notifications"
              className="mx-4 mt-2 items-center rounded-2xl border border-red-100 bg-white py-3"
            >
              {isDeletingAll ? (
                <ActivityIndicator
                  size="small"
                  color={colors.pink}
                />
              ) : (
                <View className="flex-row items-center">
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={colors.pink}
                  />

                  <Text className="ml-2 font-sans-semibold text-xs text-pink">
                    Supprimer toutes les notifications
                  </Text>
                </View>
              )}
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}