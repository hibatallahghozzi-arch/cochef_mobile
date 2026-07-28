import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// Shown while AuthContext checks SecureStore for an existing session
// (see RootNavigator's isBooting branch). Purely presentational.
export default function SplashScreen(_props: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-text">CoChef</Text>
    </View>
  );
}
