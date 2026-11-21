import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { memo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useReorderableDrag } from 'react-native-reorderable-list';

import { AppText } from '@/components/AppText';
import { Artwork } from '@/components/library/Artwork';
import type { Song } from '@/library/types';
import { radius, sizes, spacing, useTheme } from '@/theme';

interface DraggableSongRowProps {
  song: Song;
  position: number;
  onPress: (position: number) => void;
  onRemove: (position: number) => void;
  /** Texto de la acción de quitar para el lector de pantalla. */
  removeLabel?: string;
  /** Sin arrastre (por ejemplo, en Favoritos). */
  draggable?: boolean;
}

/**
 * Fila de canción que se arrastra desde ≡ para reordenar y se desliza hacia un lado para quitarla.
 * Se usa en la cola y en las listas de reproducción. Debe ir dentro de un ReorderableList.
 */
export const DraggableSongRow = memo(function DraggableSongRow({
  song,
  position,
  onPress,
  onRemove,
  removeLabel = 'Quitar',
  draggable = true,
}: DraggableSongRowProps) {
  const { colors } = useTheme();
  const drag = useReorderableDrag();
  const swipeRef = useRef<SwipeableMethods>(null);

  const removeAction = () => (
    <View style={[styles.removeAction, { backgroundColor: colors.error }]}>
      <MaterialIcons name="delete-outline" size={sizes.icon} color="#FFFFFF" />
      <AppText variant="caption" style={styles.removeText}>
        {removeLabel}
      </AppText>
    </View>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={1.5}
      rightThreshold={80}
      leftThreshold={80}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={removeAction}
      renderLeftActions={removeAction}
      onSwipeableOpen={() => {
        swipeRef.current?.reset();
        onRemove(position);
      }}>
      <Pressable
        onPress={() => onPress(position)}
        onLongPress={draggable ? drag : undefined}
        delayLongPress={250}
        android_ripple={{ color: colors.surfaceVariant }}
        accessibilityRole="button"
        accessibilityLabel={`${song.title}, ${song.artist}${draggable ? '. Mantén pulsado para mover.' : ''}`}
        accessibilityActions={[{ name: 'delete', label: removeLabel }]}
        onAccessibilityAction={(e) => e.nativeEvent.actionName === 'delete' && onRemove(position)}
        style={[styles.row, { backgroundColor: colors.background }]}>
        <Artwork uri={song.artworkPath} size={sizes.listArtwork} radius={radius.sm} />
        <View style={styles.text}>
          <AppText variant="body" numberOfLines={1}>
            {song.title}
          </AppText>
          <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
            {song.artist}
          </AppText>
        </View>
        {draggable ? (
          <Pressable
            onPressIn={drag}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Arrastrar para mover"
            style={styles.handle}>
            <MaterialIcons name="drag-handle" size={sizes.icon} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </Pressable>
    </ReanimatedSwipeable>
  );
});

const styles = StyleSheet.create({
  row: {
    height: sizes.songRowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: sizes.screenPadding,
  },
  text: { flex: 1, minWidth: 0 },
  handle: {
    width: sizes.minTouchTarget,
    height: sizes.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
  removeAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  removeText: { color: '#FFFFFF' },
});
