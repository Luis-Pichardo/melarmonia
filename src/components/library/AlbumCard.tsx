import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import type { Album } from '@/library/types';
import { radius, spacing } from '@/theme';

import { Artwork } from './Artwork';

interface AlbumCardProps {
  album: Album;
  onPress: (album: Album) => void;
}

/** Tarjeta de álbum (guía de diseño, 2.6): carátula cuadrada · nombre · artista. */
export const AlbumCard = memo(function AlbumCard({ album, onPress }: AlbumCardProps) {
  return (
    <Pressable
      onPress={() => onPress(album)}
      accessibilityRole="button"
      accessibilityLabel={`Álbum ${album.title}, ${album.artist}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Artwork uri={album.artworkPath} size="100%" radius={radius.md} />
      <AppText variant="body" numberOfLines={1} style={styles.title}>
        {album.title}
      </AppText>
      <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
        {album.artist}
      </AppText>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: { flex: 1, padding: spacing.xs },
  pressed: { opacity: 0.7 },
  title: { marginTop: spacing.xs },
});
