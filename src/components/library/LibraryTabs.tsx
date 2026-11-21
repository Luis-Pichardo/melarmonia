import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { radius, sizes, spacing, useTheme } from '@/theme';

export type LibrarySection = 'songs' | 'artists' | 'albums';

const SECTIONS: { value: LibrarySection; label: string }[] = [
  { value: 'songs', label: 'Canciones' },
  { value: 'artists', label: 'Artistas' },
  { value: 'albums', label: 'Álbumes' },
];

interface LibraryTabsProps {
  value: LibrarySection;
  onChange: (value: LibrarySection) => void;
}

/** Pestañas superiores de la Biblioteca: Canciones · Artistas · Álbumes. */
export function LibraryTabs({ value, onChange }: LibraryTabsProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {SECTIONS.map((section) => {
        const selected = section.value === value;
        return (
          <Pressable
            key={section.value}
            onPress={() => onChange(section.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[
              styles.chip,
              { backgroundColor: selected ? colors.primary : colors.surfaceVariant },
            ]}>
            <AppText
              variant="caption"
              style={[styles.label, { color: selected ? colors.onPrimary : colors.textSecondary }]}>
              {section.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.sm,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 13 },
});
