import { Image, type ImageStyle, type StyleProp } from 'react-native';

export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps {
  size?: LogoSize;
  style?: StyleProp<ImageStyle>;
}

const DIMENSIONS: Record<LogoSize, number> = {
  sm: 56,
  md: 96,
  lg: 160,
};

// Real CoChef Startup Village logo (chef-hat mark + wordmark), provided as a
// flat JPG on a white background — not transparent. It reads fine on the
// app's light background (#F8FAFC) and on white cards; ask for a transparent
// PNG export if it ever needs to sit on a dark or colored surface.
export default function Logo({ size = 'md', style }: LogoProps) {
  const dimension = DIMENSIONS[size];

  return (
    <Image
      source={require('@/assets/images/logo.jpg')}
      style={[{ width: dimension, height: dimension }, style]}
      resizeMode="contain"
      accessibilityLabel="CoChef Startup Village"
    />
  );
}
