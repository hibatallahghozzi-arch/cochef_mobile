import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '@/components/ui/Button';
import Header from '@/components/common/Header';
import Loader from '@/components/ui/Loader';
import Tag from '@/components/common/Tag';
import { useCart } from '@/contexts/CartContext';
import { useMeal } from '@/hooks/useMeals';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MealDetail'>;

export default function MealDetailScreen({ route, navigation }: Props) {
  const { mealId } = route.params;
  const { data: meal, isLoading } = useMeal(mealId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading || !meal) {
    return <Loader fullScreen />;
  }

  return (
    <View className="flex-1 bg-background">
      <Header title={meal.name} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerClassName="p-4 gap-4">
        {meal.imageUrl ? (
          <Image source={{ uri: meal.imageUrl }} className="h-48 w-full rounded-2xl" />
        ) : null}

        {meal.description ? <Text className="font-sans text-base text-text-secondary">{meal.description}</Text> : null}

        {meal.tags && meal.tags.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {meal.tags.map((tag) => (
              <Tag key={tag.label} label={tag.label} variant={tag.variant} />
            ))}
          </View>
        ) : null}

        <View className="flex-row justify-between rounded-2xl border border-border bg-white p-4">
          <MacroStat label="Calories" value={meal.calories ? `${meal.calories}` : '—'} />
          <MacroStat label="Protéines" value={meal.macros ? `${meal.macros.proteinGrams}g` : '—'} />
          <MacroStat label="Glucides" value={meal.macros ? `${meal.macros.carbsGrams}g` : '—'} />
          <MacroStat label="Lipides" value={meal.macros ? `${meal.macros.fatGrams}g` : '—'} />
        </View>

        {meal.ingredients && meal.ingredients.length > 0 ? (
          <View>
            <Text className="mb-2 font-sans-semibold text-base text-text">Ingrédients</Text>
            {meal.ingredients.map((ingredient) => (
              <Text key={ingredient} className="font-sans text-sm text-text-secondary">
                • {ingredient}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View className="flex-row items-center gap-3 border-t border-border bg-white p-4">
        <View className="flex-row items-center gap-3 rounded-xl border border-border px-3 py-2">
          <Pressable onPress={() => setQuantity((q) => Math.max(1, q - 1))} hitSlop={8} accessibilityRole="button" accessibilityLabel="Diminuer la quantité">
            <Text className="font-sans-bold text-lg text-primary">−</Text>
          </Pressable>
          <Text className="font-sans-semibold text-base text-text">{quantity}</Text>
          <Pressable onPress={() => setQuantity((q) => q + 1)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Augmenter la quantité">
            <Text className="font-sans-bold text-lg text-primary">+</Text>
          </Pressable>
        </View>
        <View className="flex-1">
          <Button
            label="Ajouter au panier"
            variant="accent"
            onPress={() => {
              addItem(meal, quantity);
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </View>
  );
}

function MacroStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Text className="font-sans-bold text-base text-text">{value}</Text>
      <Text className="font-sans text-xs text-text-secondary">{label}</Text>
    </View>
  );
}
