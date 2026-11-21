import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { Artwork } from '@/components/library/Artwork';
import { PrimaryButton } from '@/components/PrimaryButton';
import { sortSongs } from '@/library/selectors';
import { pluralize, stripAccents } from '@/library/text';
import type { Song } from '@/library/types';
import { useLibrary } from '@/store/library';
import { usePlaylists } from '@/store/playlists';
import { showToast } from '@/store/toast';
import { radius, sizes, spacing, typography, useTheme } from '@/theme';

const normalize = (text: string) => stripAccents(text).toLowerCase();

/** Añadir canciones a una lista con selección múltiple (pantallas y flujos, 3.3). */
export default function AgregarCancionesScreen() {
  const { colors } = useTheme();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const playlist = usePlaylists((s) => s.playlists.find((p) => String(p.id) === id));
  const addSongs = usePlaylists((s) => s.addSongs);
  const allSongs = useLibrary((s) => s.songs);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const already = useMemo(() => new Set(playlist?.songIds ?? []), [playlist]);
  const sorted = useMemo(() => sortSongs(allSongs, 'title'), [allSongs]);
  const visible = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return sorted;
    return sorted.filter((s) => normalize(`${s.title} ${s.artist} ${s.album}`).includes(q));
  }, [sorted, query]);

  const toggle = useCallback((song: Song) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(song.id)) next.delete(song.id);
      else next.add(song.id);
      return next;
    });
  }, []);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/listas'));

  const done = () => {
    if (!playlist || selected.size === 0) return close();
    // Se añaden en el orden alfabético en que aparecen.
    const ids = sorted.filter((s) => selected.has(s.id)).map((s) => s.id);
    const added = addSongs(playlist.id, ids);
    showToast(
      `${pluralize(added, 'canción añadida', 'canciones añadidas')} a «${playlist.name}»`,
      'success',
    );
    close();
  };

  const renderItem = useCallback(
    ({ item }: { item: Song }) => (
      <SelectableRow
        song={item}
        checked={selected.has(item.id)}
        disabled={already.has(item.id)}
        onToggle={toggle}
      />
    ),
    [selected, already, toggle],
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <IconButton icon="close" label="Cancelar" onPress={close} />
        <AppText variant="h2" numberOfLines={1} style={styles.title}>
          Añadir a «{playlist?.name ?? ''}»
        </AppText>
      </View>

      <View style={[styles.search, { backgroundColor: colors.surfaceVariant }]}>
        <MaterialIcons name="search" size={sizes.icon} color={colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar canciones"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          accessibilityLabel="Buscar canciones"
          style={[typography.body, styles.input, { color: colors.textPrimary }]}
        />
        {query ? (
          <IconButton icon="close" label="Borrar búsqueda" onPress={() => setQuery('')} size={20} />
        ) : null}
      </View>

      <FlashList
        data={visible}
        extraData={selected}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
      />

      <View
        style={[
          styles.bottom,
          { borderTopColor: colors.divider, backgroundColor: colors.surface },
        ]}>
        <PrimaryButton
          label={
            selected.size > 0
              ? `Añadir ${pluralize(selected.size, 'canción', 'canciones')}`
              : 'Listo'
          }
          icon={selected.size > 0 ? 'add' : 'check'}
          onPress={done}
        />
      </View>
    </SafeAreaView>
  );
}

const SelectableRow = memo(function SelectableRow({
  song,
  checked,
  disabled,
  onToggle,
}: {
  song: Song;
  checked: boolean;
  disabled: boolean;
  onToggle: (song: Song) => void;
}) {
  const { colors } = useTheme();
  const on = checked || disabled;
  return (
    <Pressable
      onPress={() => !disabled && onToggle(song)}
      android_ripple={disabled ? undefined : { color: colors.surfaceVariant }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on, disabled }}
      accessibilityLabel={`${song.title}, ${song.artist}${disabled ? ', ya está en la lista' : ''}`}
      style={[styles.row, disabled && styles.disabled]}>
      <Artwork uri={song.artworkPath} size={sizes.listArtwork} radius={radius.sm} />
      <View style={styles.text}>
        <AppText variant="body" numberOfLines={1}>
          {song.title}
        </AppText>
        <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
          {disabled ? 'Ya está en la lista' : song.artist}
        </AppText>
      </View>
      <MaterialIcons
        name={on ? 'check-circle' : 'radio-button-unchecked'}
        size={sizes.icon}
        color={on ? colors.accent : colors.textSecondary}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: sizes.screenPadding - spacing.sm,
    paddingVertical: spacing.xxs,
  },
  title: { flex: 1 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: sizes.screenPadding,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
    borderRadius: radius.round,
    minHeight: sizes.minTouchTarget,
  },
  input: { flex: 1, paddingVertical: spacing.xs },
  list: { paddingBottom: spacing.md },
  row: {
    height: sizes.songRowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: sizes.screenPadding,
  },
  disabled: { opacity: 0.55 },
  text: { flex: 1, minWidth: 0 },
  bottom: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
