import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/contexts/AuthContext';
import FavoritesScreen from '@/screens/villager/FavoritesScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import MealDetailScreen from '@/screens/villager/MealDetailScreen';
import OrderDetailScreen from '@/screens/villager/OrderDetailScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import SplashScreen from '@/screens/auth/SplashScreen';

import MainTabNavigator from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isBooting, isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isBooting ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="MealDetail" component={MealDetailScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
