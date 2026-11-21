import { useRef } from 'react';
import { StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';

import { AppText } from '@/components/AppText';
import { spacing, useTheme } from '@/theme';

interface AlphabetIndexProps {
  letters: { letter: string; position: number }[];
  onSelect: (position: number) => void;
}

/** Letras rápidas a la derecha para saltar en la lista (pantallas y flujos, 3.2). */
export function AlphabetIndex({ letters, onSelect }: AlphabetIndexProps) {
  const { colors } = useTheme();
  const height = useRef(0);
  const last = useRef(-1);

  if (letters.length < 2) return null;

  const handle = (e: GestureResponderEvent) => {
    if (height.current <= 0) return;
    const ratio = Math.min(0.999, Math.max(0, e.nativeEvent.locationY / height.current));
    const i = Math.floor(ratio * letters.length);
    if (i !== last.current) {
      last.current = i;
      onSelect(letters[i].position);
    }
  };

  return (
    <View
      style={styles.root}
      onLayout={(e: LayoutChangeEvent) => (height.current = e.nativeEvent.layout.height)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handle}
      onResponderMove={handle}
      onResponderRelease={() => (last.current = -1)}
      accessibilityRole="adjustable"
      accessibilityLabel="Índice alfabético">
      {letters.map(({ letter }) => (
        <AppText key={letter} variant="caption" style={[styles.letter, { color: colors.accent }]}>
          {letter}
        </AppText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 0,
    top: spacing.xs,
    bottom: spacing.xs,
    width: 24,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  letter: { fontSize: 10, lineHeight: 12 },
});
