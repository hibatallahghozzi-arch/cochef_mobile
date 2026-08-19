import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';

import MainTabNavigator from './MainTabNavigator';
import { colors } from '@/constants/colors';
import type { RootStackParamList } from './types';

export type DrawerParamList = {
  App: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent({
  navigation,
}: DrawerContentComponentProps) {
  const rootNavigation =
    navigation.getParent<NavigationProp<RootStackParamList>>();

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 0,
      }}
    >
      {/* =========================
          DRAWER HEADER
      ========================== */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 28,
          backgroundColor: colors.primary,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: '700',
          }}
        >
          CoChef
        </Text>

        <Text
          style={{
            color: '#FFFFFF',
            opacity: 0.8,
            marginTop: 4,
            fontSize: 13,
          }}
        >
          Votre cafeteria, simplement.
        </Text>
      </View>

      {/* =========================
          MAIN NAVIGATION
      ========================== */}
      <View style={{ paddingTop: 18 }}>
        {/* Accueil */}
        <DrawerItem
          label="Accueil"
          icon={({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          )}
          onPress={() => {
            navigation.navigate('App', {
              screen: 'Home',
            } as never);

            navigation.closeDrawer();
          }}
        />

        {/* Menu */}
        <DrawerItem
          label="Menu"
          icon={({ color, size }) => (
            <Ionicons
              name="restaurant-outline"
              size={size}
              color={color}
            />
          )}
          onPress={() => {
            navigation.navigate('App', {
              screen: 'Menu',
            } as never);

            navigation.closeDrawer();
          }}
        />

        {/* Panier */}
        <DrawerItem
          label="Mon panier"
          icon={({ color, size }) => (
            <Ionicons
              name="cart-outline"
              size={size}
              color={color}
            />
          )}
          onPress={() => {
            navigation.navigate('App', {
              screen: 'Cart',
            } as never);

            navigation.closeDrawer();
          }}
        />

        {/* Commandes */}
        <DrawerItem
          label="Mes commandes"
          icon={({ color, size }) => (
            <Ionicons
              name="receipt-outline"
              size={size}
              color={color}
            />
          )}
          onPress={() => {
            navigation.navigate('App', {
              screen: 'Orders',
            } as never);

            navigation.closeDrawer();
          }}
        />

        {/* Separator */}
        <View
          style={{
            height: 1,
            backgroundColor: '#E5E7EB',
            marginVertical: 12,
            marginHorizontal: 20,
          }}
        />

        {/* =========================
            FEEDBACK
        ========================== */}
        <DrawerItem
          label="Donner mon avis"
          icon={({ color, size }) => (
            <Ionicons
              name="star-outline"
              size={size}
              color={color}
            />
          )}
          onPress={() => {
            navigation.closeDrawer();

            rootNavigation?.navigate('Feedback');
          }}
        />

        {/* Profile */}
        <DrawerItem
          label="Mon profil"
          icon={({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          )}
          onPress={() => {
            navigation.navigate('App', {
              screen: 'Profile',
            } as never);

            navigation.closeDrawer();
          }}
        />
      </View>

      {/* =========================
          FOOTER
      ========================== */}
      <View
        style={{
          marginTop: 'auto',
          paddingHorizontal: 24,
          paddingBottom: 25,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: colors.textSecondary,
          }}
        >
          CoChef
        </Text>

        <Text
          style={{
            fontSize: 10,
            color: colors.textSecondary,
            marginTop: 3,
          }}
        >
          Mangez bien. Vivez mieux.
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: '82%',
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
      }}
    >
      <Drawer.Screen
        name="App"
        component={MainTabNavigator}
      />
    </Drawer.Navigator>
  );
}