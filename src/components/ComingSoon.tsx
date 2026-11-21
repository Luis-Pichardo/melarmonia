import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

interface ComingSoonProps {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  message: string;
  stage: number;
}

/** Marcador temporal para las pantallas que se construyen en etapas posteriores. */
export function ComingSoon({ icon, message, stage }: ComingSoonProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.root}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceVariant }]}>
        <MaterialIcons name={icon} size={40} color={colors.accent} />
      </View>
      <AppText variant="h2" style={styles.center}>
        {message}
      </AppText>
      <AppText variant="bodySmall" tone="secondary" style={styles.center}>
        Llega en la etapa {stage}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  center: { textAlign: 'center' },
});
