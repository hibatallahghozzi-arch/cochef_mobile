import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CartScreen from '@/screens/villager/CartScreen';
import HomeScreen from '@/screens/villager/HomeScreen';
import MenuScreen from '@/screens/villager/MenuScreen';
import OrdersScreen from '@/screens/villager/OrdersScreen';
import ProfileScreen from '@/screens/villager/ProfileScreen';

import type { MainTabParamList } from './types';

// TODO(Phase 5): swap these hex literals for the shared colors.ts tokens once
// the design-system files exist.
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Menu: 'restaurant-outline',
  Cart: 'cart-outline',
  Orders: 'receipt-outline',
  Profile: 'person-outline',
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0B3C5D',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name as keyof MainTabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
