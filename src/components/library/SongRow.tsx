import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { NowPlayingBars } from '@/components/player/NowPlayingBars';
import { formatDuration } from '@/library/text';
import type { Song } from '@/library/types';
import { usePlayer } from '@/player/player';
import { openSongMenu } from '@/store/songMenu';
import { radius, sizes, spacing, useTheme } from '@/theme';

import { Artwork } from './Artwork';

interface SongRowProps {
  song: Song;
  /** En el detalle de un álbum se muestra el número de pista en lugar de la carátula. */
  showTrackNumber?: boolean;
  /** Texto secundario; por defecto, el artista. */
  subtitle?: string;
  onPress?: (song: Song) => void;
  onMorePress?: (song: Song) => void;
}

/** Fila de canción (guía de diseño, 2.6): carátula 48 · título · artista · ⋮ */
export const SongRow = memo(function SongRow({
  song,
  showTrackNumber,
  subtitle,
  onPress,
  onMorePress,
}: SongRowProps) {
  const { colors } = useTheme();
  const isCurrent = usePlayer((s) => s.current?.id === song.id);
  const playing = usePlayer((s) => isCurrent && s.playing);

  return (
    <Pressable
      onPress={onPress ? () => onPress(song) : undefined}
      android_ripple={{ color: colors.surfaceVariant }}
      accessibilityRole="button"
      accessibilityLabel={`${song.title}, ${song.artist}`}
      style={styles.row}>
      {showTrackNumber ? (
        <View style={styles.trackNumber}>
          {isCurrent ? (
            <NowPlayingBars color={colors.accent} playing={playing} />
          ) : (
            <AppText variant="bodySmall" tone="secondary">
              {song.trackNumber ?? '–'}
            </AppText>
          )}
        </View>
      ) : (
        <View>
          <Artwork uri={song.artworkPath} size={sizes.listArtwork} radius={radius.sm} />
          {isCurrent ? (
            <View style={[styles.overlay, { borderRadius: radius.sm }]}>
              <NowPlayingBars color="#FFFFFF" playing={playing} />
            </View>
          ) : null}
        </View>
      )}
      <View style={styles.text}>
        <AppText variant="body" numberOfLines={1} tone={isCurrent ? 'accent' : 'primary'}>
          {song.title}
        </AppText>
        <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
          {subtitle ?? song.artist}
        </AppText>
      </View>
      <AppText variant="caption" tone="secondary">
        {formatDuration(song.durationMs)}
      </AppText>
      <Pressable
        onPress={() => (onMorePress ?? openSongMenu)(song)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Más opciones"
        style={styles.more}>
        <MaterialIcons name="more-vert" size={sizes.icon} color={colors.textSecondary} />
      </Pressable>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    height: sizes.songRowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: sizes.screenPadding,
  },
  trackNumber: { width: sizes.listArtwork, alignItems: 'center' },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  more: {
    width: sizes.minTouchTarget - spacing.xs,
    height: sizes.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.xs,
  },
});
