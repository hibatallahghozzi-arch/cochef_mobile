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

function getNotificationLabel(type: string) {
  switch (type) {
    case 'ORDER':
      return 'Commande';

    case 'PROMOTION':
      return 'Promotion';

    case 'ANNOUNCEMENT':
      return 'Annonce';

    default:
      return 'Notification';
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
    const label = getNotificationLabel(item.type);

    return (
      <Pressable
        onPress={() => handleNotificationPress(item)}
        android_ripple={{ color: '#EAF4FA' }}
        className="mx-5 mb-4 overflow-hidden rounded-3xl"
        style={{
          backgroundColor: item.isRead ? '#FFFFFF' : '#F4FAFE',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: item.isRead ? 0.05 : 0.08,
          shadowRadius: 10,
          elevation: item.isRead ? 2 : 3,
        }}
      >
        {/* Unread accent */}
        {!item.isRead && (
          <View
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: colors.secondary }}
          />
        )}

        <View className="p-4">
          <View className="flex-row">
            {/* ICON */}
            <View
              className="mr-3.5 h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${iconColor}18`,
              }}
            >
              <Ionicons
                name={iconName}
                size={23}
                color={iconColor}
              />
            </View>

            {/* CONTENT */}
            <View className="flex-1">
              {/* TOP ROW */}
              <View className="flex-row items-start justify-between">
                <View className="mr-2 flex-1">
                  <View className="mb-1 flex-row items-center">
                    <Text className="mr-2 font-sans-semibold text-[10px] uppercase tracking-wider text-text-secondary">
                      {label}
                    </Text>

                    {!item.isRead && (
                      <View className="rounded-full bg-pink px-2 py-0.5">
                        <Text className="font-sans-bold text-[9px] text-white">
                          NOUVEAU
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    className={`font-sans-bold text-[16px] leading-5 ${
                      item.isRead
                        ? 'text-primary'
                        : 'text-primary'
                    }`}
                  >
                    {item.title}
                  </Text>
                </View>

                {!item.isRead && (
                  <View className="mt-1 h-2.5 w-2.5 rounded-full bg-pink" />
                )}
              </View>

              {/* MESSAGE */}
              <Text className="mt-2 font-sans text-[13px] leading-5 text-text-secondary">
                {item.message}
              </Text>

              {/* DATE */}
              <View className="mt-3 flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={13}
                  color={colors.textSecondary}
                />

                <Text className="ml-1.5 font-sans text-[11px] text-text-secondary">
                  {formatNotificationDate(item.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-white">
            <ActivityIndicator
              size="large"
              color={colors.secondary}
            />
          </View>

          <Text className="mt-5 font-sans-semibold text-base text-primary">
            Chargement...
          </Text>

          <Text className="mt-1 text-center font-sans text-sm text-text-secondary">
            Nous récupérons vos notifications.
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center px-10">
        <View
          className="h-24 w-24 items-center justify-center rounded-full"
          style={{
            backgroundColor: `${colors.secondary}12`,
          }}
        >
          <View
            className="h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.secondary}20`,
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={32}
              color={colors.secondary}
            />
          </View>
        </View>

        <Text className="mt-6 font-sans-bold text-xl text-primary">
          Tout est calme ✨
        </Text>

        <Text className="mt-2 text-center font-sans text-sm leading-6 text-text-secondary">
          Vous n’avez aucune nouvelle notification pour le moment.
          {'\n'}
          Nous vous préviendrons dès qu’il y en aura une.
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* =========================
          HEADER
      ========================== */}
      <View className="px-5 pb-5 pt-14">
        <View className="flex-row items-center justify-between">
          {/* BACK + TITLE */}
          <View className="flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Retour"
              className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-white"
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color={colors.primary}
              />
            </Pressable>

            <View>
              <Text className="font-sans-bold text-[23px] text-primary">
                Notifications
              </Text>

              {unreadCount > 0 ? (
                <Text className="mt-0.5 font-sans text-xs text-text-secondary">
                  {unreadCount}{' '}
                  {unreadCount === 1
                    ? 'notification non lue'
                    : 'notifications non lues'}
                </Text>
              ) : (
                <Text className="mt-0.5 font-sans text-xs text-text-secondary">
                  Vous êtes à jour
                </Text>
              )}
            </View>
          </View>

          {/* NOTIFICATION ICON */}
          <View
            className="h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: `${colors.secondary}12`,
            }}
          >
            <Ionicons
              name="notifications"
              size={22}
              color={colors.secondary}
            />

            {unreadCount > 0 && (
              <View
                className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: colors.pink,
                }}
              />
            )}
          </View>
        </View>

        {/* MARK ALL */}
        {typedNotifications.length > 0 && unreadCount > 0 && (
          <Pressable
            onPress={() => markAllAsRead()}
            disabled={isMarkingAllAsRead}
            className="mt-4 self-start rounded-full bg-white px-4 py-2"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            {isMarkingAllAsRead ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />
            ) : (
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-done-outline"
                  size={15}
                  color={colors.primary}
                />

                <Text className="ml-1.5 font-sans-semibold text-xs text-primary">
                  Tout marquer comme lu
                </Text>
              </View>
            )}
          </Pressable>
        )}
      </View>

      {/* =========================
          LIST
      ========================== */}
      <FlatList
        data={typedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 4,
          paddingBottom: 120,
          flexGrow:
            typedNotifications.length === 0 ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            tintColor={colors.secondary}
            colors={[colors.secondary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          typedNotifications.length > 0 ? (
            <Pressable
              onPress={() => deleteAll()}
              disabled={isDeletingAll}
              className="mx-5 mt-1 mb-4 flex-row items-center justify-center rounded-2xl border border-red-100 bg-white py-3.5"
            >
              {isDeletingAll ? (
                <ActivityIndicator
                  size="small"
                  color={colors.pink}
                />
              ) : (
                <>
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={colors.pink}
                  />

                  <Text className="ml-2 font-sans-semibold text-xs text-pink">
                    Supprimer toutes les notifications
                  </Text>
                </>
              )}
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}