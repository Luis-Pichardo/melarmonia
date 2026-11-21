import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sizes, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

interface ScreenProps {
  title: string;
  children?: ReactNode;
}

/** Contenedor base de las pantallas principales: fondo del tema y título h1. */
export function Screen({ title, children }: ScreenProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <AppText variant="h1" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: {
    paddingHorizontal: sizes.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  content: { flex: 1, paddingHorizontal: sizes.screenPadding },
});
