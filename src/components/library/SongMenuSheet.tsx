import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { BottomSheet, SheetOption } from '@/components/BottomSheet';
import { addToQueue, playNext } from '@/player/player';
import { openPlaylistPicker } from '@/store/playlistPicker';
import { usePlaylists } from '@/store/playlists';
import { useSongMenu } from '@/store/songMenu';
import { radius, sizes, spacing, useTheme } from '@/theme';

import { Artwork } from './Artwork';

/**
 * Menú ⋮ de una canción (pantallas y flujos, 3.3), reutilizable desde cualquier lista
 * y desde el reproductor.
 */
export function SongMenuSheet() {
  const { colors } = useTheme();
  const song = useSongMenu((s) => s.song);
  const close = useSongMenu((s) => s.close);
  const context = useSongMenu((s) => s.context);
  const isFavorite = usePlaylists((s) => (song ? s.favoriteSet.has(song.id) : false));
  const toggleFavorite = usePlaylists((s) => s.toggleFavorite);
  const removeSong = usePlaylists((s) => s.removeSong);

  const run = (action: () => void) => {
    close();
    action();
  };

  return (
    <BottomSheet
      visible={!!song}
      onClose={close}
      header={
        song ? (
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Artwork uri={song.artworkPath} size={sizes.listArtwork} radius={radius.sm} />
            <View style={styles.headerText}>
              <AppText variant="body" numberOfLines={1}>
                {song.title}
              </AppText>
              <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
                {song.artist} · {song.album}
              </AppText>
            </View>
          </View>
        ) : null
      }>
      {song ? (
        <>
          <SheetOption
            icon="playlist-play"
            label="Reproducir a continuación"
            onPress={() => run(() => playNext(song))}
          />
          <SheetOption
            icon="playlist-add"
            label="Añadir a la cola"
            onPress={() => run(() => addToQueue(song))}
          />
          <SheetOption
            icon={isFavorite ? 'favorite' : 'favorite-border'}
            label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            onPress={() => run(() => toggleFavorite(song))}
          />
          <SheetOption
            icon="library-add"
            label="Añadir a lista…"
            onPress={() => run(() => openPlaylistPicker([song.id]))}
          />
          {context.playlistId !== undefined ? (
            <SheetOption
              icon="remove-circle-outline"
              label="Quitar de la lista"
              onPress={() => run(() => removeSong(context.playlistId!, song.id))}
            />
          ) : null}
          <SheetOption
            icon="album"
            label="Ir al álbum"
            onPress={() =>
              run(() => router.navigate({ pathname: '/album/[id]', params: { id: song.albumId } }))
            }
          />
          <SheetOption
            icon="person"
            label="Ir al artista"
            onPress={() =>
              run(() =>
                router.navigate({ pathname: '/artista/[name]', params: { name: song.artist } }),
              )
            }
          />
        </>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xxs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: { flex: 1, minWidth: 0 },
});
