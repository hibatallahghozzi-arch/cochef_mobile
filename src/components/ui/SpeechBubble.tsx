import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

export type TailPosition = 'left' | 'right';

export interface SpeechBubbleProps extends PropsWithChildren {
  text?: string;
  /** Which corner of the bubble the tail hangs from, e.g. 'right' when the
   * mascot sits below/beside the bubble's right side (as in the splash mockup). */
  tailPosition?: TailPosition;
  /** Short colored accent bar under the content, matching the splash mockup's underline flourish. */
  accentColor?: string;
}

/**
 * Rounded bubble with a small triangular tail (a plain rotated square — no
 * SVG dependency). This component only controls which corner the tail comes
 * from; overall placement on screen (left-aligned, absolutely positioned,
 * etc.) is left to the caller.
 */
export default function SpeechBubble({ text, children, tailPosition = 'right', accentColor }: SpeechBubbleProps) {
  const isRight = tailPosition === 'right';

  return (
    <View>
      <View className="max-w-[260px] rounded-2xl border border-border bg-white p-4 shadow-sm">
        {text ? <Text className="font-sans text-base text-text">{text}</Text> : children}
        {accentColor ? (
          <View className="mt-2 h-0.5 w-8 rounded-full" style={{ backgroundColor: accentColor }} />
        ) : null}
      </View>
      <View
        className={`h-3 w-3 rotate-45 border-b border-r border-border bg-white ${isRight ? 'mr-6' : 'ml-6'}`}
        style={{ alignSelf: isRight ? 'flex-end' : 'flex-start', marginTop: -6 }}
      />
    </View>
  );
}
