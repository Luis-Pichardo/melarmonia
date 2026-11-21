import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ReorderableList, {
  reorderItems,
  type ReorderableListReorderEvent,
} from 'react-native-reorderable-list';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { BottomSheet, SheetOption } from '@/components/BottomSheet';
import { DetailHeader } from '@/components/DetailHeader';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { DraggableSongRow } from '@/components/library/DraggableSongRow';
import { NameDialog } from '@/components/NameDialog';
import { PlayAllBar } from '@/components/player/PlayAllBar';
import { PlaylistMosaic } from '@/components/playlists/PlaylistMosaic';
import { PrimaryButton } from '@/components/PrimaryButton';
import { mosaicArtwork, useResolvedPlaylist } from '@/library/playlistSelectors';
import { formatDuration, pluralize } from '@/library/text';
import type { Song } from '@/library/types';
import { playSongs } from '@/player/player';
import { usePlaylists } from '@/store/playlists';
import { radius, sizes, spacing, useTheme } from '@/theme';

/**
 * Detalle de una lista o de Favoritos (pantallas y flujos, 3.2): reproducir, aleatorio,
 * reordenar arrastrando, quitar deslizando, añadir canciones, renombrar y borrar.
 */
export default function ListaScreen() {
  const { colors } = useTheme();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { playlist, title, songs, isFavorites, exists } = useResolvedPlaylist(id);
  const removeSong = usePlaylists((s) => s.removeSong);
  const reorder = usePlaylists((s) => s.reorder);
  const toggleFavorite = usePlaylists((s) => s.toggleFavorite);
  const rename = usePlaylists((s) => s.rename);
  const removeList = usePlaylists((s) => s.remove);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);

  const artwork = useMemo(() => mosaicArtwork(songs), [songs]);
  const totalMs = useMemo(() => songs.reduce((sum, s) => sum + s.durationMs, 0), [songs]);

  const onPress = useCallback(
    (position: number) => playSongs(songs, position, title),
    [songs, title],
  );
  const onRemove = useCallback(
    (position: number) => {
      const song = songs[position];
      if (!song) return;
      if (isFavorites) toggleFavorite(song);
      else if (playlist) removeSong(playlist.id, song.id);
    },
    [songs, isFavorites, playlist, toggleFavorite, removeSong],
  );
  const onReorder = useCallback(
    ({ from, to }: ReorderableListReorderEvent) => {
      if (!playlist) return;
      reorder(
        playlist.id,
        reorderItems(songs, from, to).map((s) => s.id),
      );
    },
    [playlist, songs, reorder],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Song; index: number }) => (
      <DraggableSongRow
        song={item}
        position={index}
        onPress={onPress}
        onRemove={onRemove}
        removeLabel={isFavorites ? 'Quitar de favoritos' : 'Quitar de la lista'}
        draggable={!isFavorites}
      />
    ),
    [onPress, onRemove, isFavorites],
  );

  if (!exists) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <DetailHeader />
        <EmptyState
          icon="queue-music"
          title="Esta lista ya no existe"
          actionLabel="Volver"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const addSongs = () =>
    router.push({ pathname: '/listas/agregar/[id]', params: { id: String(playlist?.id) } });

  const confirmDelete = () => {
    if (!playlist) return;
    Alert.alert(
      '¿Borrar esta lista?',
      `Se borrará «${playlist.name}». Tus canciones seguirán en el teléfono.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => {
            removeList(playlist.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <DetailHeader />
        <View style={styles.flex} />
        {!isFavorites ? (
          <IconButton
            icon="more-vert"
            label="Opciones de la lista"
            onPress={() => setMenuOpen(true)}
          />
        ) : null}
      </View>

      <ReorderableList
        data={songs}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        onReorder={onReorder}
        dragEnabled={!isFavorites}
        ListHeaderComponent={
          <View style={styles.header}>
            <PlaylistMosaic
              artwork={artwork}
              size={180}
              radius={radius.md}
              favorites={isFavorites}
            />
            <AppText variant="h1" style={styles.center} numberOfLines={2}>
              {title}
            </AppText>
            <AppText variant="caption" tone="secondary">
              {pluralize(songs.length, 'canción', 'canciones')}
              {songs.length > 0 ? ` · ${formatDuration(totalMs)}` : ''}
            </AppText>
            <View style={styles.actions}>
              <PlayAllBar songs={songs} sourceLabel={title} />
              {!isFavorites ? (
                <PrimaryButton
                  label="Añadir canciones"
                  icon="add"
                  variant="tonal"
                  onPress={addSongs}
                  style={styles.addButton}
                />
              ) : null}
            </View>
            {songs.length > 1 ? (
              <AppText variant="caption" tone="secondary" style={styles.hint}>
                {isFavorites
                  ? 'Desliza una canción para quitarla de favoritos'
                  : 'Mantén pulsado para mover · desliza para quitar'}
              </AppText>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={isFavorites ? 'favorite-border' : 'queue-music'}
            title={isFavorites ? 'Aún no tienes favoritos' : 'Esta lista está vacía'}
            message={
              isFavorites ? 'Toca ❤ en el reproductor o en el menú ⋮ de una canción.' : undefined
            }
            actionLabel={isFavorites ? undefined : 'Añadir canciones'}
            onAction={isFavorites ? undefined : addSongs}
          />
        }
        contentContainerStyle={styles.list}
      />

      <BottomSheet visible={menuOpen} onClose={() => setMenuOpen(false)}>
        <SheetOption
          icon="add"
          label="Añadir canciones"
          onPress={() => {
            setMenuOpen(false);
            addSongs();
          }}
        />
        <SheetOption
          icon="edit"
          label="Renombrar"
          onPress={() => {
            setMenuOpen(false);
            setRenaming(true);
          }}
        />
        <SheetOption
          icon="delete-outline"
          label="Borrar lista"
          onPress={() => {
            setMenuOpen(false);
            confirmDelete();
          }}
        />
      </BottomSheet>

      <NameDialog
        visible={renaming}
        title="Renombrar lista"
        confirmLabel="Guardar"
        initialValue={playlist?.name}
        onCancel={() => setRenaming(false)}
        onConfirm={(name) => {
          if (playlist) rename(playlist.id, name);
          setRenaming(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingRight: spacing.xs },
  header: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.xs,
  },
  center: { textAlign: 'center', marginTop: spacing.sm },
  actions: { alignSelf: 'stretch', marginTop: spacing.md, marginHorizontal: -sizes.screenPadding },
  addButton: { marginHorizontal: sizes.screenPadding },
  hint: { marginTop: spacing.sm },
  list: { paddingBottom: spacing.lg },
});
