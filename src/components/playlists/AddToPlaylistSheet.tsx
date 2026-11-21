import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { NameDialog } from '@/components/NameDialog';
import { mosaicArtwork, resolveSongs, useSongsById } from '@/library/playlistSelectors';
import { pluralize } from '@/library/text';
import { usePlaylistPicker } from '@/store/playlistPicker';
import { usePlaylists } from '@/store/playlists';
import { showToast } from '@/store/toast';
import { radius, sizes, spacing, useTheme } from '@/theme';

import { PlaylistMosaic } from './PlaylistMosaic';

/** Hoja "Añadir a lista": elige una lista o crea una nueva (pantallas y flujos, 3.3). */
export function AddToPlaylistSheet() {
  const { colors } = useTheme();
  const songIds = usePlaylistPicker((s) => s.songIds);
  const close = usePlaylistPicker((s) => s.close);
  const playlists = usePlaylists((s) => s.playlists);
  const addSongs = usePlaylists((s) => s.addSongs);
  const create = usePlaylists((s) => s.create);
  const byId = useSongsById();
  const [naming, setNaming] = useState(false);
  const [pending, setPending] = useState<string[] | null>(null);

  const addTo = (id: number, name: string, ids: string[]) => {
    const added = addSongs(id, ids);
    if (added === 0) showToast(`Ya está en «${name}»`);
    else
      showToast(
        ids.length === 1
          ? `Añadida a «${name}»`
          : `${pluralize(added, 'canción añadida', 'canciones añadidas')} a «${name}»`,
        'success',
      );
  };

  return (
    <>
      <BottomSheet
        visible={!!songIds && !naming}
        onClose={close}
        header={
          <AppText variant="h2" style={styles.title}>
            Añadir a lista
          </AppText>
        }>
        <Pressable
          onPress={() => {
            setPending(songIds);
            setNaming(true);
          }}
          android_ripple={{ color: colors.surfaceVariant }}
          accessibilityRole="button"
          style={styles.row}>
          <View style={[styles.newIcon, { backgroundColor: colors.surfaceVariant }]}>
            <MaterialIcons name="add" size={28} color={colors.accent} />
          </View>
          <AppText variant="body" tone="accent">
            Nueva lista
          </AppText>
        </Pressable>
        <ScrollView style={styles.list}>
          {playlists.map((p) => {
            const songs = resolveSongs(p.songIds, byId);
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  if (songIds) addTo(p.id, p.name, songIds);
                  close();
                }}
                android_ripple={{ color: colors.surfaceVariant }}
                accessibilityRole="button"
                accessibilityLabel={`Añadir a ${p.name}`}
                style={styles.row}>
                <PlaylistMosaic artwork={mosaicArtwork(songs)} size={48} radius={radius.sm} />
                <View style={styles.flex}>
                  <AppText variant="body" numberOfLines={1}>
                    {p.name}
                  </AppText>
                  <AppText variant="bodySmall" tone="secondary">
                    {pluralize(songs.length, 'canción', 'canciones')}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </BottomSheet>

      <NameDialog
        visible={naming}
        title="Nueva lista"
        confirmLabel="Crear"
        onCancel={() => {
          setNaming(false);
          setPending(null);
          close();
        }}
        onConfirm={(name) => {
          const id = create(name);
          if (pending) addTo(id, name, pending);
          setNaming(false);
          setPending(null);
          close();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: { paddingHorizontal: sizes.screenPadding, marginBottom: spacing.xs },
  list: { maxHeight: 360 },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: sizes.screenPadding,
  },
  newIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1, minWidth: 0 },
});
