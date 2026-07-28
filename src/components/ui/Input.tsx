import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/constants/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// forwardRef so React Hook Form's Controller (Phase 6) can attach a ref for
// focus management without needing a wrapper.
const Input = forwardRef<TextInput, InputProps>(({ label, error, className, ...textInputProps }, ref) => {
  return (
    <View className="w-full">
      {label ? <Text className="mb-1 font-sans-medium text-sm text-text">{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.textSecondary}
        className={`h-12 rounded-xl border px-4 font-sans text-base text-text ${
          error ? 'border-pink' : 'border-border'
        } ${className ?? ''}`}
        {...textInputProps}
      />
      {error ? <Text className="mt-1 font-sans text-xs text-pink">{error}</Text> : null}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
