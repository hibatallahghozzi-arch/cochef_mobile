/**
 * Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48px.
 *
 * These are already Tailwind's default p-1..p-12 scale (p-4 = 16px, etc.), so
 * NativeWind className usage doesn't need this file at all — just use the
 * standard utilities (p-4, gap-6, m-8...). This file exists for the numeric
 * style contexts NativeWind can't reach: FlatList `contentContainerStyle`,
 * `gap` on a plain StyleSheet object, animation distances, etc.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export type SpacingToken = keyof typeof spacing;
