import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DetailHeader } from '@/components/DetailHeader';
import { EmptyState } from '@/components/EmptyState';
import { AlbumCard } from '@/components/library/AlbumCard';
import { Artwork } from '@/components/library/Artwork';
import { SongRow } from '@/components/library/SongRow';
import { PlayAllBar } from '@/components/player/PlayAllBar';
import { useArtist } from '@/library/selectors';
import { pluralize } from '@/library/text';
import type { Album, Song } from '@/library/types';
import { playSongs } from '@/player/player';
import { radius, sizes, spacing, useTheme } from '@/theme';

/** Detalle de artista: sus álbumes y sus canciones (pantallas y flujos, 3.2). */
export default function ArtistaScreen() {
  const { colors } = useTheme();
  const { name = '' } = useLocalSearchParams<{ name: string }>();
  const { songs, albums } = useArtist(name);

  const openAlbum = useCallback(
    (album: Album) => router.push({ pathname: '/album/[id]', params: { id: album.id } }),
    [],
  );
  const indexById = useMemo(() => new Map(songs.map((s, i) => [s.id, i])), [songs]);
  const onPress = useCallback(
    (song: Song) => playSongs(songs, indexById.get(song.id) ?? 0, name),
    [songs, indexById, name],
  );
  const renderItem = useCallback(
    ({ item }: { item: Song }) => <SongRow song={item} subtitle={item.album} onPress={onPress} />,
    [onPress],
  );

  if (songs.length === 0) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <DetailHeader />
        <EmptyState
          icon="person"
          title="Este artista ya no está en tu teléfono"
          actionLabel="Volver"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.root, { backgroundColor: colors.background }]}>
      <DetailHeader />
      <FlashList
        data={songs}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Artwork uri={albums[0]?.artworkPath ?? null} size={140} radius={radius.round} />
              <AppText variant="h1" style={styles.center} numberOfLines={2}>
                {name}
              </AppText>
              <AppText variant="caption" tone="secondary">
                {pluralize(albums.length, 'álbum', 'álbumes')} ·{' '}
                {pluralize(songs.length, 'canción', 'canciones')}
              </AppText>
            </View>
            <PlayAllBar songs={songs} sourceLabel={name} />

            <AppText variant="h2" style={styles.sectionTitle}>
              Álbumes
            </AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.albums}>
              {albums.map((album) => (
                <View key={album.id} style={styles.albumItem}>
                  <AlbumCard album={album} onPress={openAlbum} />
                </View>
              ))}
            </ScrollView>

            <AppText variant="h2" style={styles.sectionTitle}>
              Canciones
            </AppText>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.md,
  },
  center: { textAlign: 'center' },
  sectionTitle: {
    paddingHorizontal: sizes.screenPadding,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  albums: { paddingHorizontal: spacing.xs },
  albumItem: { width: 150 },
  list: { paddingBottom: spacing.lg },
});
