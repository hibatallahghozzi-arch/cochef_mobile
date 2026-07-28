/**
 * Brand color tokens.
 *
 * These values are also declared in tailwind.config.js so `className="bg-primary"`
 * etc. work through NativeWind. Keep the two in sync manually — tailwind.config.js
 * runs as plain CommonJS outside the app bundle, so it can't import this file directly.
 * Use this file (not raw hex) whenever a color is needed outside of className, e.g.
 * icon `color` props, ActivityIndicator, StatusBar.
 */
export const colors = {
  primary: '#0B3C5D',
  secondary: '#1AA6E4',
  orange: '#F9A61A',
  pink: '#E51955',
  green: '#79C143',
  background: '#F8FAFC',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;
