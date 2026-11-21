import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { AlbumCard } from '@/components/library/AlbumCard';
import { ArtistRow } from '@/components/library/ArtistRow';
import { SongRow } from '@/components/library/SongRow';
import { Screen } from '@/components/Screen';
import { buildSearchIndex, search } from '@/library/search';
import { useAlbums, useArtists } from '@/library/selectors';
import { pluralize } from '@/library/text';
import type { Album, Artist, Song } from '@/library/types';
import { playSongs } from '@/player/player';
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from '@/storage/recentSearches';
import { useLibrary } from '@/store/library';
import { radius, sizes, spacing, typography, useTheme } from '@/theme';

const SONGS_PREVIEW = 20;
const ARTISTS_PREVIEW = 5;

type Row =
  | { type: 'header'; key: string; title: string; count: number; expandable?: 'songs' | 'artists' }
  | { type: 'song'; key: string; song: Song }
  | { type: 'artist'; key: string; artist: Artist }
  | { type: 'albums'; key: string; albums: Album[] };

/**
 * Pestaña Buscar (pantallas y flujos, 3.2): resultados en vivo agrupados en
 * Canciones, Artistas y Álbumes, y búsquedas recientes cuando no hay texto.
 */
export default function BuscarScreen() {
  const { colors } = useTheme();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [recent, setRecent] = useState<string[]>(getRecentSearches);
  const [expanded, setExpanded] = useState<{ songs: boolean; artists: boolean }>({
    songs: false,
    artists: false,
  });

  const songs = useLibrary((s) => s.songs);
  const artists = useArtists();
  const albums = useAlbums();
  const index = useMemo(() => buildSearchIndex(songs, artists, albums), [songs, artists, albums]);
  const results = useMemo(() => search(index, deferredQuery), [index, deferredQuery]);

  // El teclado se abre al entrar en la pestaña.
  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }, []),
  );

  const remember = useCallback(() => setRecent(addRecentSearch(query)), [query]);

  const onChangeText = (text: string) => {
    setQuery(text);
    setExpanded({ songs: false, artists: false });
  };

  const onSongPress = useCallback(
    (song: Song) => {
      remember();
      const i = results.songs.findIndex((s) => s.id === song.id);
      playSongs(results.songs, Math.max(0, i), `Búsqueda: «${query.trim()}»`);
    },
    [remember, results.songs, query],
  );
  const onArtistPress = useCallback(
    (artist: Artist) => {
      remember();
      Keyboard.dismiss();
      router.navigate({ pathname: '/artista/[name]', params: { name: artist.name } });
    },
    [remember],
  );
  const onAlbumPress = useCallback(
    (album: Album) => {
      remember();
      Keyboard.dismiss();
      router.navigate({ pathname: '/album/[id]', params: { id: album.id } });
    },
    [remember],
  );

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    if (results.songs.length > 0) {
      const shown = expanded.songs ? results.songs : results.songs.slice(0, SONGS_PREVIEW);
      out.push({
        type: 'header',
        key: 'h-songs',
        title: 'Canciones',
        count: results.songs.length,
        expandable: results.songs.length > SONGS_PREVIEW && !expanded.songs ? 'songs' : undefined,
      });
      shown.forEach((song) => out.push({ type: 'song', key: `s-${song.id}`, song }));
    }
    if (results.artists.length > 0) {
      const shown = expanded.artists ? results.artists : results.artists.slice(0, ARTISTS_PREVIEW);
      out.push({
        type: 'header',
        key: 'h-artists',
        title: 'Artistas',
        count: results.artists.length,
        expandable:
          results.artists.length > ARTISTS_PREVIEW && !expanded.artists ? 'artists' : undefined,
      });
      shown.forEach((artist) => out.push({ type: 'artist', key: `a-${artist.id}`, artist }));
    }
    if (results.albums.length > 0) {
      out.push({ type: 'header', key: 'h-albums', title: 'Álbumes', count: results.albums.length });
      out.push({ type: 'albums', key: 'albums', albums: results.albums });
    }
    return out;
  }, [results, expanded]);

  const renderItem = useCallback(
    ({ item }: { item: Row }) => {
      switch (item.type) {
        case 'header':
          return (
            <View style={styles.sectionHeader}>
              <AppText variant="h2" style={styles.flex}>
                {item.title}{' '}
                <AppText variant="caption" tone="secondary">
                  ({item.count})
                </AppText>
              </AppText>
              {item.expandable ? (
                <Pressable
                  onPress={() =>
                    setExpanded((e) => ({ ...e, [item.expandable as 'songs' | 'artists']: true }))
                  }
                  hitSlop={8}
                  accessibilityRole="button">
                  <AppText variant="bodySmall" tone="accent">
                    Ver todos
                  </AppText>
                </Pressable>
              ) : null}
            </View>
          );
        case 'song':
          return <SongRow song={item.song} onPress={onSongPress} />;
        case 'artist':
          return <ArtistRow artist={item.artist} onPress={onArtistPress} />;
        case 'albums':
          return (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.albums}>
              {item.albums.map((album) => (
                <View key={album.id} style={styles.albumItem}>
                  <AlbumCard album={album} onPress={onAlbumPress} />
                </View>
              ))}
            </ScrollView>
          );
      }
    },
    [onSongPress, onArtistPress, onAlbumPress],
  );

  const trimmed = deferredQuery.trim();

  return (
    <Screen title="Buscar" fullWidth>
      <View style={[styles.search, { backgroundColor: colors.surfaceVariant }]}>
        <MaterialIcons name="search" size={sizes.icon} color={colors.textSecondary} />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={onChangeText}
          onSubmitEditing={remember}
          placeholder="Canciones, artistas o álbumes"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          autoCorrect={false}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          accessibilityLabel="Buscar canciones, artistas o álbumes"
          style={[typography.body, styles.input, { color: colors.textPrimary }]}
        />
        {query ? (
          <IconButton
            icon="close"
            label="Borrar búsqueda"
            onPress={() => {
              onChangeText('');
              inputRef.current?.focus();
            }}
            size={20}
          />
        ) : null}
      </View>

      {!trimmed ? (
        <RecentSearches
          recent={recent}
          onSelect={(q) => {
            onChangeText(q);
            setRecent(addRecentSearch(q));
          }}
          onRemove={(q) => setRecent(removeRecentSearch(q))}
          onClear={() => setRecent(clearRecentSearches())}
        />
      ) : results.total === 0 ? (
        <EmptyState
          icon="search-off"
          title={`Nada coincide con «${trimmed}»`}
          message="Prueba con otra palabra o revisa cómo está escrita."
        />
      ) : (
        <FlashList
          data={rows}
          keyExtractor={(r) => r.key}
          getItemType={(r) => r.type}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.list}
        />
      )}
    </Screen>
  );
}

function RecentSearches({
  recent,
  onSelect,
  onRemove,
  onClear,
}: {
  recent: string[];
  onSelect: (q: string) => void;
  onRemove: (q: string) => void;
  onClear: () => void;
}) {
  const { colors } = useTheme();
  const total = useLibrary((s) => s.songs.length);

  if (recent.length === 0) {
    return (
      <View style={styles.hintBox}>
        <AppText variant="bodySmall" tone="secondary" style={styles.center}>
          Busca entre tus {pluralize(total, 'canción', 'canciones')} por título, artista o álbum.
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}>
      <View style={styles.sectionHeader}>
        <AppText variant="h2" style={styles.flex}>
          Búsquedas recientes
        </AppText>
        <Pressable onPress={onClear} hitSlop={8} accessibilityRole="button">
          <AppText variant="bodySmall" tone="accent">
            Borrar
          </AppText>
        </Pressable>
      </View>
      {recent.map((q) => (
        <Pressable
          key={q}
          onPress={() => onSelect(q)}
          android_ripple={{ color: colors.surfaceVariant }}
          accessibilityRole="button"
          accessibilityLabel={`Buscar ${q}`}
          style={styles.recentRow}>
          <MaterialIcons name="history" size={sizes.icon} color={colors.textSecondary} />
          <AppText variant="body" numberOfLines={1} style={styles.flex}>
            {q}
          </AppText>
          <IconButton
            icon="close"
            label={`Quitar ${q} de recientes`}
            onPress={() => onRemove(q)}
            size={20}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: sizes.screenPadding,
    marginBottom: spacing.sm,
    paddingLeft: spacing.sm,
    borderRadius: radius.round,
    minHeight: sizes.minTouchTarget,
  },
  input: { flex: 1, paddingVertical: spacing.xs },
  list: { paddingBottom: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  albums: { paddingHorizontal: spacing.xs },
  albumItem: { width: 150 },
  recentRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: sizes.screenPadding,
    paddingRight: spacing.xs,
  },
  hintBox: { padding: spacing.xl },
});
