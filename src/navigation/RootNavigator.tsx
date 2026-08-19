import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/contexts/AuthContext';

import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import SplashScreen from '@/screens/auth/SplashScreen';

import AddressesScreen from '@/screens/villager/AddressesScreen';
import FavoritesScreen from '@/screens/villager/FavoritesScreen';
import FeedbackScreen from '@/screens/villager/FeedbackScreen';
import MealDetailScreen from '@/screens/villager/MealDetailScreen';
import NotificationsScreen from '@/screens/villager/NotificationsScreen';
import OrderDetailScreen from '@/screens/villager/OrderDetailScreen';
import PersonalInformationScreen from '@/screens/villager/PersonalInformationScreen';

import DrawerNavigator from './DrawerNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isBooting, isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* =========================
            APP BOOT
        ========================== */}
        {isBooting ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
          />
        ) : isAuthenticated ? (
          <>
            {/* =========================
                MAIN APP
            ========================== */}
            <Stack.Screen
              name="Main"
              component={DrawerNavigator}
            />

            {/* =========================
                VILLAGER SCREENS
            ========================== */}

            <Stack.Screen
              name="Favorites"
              component={FavoritesScreen}
            />

            <Stack.Screen
              name="MealDetail"
              component={MealDetailScreen}
            />

            <Stack.Screen
              name="OrderDetail"
              component={OrderDetailScreen}
            />

            <Stack.Screen
              name="Feedback"
              component={FeedbackScreen}
            />

            <Stack.Screen
              name="PersonalInformation"
              component={PersonalInformationScreen}
            />

            <Stack.Screen
              name="Addresses"
              component={AddressesScreen}
            />

            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
            />
          </>
        ) : (
          <>
            {/* =========================
                AUTHENTICATION
            ========================== */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}