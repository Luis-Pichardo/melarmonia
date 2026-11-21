import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Estado vacío (pantallas y flujos, 3.4). */
export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.root}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceVariant }]}>
        <MaterialIcons name={icon} size={40} color={colors.accent} />
      </View>
      <AppText variant="h2" style={styles.center}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="bodySmall" tone="secondary" style={styles.center}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  center: { textAlign: 'center' },
  action: { marginTop: spacing.md },
});
