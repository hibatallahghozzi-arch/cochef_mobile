import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

export interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export default function Header({ title, onBackPress, rightIcon, onRightPress }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-row items-center justify-between border-b border-border bg-white px-4 pb-3"
    >
      <View className="w-8">
        {onBackPress ? (
          <Pressable onPress={onBackPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      <Text numberOfLines={1} className="flex-1 text-center font-sans-semibold text-lg text-text">
        {title}
      </Text>

      <View className="w-8 items-end">
        {rightIcon ? (
          <Pressable onPress={onRightPress} hitSlop={8} accessibilityRole="button">
            <Ionicons name={rightIcon} size={24} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
