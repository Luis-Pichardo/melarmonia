import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useLibrary } from '@/store/library';
import { radius, sizes, spacing, useTheme } from '@/theme';

/** Barra "Buscando tu música… (N canciones)" (pantallas y flujos, 3.4). */
export function ScanProgressBar() {
  const { colors } = useTheme();
  const status = useLibrary((s) => s.status);
  const progress = useLibrary((s) => s.progress);

  if (status !== 'scanning' || !progress) return null;

  let label = `Buscando tu música… (${progress.done} archivos)`;
  let ratio: number | null = null;
  if (progress.phase === 'reading') {
    label = `Leyendo canciones… (${progress.done} de ${progress.total})`;
    ratio = progress.total ? progress.done / progress.total : null;
  } else if (progress.phase === 'artwork') {
    label = `Preparando carátulas… (${progress.done} de ${progress.total})`;
    ratio = progress.total ? progress.done / progress.total : null;
  }

  return (
    <View style={styles.root} accessibilityLiveRegion="polite">
      <AppText variant="caption" tone="secondary">
        {label}
      </AppText>
      <View style={[styles.track, { backgroundColor: colors.surfaceVariant }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: colors.primary,
              width: ratio === null ? '30%' : `${Math.round(ratio * 100)}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: sizes.screenPadding, paddingBottom: spacing.xs, gap: spacing.xxs },
  track: { height: 3, borderRadius: radius.round, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.round },
});
