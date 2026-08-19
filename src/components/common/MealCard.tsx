import { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

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
  variant?: 'horizontal' | 'compact';
}

function MealCard({
  meal,
  isFavorite = false,
  onPress,
  onToggleFavorite,
  onAddPress,
  variant = 'horizontal',
}: MealCardProps) {
  /*
   * COMPACT VARIANT
   * Used on the Home screen.
   */
  if (variant === 'compact') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        className="w-[118px]"
      >
        <Card className="overflow-hidden p-0">
          {/* Meal image */}
          <View className="relative">
            {meal.imageUrl ? (
              <Image
                source={{ uri: meal.imageUrl }}
                className="h-[88px] w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-[88px] w-full items-center justify-center bg-background">
                <Ionicons
                  name="restaurant-outline"
                  size={28}
                  color={colors.textSecondary}
                />
              </View>
            )}

            {/* Favorite button */}
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
                className="absolute right-1.5 top-1.5 h-7 w-7 items-center justify-center rounded-full bg-white/90"
              >
                <Ionicons
                  name={
                    isFavorite
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={16}
                  color={
                    isFavorite
                      ? colors.pink
                      : colors.textSecondary
                  }
                />
              </Pressable>
            ) : null}
          </View>

          {/* Meal information */}
          <View className="min-h-[67px] justify-between p-2">
            <Text
              numberOfLines={2}
              className="font-sans-semibold text-[11px] leading-4 text-primary"
            >
              {meal.name}
            </Text>

            <View className="mt-1 flex-row items-center justify-between">
              <Text className="font-sans-semibold text-[10px] text-orange">
                {Number(meal.price).toFixed(3)} DT
              </Text>

              {onAddPress ? (
                <Pressable
                  onPress={onAddPress}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${meal.name} to cart`}
                  className="h-7 w-7 items-center justify-center rounded-full bg-primary"
                >
                  <Ionicons
                    name="add"
                    size={17}
                    color={colors.white}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>
        </Card>
      </Pressable>
    );
  }

  /*
   * HORIZONTAL VARIANT
   * Used by MenuScreen and other screens.
   */
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
    >
      <Card className="w-full flex-row gap-3 p-3">
        {/* Meal image */}
        {meal.imageUrl ? (
          <Image
            source={{ uri: meal.imageUrl }}
            className="h-20 w-20 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-xl bg-background">
            <Ionicons
              name="restaurant-outline"
              size={24}
              color={colors.textSecondary}
            />
          </View>
        )}

        {/* Meal content */}
        <View className="flex-1 justify-between">
          {/* Name + favorite */}
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
                  name={
                    isFavorite
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={20}
                  color={
                    isFavorite
                      ? colors.pink
                      : colors.textSecondary
                  }
                />
              </Pressable>
            ) : null}
          </View>

          {/* Tags */}
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

          {/* Calories + price + add */}
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
                {Number(meal.price).toFixed(3)} DT
              </Text>

              {onAddPress ? (
                <Pressable
                  onPress={onAddPress}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${meal.name} to cart`}
                  className="h-7 w-7 items-center justify-center rounded-full bg-orange"
                >
                  <Ionicons
                    name="add"
                    size={17}
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