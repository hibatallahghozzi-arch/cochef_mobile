import { FlatList, RefreshControl } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import EmptyState from '@/components/ui/EmptyState';
import Header from '@/components/common/Header';
import Loader from '@/components/ui/Loader';
import MealCard from '@/components/common/MealCard';
import { colors } from '@/constants/colors';
import { useCart } from '@/contexts/CartContext';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import type { RootStackParamList } from '@/navigation/types';
import type { Meal } from '@/types/meal';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen({ navigation }: Props) {
  const { data: favorites, isLoading, refetch, isRefetching } = useFavorites();
  const { removeFavorite } = useToggleFavorite();
  const { addItem } = useCart();

  return (
    <>
      <Header title="Favoris" onBackPress={() => navigation.goBack()} />
      {isLoading ? (
        <Loader fullScreen />
      ) : (
        <FlatList<Meal>
          data={favorites ?? []}
          keyExtractor={(meal) => meal.id}
          className="flex-1 bg-background"
          contentContainerClassName="gap-3 p-4"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="heart-outline"
              title="Aucun favori"
              subtitle="Appuyez sur le cœur d'un plat pour l'ajouter ici."
            />
          }
          renderItem={({ item: meal }) => (
            <MealCard
              meal={meal}
              isFavorite
              onPress={() => navigation.navigate('MealDetail', { mealId: meal.id })}
              onToggleFavorite={() => removeFavorite(meal.id)}
              onAddPress={() => addItem(meal)}
            />
          )}
        />
      )}
    </>
  );
}
