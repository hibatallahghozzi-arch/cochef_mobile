import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/constants/colors';

export interface LoaderProps {
  fullScreen?: boolean;
}

export default function Loader({ fullScreen = false }: LoaderProps) {
  return (
    <View className={`items-center justify-center ${fullScreen ? 'flex-1 bg-background' : 'py-8'}`}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
