import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { radius, sizes, spacing, useTheme, type ThemeColors, type ThemePreference } from '@/theme';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'dark', label: 'Oscuro' },
  { value: 'light', label: 'Claro' },
  { value: 'system', label: 'Sistema' },
];

const swatches: { key: keyof ThemeColors; label: string }[] = [
  { key: 'primary', label: 'primary' },
  { key: 'primaryDark', label: 'primaryDark' },
  { key: 'primaryLight', label: 'primaryLight' },
  { key: 'background', label: 'background' },
  { key: 'surface', label: 'surface' },
  { key: 'surfaceVariant', label: 'surfaceVariant' },
  { key: 'textPrimary', label: 'textPrimary' },
  { key: 'textSecondary', label: 'textSecondary' },
];

/**
 * Ajustes (versión de la etapa 1): elegir el tema y ver la paleta activa.
 * La pantalla completa (colores, biblioteca, reproducción) llega en la etapa 7.
 */
export default function AjustesScreen() {
  const { colors, preference, setPreference } = useTheme();

  return (
    <Screen title="Ajustes">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="h2">Tema</AppText>
        <View style={[styles.segmented, { backgroundColor: colors.surfaceVariant }]}>
          {themeOptions.map((option) => {
            const selected = option.value === preference;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setPreference(option.value)}
                style={[styles.segment, selected && { backgroundColor: colors.primary }]}>
                <AppText
                  variant="caption"
                  style={{ color: selected ? colors.onPrimary : colors.textSecondary }}>
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <AppText variant="h2" style={styles.section}>
          Paleta actual
        </AppText>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {swatches.map((s) => (
            <View key={s.key} style={styles.swatchRow}>
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: colors[s.key], borderColor: colors.divider },
                ]}
              />
              <AppText variant="bodySmall" style={styles.swatchLabel}>
                {s.label}
              </AppText>
              <AppText variant="caption" tone="secondary">
                {colors[s.key]}
              </AppText>
            </View>
          ))}
        </View>

        <AppText variant="bodySmall" tone="secondary" style={styles.section}>
          Los colores personalizados, la biblioteca y la reproducción llegan en la etapa 7.
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xl, gap: spacing.sm },
  section: { marginTop: spacing.md },
  segmented: { flexDirection: 'row', borderRadius: radius.md, padding: spacing.xxs },
  segment: {
    flex: 1,
    minHeight: sizes.minTouchTarget - spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  card: { borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  swatchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  swatch: { width: 32, height: 32, borderRadius: radius.sm, borderWidth: 1 },
  swatchLabel: { flex: 1 },
});
