import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { pluralize } from '@/library/text';
import type { Artist } from '@/library/types';
import { radius, sizes, spacing, useTheme } from '@/theme';

import { Artwork } from './Artwork';

interface ArtistRowProps {
  artist: Artist;
  onPress: (artist: Artist) => void;
}

export const ARTIST_ROW_HEIGHT = 72;

/** Fila de artista (guía de diseño, 2.6): imagen circular 56 · nombre · "N canciones". */
export const ArtistRow = memo(function ArtistRow({ artist, onPress }: ArtistRowProps) {
  const { colors } = useTheme();
  const detail = [
    pluralize(artist.albumCount, 'álbum', 'álbumes'),
    pluralize(artist.songCount, 'canción', 'canciones'),
  ].join(' · ');

  return (
    <Pressable
      onPress={() => onPress(artist)}
      android_ripple={{ color: colors.surfaceVariant }}
      accessibilityRole="button"
      accessibilityLabel={`${artist.name}, ${detail}`}
      style={styles.row}>
      <Artwork uri={artist.artworkPath} size={56} radius={radius.round} />
      <View style={styles.text}>
        <AppText variant="body" numberOfLines={1}>
          {artist.name}
        </AppText>
        <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
          {detail}
        </AppText>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    height: ARTIST_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: sizes.screenPadding,
  },
  text: { flex: 1, minWidth: 0 },
});
