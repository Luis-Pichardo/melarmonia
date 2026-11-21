import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { formatDuration } from '@/library/text';
import type { Song } from '@/library/types';
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

  return (
    <Pressable
      onPress={onPress ? () => onPress(song) : undefined}
      android_ripple={{ color: colors.surfaceVariant }}
      accessibilityRole="button"
      accessibilityLabel={`${song.title}, ${song.artist}`}
      style={styles.row}>
      {showTrackNumber ? (
        <View style={styles.trackNumber}>
          <AppText variant="bodySmall" tone="secondary">
            {song.trackNumber ?? '–'}
          </AppText>
        </View>
      ) : (
        <Artwork uri={song.artworkPath} size={sizes.listArtwork} radius={radius.sm} />
      )}
      <View style={styles.text}>
        <AppText variant="body" numberOfLines={1}>
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
        onPress={onMorePress ? () => onMorePress(song) : undefined}
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
  text: { flex: 1, minWidth: 0 },
  more: {
    width: sizes.minTouchTarget - spacing.xs,
    height: sizes.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.xs,
  },
});
