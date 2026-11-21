import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { AlbumCard } from '@/components/library/AlbumCard';
import { AlphabetIndex } from '@/components/library/AlphabetIndex';
import { ArtistRow } from '@/components/library/ArtistRow';
import { LibraryTabs, type LibrarySection } from '@/components/library/LibraryTabs';
import { ScanProgressBar } from '@/components/library/ScanProgressBar';
import { SongRow } from '@/components/library/SongRow';
import { SortSheet } from '@/components/library/SortSheet';
import { Screen } from '@/components/Screen';
import { buildLetterIndex, useAlbums, useArtists, useSortedSongs } from '@/library/selectors';
import { pluralize } from '@/library/text';
import type { Album, Artist, Song } from '@/library/types';
import { useLibrary } from '@/store/library';
import { sizes, spacing, useTheme } from '@/theme';

export default function BibliotecaScreen() {
  const [section, setSection] = useState<LibrarySection>('songs');
  const [sortOpen, setSortOpen] = useState(false);
  const sort = useLibrary((s) => s.sort);
  const setSort = useLibrary((s) => s.setSort);

  return (
    <Screen
      title="Biblioteca"
      fullWidth
      headerRight={
        section === 'songs' ? (
          <IconButton icon="sort" label="Ordenar canciones" onPress={() => setSortOpen(true)} />
        ) : null
      }>
      <LibraryTabs value={section} onChange={setSection} />
      <ScanProgressBar />
      <LibraryContent section={section} />
      <SortSheet
        visible={sortOpen}
        value={sort}
        onSelect={setSort}
        onClose={() => setSortOpen(false)}
      />
    </Screen>
  );
}

function LibraryContent({ section }: { section: LibrarySection }) {
  const { colors } = useTheme();
  const status = useLibrary((s) => s.status);
  const total = useLibrary((s) => s.songs.length);
  const rescan = useLibrary((s) => s.rescan);

  if (total === 0) {
    if (status === 'idle' || status === 'loading' || status === 'scanning') {
      return (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
          <AppText variant="bodySmall" tone="secondary">
            Buscando tu música…
          </AppText>
        </View>
      );
    }
    return (
      <EmptyState
        icon="library-music"
        title={
          status === 'error' ? 'No se pudo leer tu música' : 'No encontramos música en tu teléfono'
        }
        message="Descarga canciones en tu teléfono y vuelve a buscar."
        actionLabel="Buscar de nuevo"
        onAction={() => rescan({ userInitiated: true })}
      />
    );
  }

  switch (section) {
    case 'songs':
      return <SongsList />;
    case 'artists':
      return <ArtistsList />;
    case 'albums':
      return <AlbumsGrid />;
  }
}

function useRefresh() {
  const refreshing = useLibrary((s) => s.refreshing);
  const rescan = useLibrary((s) => s.rescan);
  const onRefresh = useCallback(() => rescan({ userInitiated: true }), [rescan]);
  return { refreshing, onRefresh };
}

function SongsList() {
  const songs = useSortedSongs();
  const sort = useLibrary((s) => s.sort);
  const listRef = useRef<FlashListRef<Song>>(null);
  const refresh = useRefresh();
  const letters = useMemo(
    () => (sort === 'title' ? buildLetterIndex(songs, (s) => s.title) : []),
    [songs, sort],
  );

  const renderItem = useCallback(({ item }: { item: Song }) => <SongRow song={item} />, []);

  return (
    <View style={styles.flex}>
      <FlashList
        ref={listRef}
        data={songs}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <AppText variant="caption" tone="secondary" style={styles.count}>
            {pluralize(songs.length, 'canción', 'canciones')}
          </AppText>
        }
        contentContainerStyle={letters.length > 1 ? styles.listWithIndex : styles.listPadding}
        {...refresh}
      />
      <AlphabetIndex
        letters={letters}
        onSelect={(index) => listRef.current?.scrollToIndex({ index, animated: false })}
      />
    </View>
  );
}

function ArtistsList() {
  const artists = useArtists();
  const listRef = useRef<FlashListRef<Artist>>(null);
  const refresh = useRefresh();
  const letters = useMemo(() => buildLetterIndex(artists, (a) => a.name), [artists]);

  const onPress = useCallback(
    (artist: Artist) => router.push({ pathname: '/artista/[name]', params: { name: artist.name } }),
    [],
  );
  const renderItem = useCallback(
    ({ item }: { item: Artist }) => <ArtistRow artist={item} onPress={onPress} />,
    [onPress],
  );

  return (
    <View style={styles.flex}>
      <FlashList
        ref={listRef}
        data={artists}
        keyExtractor={(a) => a.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <AppText variant="caption" tone="secondary" style={styles.count}>
            {pluralize(artists.length, 'artista', 'artistas')}
          </AppText>
        }
        contentContainerStyle={letters.length > 1 ? styles.listWithIndex : styles.listPadding}
        {...refresh}
      />
      <AlphabetIndex
        letters={letters}
        onSelect={(index) => listRef.current?.scrollToIndex({ index, animated: false })}
      />
    </View>
  );
}

function AlbumsGrid() {
  const albums = useAlbums();
  const refresh = useRefresh();

  const onPress = useCallback(
    (album: Album) => router.push({ pathname: '/album/[id]', params: { id: album.id } }),
    [],
  );
  const renderItem = useCallback(
    ({ item }: { item: Album }) => <AlbumCard album={item} onPress={onPress} />,
    [onPress],
  );

  return (
    <FlashList
      data={albums}
      numColumns={2}
      keyExtractor={(a) => a.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <AppText variant="caption" tone="secondary" style={styles.countGrid}>
          {pluralize(albums.length, 'álbum', 'álbumes')}
        </AppText>
      }
      contentContainerStyle={styles.gridPadding}
      {...refresh}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  count: { paddingHorizontal: sizes.screenPadding, paddingBottom: spacing.xs },
  countGrid: { paddingHorizontal: spacing.xs, paddingBottom: spacing.xs },
  listPadding: { paddingBottom: spacing.lg },
  listWithIndex: { paddingBottom: spacing.lg, paddingRight: spacing.md },
  gridPadding: { paddingHorizontal: spacing.xs, paddingBottom: spacing.lg },
});
