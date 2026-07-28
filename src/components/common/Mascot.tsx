import { Image, Text, View, type ImageSourcePropType } from 'react-native';

export type MascotSize = 'sm' | 'md' | 'lg';

export interface MascotProps {
  size?: MascotSize;
  /**
   * The Josef mascot artwork. No asset is bundled yet — once the PNG is
   * added at src/assets/images/mascot-josef.png, pass it as
   * `require('@/assets/images/mascot-josef.png')` from the call site, or
   * wire that require in directly here and remove this prop's optionality.
   */
  source?: ImageSourcePropType;
}

const SIZE_PX: Record<MascotSize, number> = {
  sm: 48,
  md: 96,
  lg: 160,
};

export default function Mascot({ size = 'md', source }: MascotProps) {
  const dimension = SIZE_PX[size];

  if (source) {
    return (
      <Image
        source={source}
        style={{ width: dimension, height: dimension }}
        resizeMode="contain"
        accessibilityLabel="Josef, the CoChef mascot"
      />
    );
  }

  // Fallback placeholder until the real Josef artwork is dropped in.
  return (
    <View
      style={{ width: dimension, height: dimension }}
      className="items-center justify-center rounded-full bg-secondary"
      accessibilityLabel="Josef, the CoChef mascot"
    >
      <Text style={{ fontSize: dimension * 0.5 }}>👋</Text>
    </View>
  );
}
