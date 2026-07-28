import { memo } from 'react';
import { Text, View } from 'react-native';

// Maps to the pills shown on the meal card / meal detail mockups. Some are
// solid brand colors with white text (protein, vegetarian, vegan, keto);
// others are pale tints with dark text (low-fat, balanced) — matching what
// the reference screens show.
export type TagVariant = 'protein' | 'vegetarian' | 'vegan' | 'keto' | 'lowFat' | 'balanced';

export interface TagProps {
  label: string;
  variant: TagVariant;
}

const VARIANT_CLASSES: Record<TagVariant, string> = {
  protein: 'bg-primary',
  vegetarian: 'bg-green',
  vegan: 'bg-green',
  keto: 'bg-pink',
  lowFat: 'bg-green/15',
  balanced: 'bg-orange/15',
};

const TEXT_CLASSES: Record<TagVariant, string> = {
  protein: 'text-white',
  vegetarian: 'text-white',
  vegan: 'text-white',
  keto: 'text-white',
  lowFat: 'text-green',
  balanced: 'text-orange',
};

function Tag({ label, variant }: TagProps) {
  return (
    <View className={`rounded-full px-3 py-1 ${VARIANT_CLASSES[variant]}`}>
      <Text className={`font-sans-medium text-xs ${TEXT_CLASSES[variant]}`}>{label}</Text>
    </View>
  );
}

export default memo(Tag);
