import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { NameDialog } from '@/components/NameDialog';
import { PlaylistMosaic } from '@/components/playlists/PlaylistMosaic';
import { Screen } from '@/components/Screen';
import { mosaicArtwork, resolveSongs, useSongsById } from '@/library/playlistSelectors';
import { pluralize } from '@/library/text';
import { FAVORITES_ID, usePlaylists, type Playlist } from '@/store/playlists';
import { radius, sizes, spacing, useTheme } from '@/theme';

interface Row {
  key: string;
  routeId: string;
  name: string;
  count: number;
  artwork: (string | null)[];
  favorites?: boolean;
}

/** Pestaña Listas (pantallas y flujos, 3.2): Favoritos arriba y las listas del usuario. */
export default function ListasScreen() {
  const { colors } = useTheme();
  const favorites = usePlaylists((s) => s.favorites);
  const playlists = usePlaylists((s) => s.playlists);
  const create = usePlaylists((s) => s.create);
  const byId = useSongsById();
  const [naming, setNaming] = useState(false);

  const rows = useMemo<Row[]>(() => {
    const fav: Row = {
      key: FAVORITES_ID,
      routeId: FAVORITES_ID,
      name: 'Favoritos',
      count: resolveSongs(favorites, byId).length,
      artwork: [],
      favorites: true,
    };
    return [
      fav,
      ...playlists.map((p: Playlist) => {
        const songs = resolveSongs(p.songIds, byId);
        return {
          key: String(p.id),
          routeId: String(p.id),
          name: p.name,
          count: songs.length,
          artwork: mosaicArtwork(songs),
        };
      }),
    ];
  }, [favorites, playlists, byId]);

  const open = useCallback(
    (routeId: string) => router.push({ pathname: '/listas/[id]', params: { id: routeId } }),
    [],
  );

  return (
    <Screen title="Listas" fullWidth>
      <FlashList
        data={rows}
        keyExtractor={(r) => r.key}
        renderItem={({ item }) => <PlaylistRow row={item} onPress={open} />}
        ListHeaderComponent={
          <Pressable
            onPress={() => setNaming(true)}
            android_ripple={{ color: colors.surfaceVariant }}
            accessibilityRole="button"
            style={styles.row}>
            <View style={[styles.newIcon, { backgroundColor: colors.surfaceVariant }]}>
              <MaterialIcons name="add" size={32} color={colors.accent} />
            </View>
            <AppText variant="body" tone="accent" style={styles.bold}>
              Nueva lista
            </AppText>
          </Pressable>
        }
        ListFooterComponent={
          playlists.length === 0 ? (
            <AppText variant="bodySmall" tone="secondary" style={styles.hint}>
              Crea una lista y añade canciones desde aquí o desde el menú ⋮ de cualquier canción.
            </AppText>
          ) : null
        }
        contentContainerStyle={styles.list}
      />
      <NameDialog
        visible={naming}
        title="Nueva lista"
        confirmLabel="Crear"
        onCancel={() => setNaming(false)}
        onConfirm={(name) => {
          const id = create(name);
          setNaming(false);
          open(String(id));
        }}
      />
    </Screen>
  );
}

const PlaylistRow = memo(function PlaylistRow({
  row,
  onPress,
}: {
  row: Row;
  onPress: (routeId: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => onPress(row.routeId)}
      android_ripple={{ color: colors.surfaceVariant }}
      accessibilityRole="button"
      accessibilityLabel={`${row.name}, ${pluralize(row.count, 'canción', 'canciones')}`}
      style={styles.row}>
      <PlaylistMosaic
        artwork={row.artwork}
        size={64}
        radius={radius.sm}
        favorites={row.favorites}
      />
      <View style={styles.text}>
        <AppText variant="body" numberOfLines={1}>
          {row.name}
        </AppText>
        <AppText variant="bodySmall" tone="secondary">
          {pluralize(row.count, 'canción', 'canciones')}
        </AppText>
      </View>
      <MaterialIcons name="chevron-right" size={sizes.icon} color={colors.textSecondary} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.lg },
  row: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: sizes.screenPadding,
  },
  newIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bold: { fontFamily: 'Inter_500Medium' },
  text: { flex: 1, minWidth: 0 },
  hint: { paddingHorizontal: sizes.screenPadding, paddingTop: spacing.lg, textAlign: 'center' },
});
