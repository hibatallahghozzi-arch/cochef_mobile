import { colors } from './colors';
import { fontFamily, fontSize, lineHeight } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  spacing,
  fontFamily,
  fontSize,
  lineHeight,
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
} as const;

export type Theme = typeof theme;
