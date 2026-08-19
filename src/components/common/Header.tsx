import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

export interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;

  /**
   * Home header:
   * hamburger + CoChef logo + notification bell
   */
  variant?: 'default' | 'home';
  onMenuPress?: () => void;
  onNotificationPress?: () => void;

  /**
   * Shows the notification indicator.
   * Kept for compatibility with the existing HomeScreen.
   */
  hasNotification?: boolean;

  /**
   * Number of unread notifications.
   * When provided, a numeric badge is displayed.
   */
  notificationCount?: number;
}

export default function Header({
  title,
  onBackPress,
  rightIcon,
  onRightPress,
  variant = 'default',
  onMenuPress,
  onNotificationPress,
  hasNotification = false,
  notificationCount = 0,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  if (variant === 'home') {
    const hasUnreadNotifications =
      notificationCount > 0 || hasNotification;

    return (
      <View
        style={{ paddingTop: insets.top }}
        className="bg-transparent"
      >
        <View className="h-[62px] flex-row items-center justify-between px-4">
          {/* Hamburger */}
          <Pressable
            onPress={onMenuPress}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            className="h-10 w-10 items-start justify-center"
          >
            <Ionicons
              name="menu-outline"
              size={25}
              color={colors.primary}
            />
          </Pressable>

          {/* CoChef Logo */}
          <View className="flex-1 items-center">
            <Image
              source={require('@/assets/images/logo.jpg')}
              style={{
                width: 82,
                height: 48,
              }}
              resizeMode="contain"
              accessibilityLabel="CoChef logo"
            />
          </View>

          {/* Notifications */}
          <Pressable
            onPress={onNotificationPress}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={
              notificationCount > 0
                ? `${notificationCount} notifications non lues`
                : 'Notifications'
            }
            className="relative h-10 w-10 items-end justify-center"
          >
            <Ionicons
              name={
                hasUnreadNotifications
                  ? 'notifications'
                  : 'notifications-outline'
              }
              size={23}
              color={colors.primary}
            />

            {notificationCount > 0 ? (
              <View
                className="absolute -right-1 -top-1 min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-pink px-1"
              >
                <Text className="font-sans-bold text-[9px] text-white">
                  {notificationCount > 99
                    ? '99+'
                    : notificationCount}
                </Text>
              </View>
            ) : hasUnreadNotifications ? (
              <View
                className="absolute right-0.5 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-orange"
              />
            ) : null}
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-row items-center justify-between border-b border-border bg-white px-4 pb-3"
    >
      {/* Back button */}
      <View className="w-8">
        {onBackPress ? (
          <Pressable
            onPress={onBackPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.text}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Title */}
      <Text
        numberOfLines={1}
        className="flex-1 text-center font-sans-semibold text-lg text-text"
      >
        {title}
      </Text>

      {/* Right icon */}
      <View className="w-8 items-end">
        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Ionicons
              name={rightIcon}
              size={24}
              color={colors.text}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}