import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Artwork } from '@/components/library/Artwork';
import { next, togglePlay, usePlayer } from '@/player/player';
import { radius, sizes, spacing, useTheme } from '@/theme';

/**
 * Mini reproductor fijo sobre el menú inferior (guía de diseño, 2.6).
 * Tocarlo abre el reproductor completo.
 */
export function MiniPlayer() {
  const { colors } = useTheme();
  const current = usePlayer((s) => s.current);
  const playing = usePlayer((s) => s.playing);
  const position = usePlayer((s) => s.positionSec);
  const duration = usePlayer((s) => s.durationSec);

  if (!current) return null;

  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <View
      style={[styles.root, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
      <Pressable
        onPress={() => router.push('/reproductor')}
        accessibilityRole="button"
        accessibilityLabel={`Abrir reproductor: ${current.title}, ${current.artist}`}
        style={styles.row}>
        <Artwork uri={current.artworkPath} size={sizes.miniPlayerArtwork} radius={radius.sm} />
        <View style={styles.text}>
          <AppText variant="bodySmall" numberOfLines={1} style={styles.title}>
            {current.title}
          </AppText>
          <AppText variant="caption" tone="secondary" numberOfLines={1}>
            {current.artist}
          </AppText>
        </View>
        <Pressable
          onPress={togglePlay}
          accessibilityRole="button"
          accessibilityLabel={playing ? 'Pausa' : 'Reproducir'}
          style={[styles.play, { backgroundColor: colors.primary }]}>
          <MaterialIcons
            name={playing ? 'pause' : 'play-arrow'}
            size={26}
            color={colors.onPrimary}
          />
        </Pressable>
        <Pressable
          onPress={next}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Siguiente canción"
          style={styles.next}>
          <MaterialIcons name="skip-next" size={28} color={colors.textPrimary} />
        </Pressable>
      </Pressable>
      <View style={[styles.track, { backgroundColor: colors.surfaceVariant }]}>
        <View
          style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { borderTopWidth: StyleSheet.hairlineWidth },
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  text: { flex: 1, minWidth: 0 },
  title: { fontFamily: 'Inter_500Medium' },
  play: {
    width: sizes.miniPlayButton,
    height: sizes.miniPlayButton,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  next: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center' },
  track: { height: 2 },
  fill: { height: 2 },
});
