import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sizes, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

interface ScreenProps {
  title: string;
  /** Botones a la derecha del título. */
  headerRight?: ReactNode;
  /** Sin margen lateral: para listas que ocupan todo el ancho. */
  fullWidth?: boolean;
  children?: ReactNode;
}

/** Contenedor base de las pantallas principales: fondo del tema y título h1. */
export function Screen({ title, headerRight, fullWidth, children }: ScreenProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <AppText variant="h1" accessibilityRole="header" style={styles.title}>
          {title}
        </AppText>
        {headerRight}
      </View>
      <View style={[styles.content, fullWidth && styles.fullWidth]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  title: { flex: 1 },
  fullWidth: { paddingHorizontal: 0 },
  content: { flex: 1, paddingHorizontal: sizes.screenPadding },
});
