import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

export interface CardProps extends PropsWithChildren<ViewProps> {}

export default function Card({ children, className, ...viewProps }: CardProps) {
  return (
    <View
      className={`rounded-2xl border border-border bg-white p-4 shadow-sm ${className ?? ''}`}
      {...viewProps}
    >
      {children}
    </View>
  );
}
