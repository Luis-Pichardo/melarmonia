import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ReorderableList, { type ReorderableListReorderEvent } from 'react-native-reorderable-list';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { SongRow } from '@/components/library/SongRow';
import { QueueRow } from '@/components/player/QueueRow';
import { pluralize } from '@/library/text';
import type { Song } from '@/library/types';
import { clearUpcoming, moveInQueue, removeFromQueue, skipTo, usePlayer } from '@/player/player';
import { sizes, spacing, useTheme } from '@/theme';

interface UpcomingItem {
  key: string;
  song: Song;
  /** Posición en la cola completa. */
  position: number;
}

/**
 * Cola de reproducción (pantallas y flujos, 3.2): "Reproduciendo ahora" y "A continuación".
 * Se reordena arrastrando y se quitan canciones deslizándolas hacia un lado.
 */
export default function ColaScreen() {
  const { colors } = useTheme();
  const queue = usePlayer((s) => s.queue);
  const keys = usePlayer((s) => s.keys);
  const index = usePlayer((s) => s.index);
  const current = usePlayer((s) => s.current);
  const sourceLabel = usePlayer((s) => s.sourceLabel);

  const upcoming = useMemo<UpcomingItem[]>(
    () =>
      queue
        .slice(index + 1)
        .map((song, i) => ({ key: keys[index + 1 + i], song, position: index + 1 + i })),
    [queue, keys, index],
  );

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const onReorder = useCallback(
    ({ from, to }: ReorderableListReorderEvent) => moveInQueue(index + 1 + from, index + 1 + to),
    [index],
  );

  const renderItem = useCallback(
    ({ item }: { item: UpcomingItem }) => (
      <QueueRow
        song={item.song}
        position={item.position}
        onPress={skipTo}
        onRemove={removeFromQueue}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <IconButton icon="keyboard-arrow-down" label="Cerrar cola" onPress={close} size={32} />
        <AppText variant="h1" style={styles.title}>
          Cola
        </AppText>
      </View>

      {current ? (
        <ReorderableList
          data={upcoming}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          onReorder={onReorder}
          ListHeaderComponent={
            <View>
              <AppText variant="caption" tone="secondary" style={styles.section}>
                REPRODUCIENDO AHORA{sourceLabel ? ` · ${sourceLabel}` : ''}
              </AppText>
              <SongRow song={current} />
              <View style={styles.upcomingHeader}>
                <AppText variant="h2" style={styles.flex}>
                  A continuación
                </AppText>
                {upcoming.length > 0 ? (
                  <Pressable
                    onPress={clearUpcoming}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Vaciar la cola">
                    <AppText variant="bodySmall" tone="accent">
                      Vaciar
                    </AppText>
                  </Pressable>
                ) : null}
              </View>
              <AppText variant="caption" tone="secondary" style={styles.hint}>
                {upcoming.length > 0
                  ? `${pluralize(upcoming.length, 'canción', 'canciones')} · Mantén pulsado para mover, desliza para quitar`
                  : 'No hay más canciones en la cola'}
              </AppText>
            </View>
          }
          contentContainerStyle={styles.list}
        />
      ) : (
        <EmptyState
          icon="queue-music"
          title="La cola está vacía"
          message="Reproduce una canción para empezar."
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: sizes.screenPadding - spacing.sm,
    paddingVertical: spacing.xxs,
  },
  title: { flex: 1 },
  section: {
    paddingHorizontal: sizes.screenPadding,
    paddingTop: spacing.xs,
    letterSpacing: 0.5,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.screenPadding,
    marginTop: spacing.lg,
  },
  hint: { paddingHorizontal: sizes.screenPadding, paddingBottom: spacing.xs },
  list: { paddingBottom: spacing.xl },
});
