import { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import type { Meal } from '@/types/meal';

import Card from '../ui/Card';
import Tag from './Tag';

export interface MealCardProps {
  meal: Meal;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  onAddPress?: () => void;
}

function MealCard({
  meal,
  isFavorite = false,
  onPress,
  onToggleFavorite,
  onAddPress,
}: MealCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card className="w-full flex-row gap-3 p-3">
        {meal.imageUrl ? (
          <Image source={{ uri: meal.imageUrl }} className="h-20 w-20 rounded-xl" />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-xl bg-background">
            <Ionicons
              name="restaurant-outline"
              size={24}
              color={colors.textSecondary}
            />
          </View>
        )}

        <View className="flex-1 justify-between">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text
                numberOfLines={1}
                className="font-sans-semibold text-base text-text"
              >
                {meal.name}
              </Text>

              {meal.description ? (
                <Text
                  numberOfLines={1}
                  className="font-sans text-xs text-text-secondary"
                >
                  {meal.description}
                </Text>
              ) : null}
            </View>

            {onToggleFavorite ? (
              <Pressable
                onPress={onToggleFavorite}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  isFavorite
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={
                    isFavorite ? colors.pink : colors.textSecondary
                  }
                />
              </Pressable>
            ) : null}
          </View>

          {meal.tags && meal.tags.length > 0 ? (
            <View className="mt-1 flex-row flex-wrap gap-1">
              {meal.tags.map((tag) => (
                <Tag
                  key={tag.label}
                  label={tag.label}
                  variant={tag.variant}
                />
              ))}
            </View>
          ) : null}

          <View className="mt-1 flex-row items-center justify-between">
            {meal.calories ? (
              <Text className="font-sans text-xs text-text-secondary">
                {meal.calories} cal
              </Text>
            ) : (
              <View />
            )}

            <View className="flex-row items-center gap-2">
              <Text className="font-sans-semibold text-sm text-primary">
                {Number(meal.price).toFixed(2)} €
              </Text>

              {onAddPress ? (
                <Pressable
                  onPress={onAddPress}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${meal.name} to cart`}
                  className="h-6 w-6 items-center justify-center rounded-full bg-orange"
                >
                  <Ionicons
                    name="add"
                    size={16}
                    color={colors.white}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export default memo(MealCard);