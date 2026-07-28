import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import EmptyState from '@/components/ui/EmptyState';
import Loader from '@/components/ui/Loader';
import MealCard from '@/components/common/MealCard';
import { colors } from '@/constants/colors';
import { useCart } from '@/contexts/CartContext';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useMeals } from '@/hooks/useMeals';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Menu'>,
  NativeStackScreenProps<RootStackParamList>
>;

type FilterKey = 'all' | 'protein' | 'vegetarian' | 'lowFat';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'protein', label: 'Protéiné' },
  { key: 'vegetarian', label: 'Végétarien' },
  { key: 'lowFat', label: 'Faible en gras' },
];

export default function MenuScreen({ navigation }: Props) {
  const { data: meals, isLoading, refetch, isRefetching } = useMeals();
  const { data: favorites } = useFavorites();
  const { addFavorite, removeFavorite } = useToggleFavorite();
  const { addItem } = useCart();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const favoriteIds = useMemo(() => new Set((favorites ?? []).map((meal) => meal.id)), [favorites]);

  const filteredMeals = useMemo(() => {
    return (meals ?? []).filter((meal) => {
      const matchesSearch = meal.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesFilter = filter === 'all' || meal.tags?.some((tag) => tag.variant === filter);
      return matchesSearch && matchesFilter;
    });
  }, [meals, search, filter]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <View className="flex-1 bg-background">
      <View className="gap-3 p-4 pb-2">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un plat..."
          placeholderTextColor={colors.textSecondary}
          className="h-11 rounded-xl border border-border bg-white px-4 font-sans text-base text-text"
        />

        <View className="flex-row flex-wrap gap-2">
          {FILTERS.map((item) => {
            const isActive = filter === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                className={`rounded-full px-4 py-1.5 ${isActive ? 'bg-primary' : 'bg-white border border-border'}`}
              >
                <Text className={`font-sans-medium text-sm ${isActive ? 'text-white' : 'text-text-secondary'}`}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredMeals}
        keyExtractor={(meal) => meal.id}
        contentContainerClassName="gap-3 p-4 pt-2"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState icon="restaurant-outline" title="Aucun plat trouvé" subtitle="Essayez un autre filtre ou une autre recherche." />
        }
        renderItem={({ item: meal }) => (
          <MealCard
            meal={meal}
            isFavorite={favoriteIds.has(meal.id)}
            onPress={() => navigation.navigate('MealDetail', { mealId: meal.id })}
            onToggleFavorite={() =>
              favoriteIds.has(meal.id) ? removeFavorite(meal.id) : addFavorite(meal.id)
            }
            onAddPress={() => addItem(meal)}
          />
        )}
      />
    </View>
  );
}
