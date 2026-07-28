import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';

/**
 * Loads the Inter weights used across the design system. Returns
 * fontsLoaded=false until the async font load resolves — callers should hold
 * the splash screen (or render nothing) until then to avoid a flash of the
 * system font.
 */
export function useAppFonts() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return { fontsLoaded, fontError };
}
