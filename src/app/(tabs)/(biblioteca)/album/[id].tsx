import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DetailHeader } from '@/components/DetailHeader';
import { EmptyState } from '@/components/EmptyState';
import { Artwork } from '@/components/library/Artwork';
import { SongRow } from '@/components/library/SongRow';
import { PlayAllBar } from '@/components/player/PlayAllBar';
import { useAlbum } from '@/library/selectors';
import { formatDuration, pluralize } from '@/library/text';
import type { Song } from '@/library/types';
import { playSongs } from '@/player/player';
import { radius, sizes, spacing, useTheme } from '@/theme';

/** Detalle de álbum: carátula grande y canciones en orden (pantallas y flujos, 3.2). */
export default function AlbumScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { album, tracks } = useAlbum(id ?? '');

  const label = album?.title ?? '';
  const indexById = useMemo(() => new Map(tracks.map((s, i) => [s.id, i])), [tracks]);
  const onPress = useCallback(
    (song: Song) => playSongs(tracks, indexById.get(song.id) ?? 0, label),
    [tracks, indexById, label],
  );
  const renderItem = useCallback(
    ({ item }: { item: Song }) => <SongRow song={item} showTrackNumber onPress={onPress} />,
    [onPress],
  );

  if (!album) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <DetailHeader />
        <EmptyState
          icon="album"
          title="Este álbum ya no está en tu teléfono"
          actionLabel="Volver"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const totalMs = tracks.reduce((sum, t) => sum + t.durationMs, 0);
  const details = [
    album.year,
    pluralize(album.songCount, 'canción', 'canciones'),
    formatDuration(totalMs),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.root, { backgroundColor: colors.background }]}>
      <DetailHeader />
      <FlashList
        data={tracks}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Artwork uri={album.artworkPath} size={220} radius={radius.md} style={styles.artwork} />
            <AppText variant="h1" style={styles.center} numberOfLines={2}>
              {album.title}
            </AppText>
            <AppText
              variant="body"
              tone="accent"
              style={styles.center}
              onPress={() =>
                router.push({
                  pathname: '/artista/[name]',
                  params: { name: tracks[0]?.artist ?? album.artist },
                })
              }>
              {album.artist}
            </AppText>
            <AppText variant="caption" tone="secondary" style={styles.center}>
              {details}
            </AppText>
            <View style={styles.playAll}>
              <PlayAllBar songs={tracks} sourceLabel={album.title} />
            </View>
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
    gap: spacing.xxs,
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: spacing.xs,
  },
  artwork: { marginBottom: spacing.md },
  center: { textAlign: 'center' },
  playAll: { alignSelf: 'stretch', marginTop: spacing.md, marginHorizontal: -sizes.screenPadding },
  list: { paddingBottom: spacing.lg },
});
