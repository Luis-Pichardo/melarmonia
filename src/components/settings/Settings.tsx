import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { radius, sizes, spacing, useTheme } from '@/theme';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

/** Sección de Ajustes: título y tarjeta con filas. */
export function SettingsSection({
  title,
  footer,
  children,
}: {
  title: string;
  footer?: string;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <AppText variant="caption" tone="accent" style={styles.sectionTitle}>
        {title.toUpperCase()}
      </AppText>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>{children}</View>
      {footer ? (
        <AppText variant="caption" tone="secondary" style={styles.footer}>
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

/** Fila de Ajustes: icono, texto, valor o control a la derecha y, si navega, una flecha. */
export function SettingsRow({
  icon,
  label,
  description,
  value,
  right,
  onPress,
  chevron,
}: {
  icon?: IconName;
  label: string;
  description?: string;
  value?: string;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      android_ripple={onPress ? { color: colors.surfaceVariant } : undefined}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={[label, value, description].filter(Boolean).join(', ')}
      style={styles.row}>
      {icon ? <MaterialIcons name={icon} size={sizes.icon} color={colors.accent} /> : null}
      <View style={styles.rowText}>
        <AppText variant="body">{label}</AppText>
        {description ? (
          <AppText variant="bodySmall" tone="secondary">
            {description}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="bodySmall" tone="secondary">
          {value}
        </AppText>
      ) : null}
      {right}
      {chevron ? (
        <MaterialIcons name="chevron-right" size={sizes.icon} color={colors.textSecondary} />
      ) : null}
    </Pressable>
  );
}

/** Control segmentado (Oscuro · Claro · Sistema, duraciones…). */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.segmented, { backgroundColor: colors.surfaceVariant }]}
      accessibilityRole="radiogroup"
      accessibilityLabel={label}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
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
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    paddingHorizontal: sizes.screenPadding + spacing.xxs,
    paddingBottom: spacing.xs,
    letterSpacing: 0.8,
  },
  card: { marginHorizontal: sizes.screenPadding, borderRadius: radius.md, overflow: 'hidden' },
  footer: { paddingHorizontal: sizes.screenPadding + spacing.xxs, paddingTop: spacing.xs },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowText: { flex: 1, minWidth: 0 },
  segmented: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: spacing.xxs,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  segment: {
    flex: 1,
    minHeight: sizes.minTouchTarget - spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
});
