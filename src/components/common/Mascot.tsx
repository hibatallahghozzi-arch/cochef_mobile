import {
  Image,
  type ImageSourcePropType,
} from 'react-native';

export type MascotSize = 'sm' | 'md' | 'lg' | 'xl';

export interface MascotProps {
  size?: MascotSize;
  source?: ImageSourcePropType;
}

const SIZE: Record<
  MascotSize,
  {
    width: number;
    height: number;
  }
> = {
  sm: {
    width: 55,
    height: 80,
  },
  md: {
    width: 100,
    height: 145,
  },
  lg: {
    width: 165,
    height: 240,
  },
  xl: {
    width: 220,
    height: 320,
  },
};

export default function Mascot({
  size = 'md',
  source = require('@/assets/josef.png'),
}: MascotProps) {
  const dimensions = SIZE[size];

  return (
    <Image
      source={source}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
      resizeMode="contain"
      accessibilityLabel="Josef, the CoChef mascot"
    />
  );
}