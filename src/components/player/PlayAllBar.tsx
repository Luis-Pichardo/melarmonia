import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { Song } from '@/library/types';
import { playSongs, shuffleAll } from '@/player/player';
import { sizes, spacing } from '@/theme';

interface PlayAllBarProps {
  songs: Song[];
  sourceLabel: string;
}

/** Botones ▶ Reproducir todo y 🔀 Aleatorio (pantallas y flujos, 3.2). */
export function PlayAllBar({ songs, sourceLabel }: PlayAllBarProps) {
  if (songs.length === 0) return null;
  return (
    <View style={styles.row}>
      <PrimaryButton
        label="Reproducir"
        icon="play-arrow"
        onPress={() => playSongs(songs, 0, sourceLabel, { shuffle: false })}
        style={styles.flex}
      />
      <PrimaryButton
        label="Aleatorio"
        icon="shuffle"
        variant="tonal"
        onPress={() => shuffleAll(songs, sourceLabel)}
        style={styles.flex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.sm,
  },
  flex: { flex: 1 },
});
