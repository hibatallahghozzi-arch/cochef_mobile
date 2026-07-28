import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useOrders } from '@/hooks/useOrders';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const MENU_ROWS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'person-outline', label: 'Informations personnelles' },
  { icon: 'location-outline', label: 'Mes adresses' },
  { icon: 'nutrition-outline', label: 'Préférences alimentaires' },
];

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { data: orders } = useOrders();
  const { data: favorites } = useFavorites();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4"
    >
      <Card className="items-center gap-1 py-6">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Text className="font-sans-bold text-2xl text-white">
            {user?.fullName?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>

        <Text className="font-sans-semibold text-lg text-text">
          {user?.fullName}
        </Text>

        <Text className="font-sans text-sm text-text-secondary">
          {user?.email}
        </Text>
      </Card>

      <Card className="flex-row justify-around">
        <Stat label="Commandes" value={`${orders?.length ?? 0}`} />
        <Stat label="Repas favoris" value={`${favorites?.length ?? 0}`} />
      </Card>

      <Pressable onPress={() => navigation.navigate('Favorites')}>
        <Card className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Ionicons name="heart-outline" size={20} color={colors.text} />
            <Text className="font-sans-medium text-base text-text">
              Mes favoris
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
          />
        </Card>
      </Pressable>

      {MENU_ROWS.map((row) => (
        <Card
          key={row.label}
          className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <Ionicons name={row.icon} size={20} color={colors.text} />
            <Text className="font-sans-medium text-base text-text">
              {row.label}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
          />
        </Card>
      ))}

      <Pressable onPress={logout}>
        <Card className="flex-row items-center gap-3">
          <Ionicons name="log-out-outline" size={20} color={colors.pink} />

          <Text className="font-sans-medium text-base text-pink">
            Déconnexion
          </Text>
        </Card>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Text className="font-sans-bold text-lg text-text">
        {value}
      </Text>

      <Text className="font-sans text-xs text-text-secondary">
        {label}
      </Text>
    </View>
  );
}