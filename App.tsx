import './global.css';

import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { useAppFonts } from '@/hooks/useAppFonts';
import RootNavigator from '@/navigation/RootNavigator';
import { queryClient } from '@/services/queryClient';
import { registerForPushNotificationsAsync } from '@/services/notifications';
// Keep the native splash screen up until fonts finish loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { fontsLoaded, fontError } = useAppFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);


  useEffect(() => {
    async function setupNotifications() {
      const token = await registerForPushNotificationsAsync();

      if (token) {
        console.log('Expo Token:', token);
      }
    }

    setupNotifications();
  }, []);


  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <SafeAreaProvider>
              <RootNavigator />
            </SafeAreaProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

