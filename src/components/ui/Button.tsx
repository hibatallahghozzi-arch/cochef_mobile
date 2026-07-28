import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { colors } from '@/constants/colors';

// Matches the 3-button system from the design spec: Primary (navy, e.g.
// "Continuer"), Secondary (cyan, e.g. "Voir le menu"), Accent (orange, e.g.
// "Commander"). No outline style appears in the reference screens, so we
// don't invent one here.
export type ButtonVariant = 'primary' | 'secondary' | 'accent';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
}

const CONTAINER_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-orange',
};

export default function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={`h-12 flex-row items-center justify-center rounded-xl px-6 ${CONTAINER_CLASSES[variant]} ${
        isDisabled ? 'opacity-50' : ''
      }`}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text className="font-sans-semibold text-base text-white">{label}</Text>
      )}
    </Pressable>
  );
}
