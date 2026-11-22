import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
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
      <View style={styles.illustration} accessibilityElementsHidden importantForAccessibility="no">
        <LinearGradient
          colors={[`${colors.primary}55`, `${colors.primaryLight}10`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.halo}
        />
        <LinearGradient
          colors={[colors.primaryDark, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}>
          <MaterialIcons name={icon} size={40} color={colors.onPrimary} />
        </LinearGradient>
        <MaterialIcons name="music-note" size={22} color={colors.accent} style={styles.noteA} />
        <MaterialIcons name="audiotrack" size={16} color={colors.accent} style={styles.noteB} />
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
  illustration: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  halo: { position: 'absolute', width: 150, height: 150, borderRadius: radius.round },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteA: { position: 'absolute', top: 14, right: 18, opacity: 0.8 },
  noteB: { position: 'absolute', bottom: 22, left: 16, opacity: 0.6 },
  center: { textAlign: 'center' },
  action: { marginTop: spacing.md },
});
