import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/colors';

import Button from './Button';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function EmptyState({
  icon = 'file-tray-outline',
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8 py-12">
      <Ionicons name={icon} size={48} color={colors.textSecondary} />
      <Text className="text-center font-sans-semibold text-lg text-text">{title}</Text>
      {subtitle ? (
        <Text className="text-center font-sans text-sm text-text-secondary">{subtitle}</Text>
      ) : null}
      {actionLabel && onActionPress ? (
        <View className="mt-2">
          <Button label={actionLabel} onPress={onActionPress} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}
