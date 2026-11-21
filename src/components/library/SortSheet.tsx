import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import type { LibrarySort } from '@/storage/settings';
import { radius, sizes, spacing, useTheme } from '@/theme';

const OPTIONS: { value: LibrarySort; label: string }[] = [
  { value: 'title', label: 'Nombre' },
  { value: 'artist', label: 'Artista' },
  { value: 'dateAdded', label: 'Añadidas recientemente' },
  { value: 'duration', label: 'Duración' },
];

interface SortSheetProps {
  visible: boolean;
  value: LibrarySort;
  onSelect: (value: LibrarySort) => void;
  onClose: () => void;
}

/** Hoja de opciones para el orden de las canciones (guía de diseño, 2.6). */
export function SortSheet({ visible, value, onSelect, onClose }: SortSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar" />
      <View
        style={[
          styles.sheet,
          { backgroundColor: colors.surface, paddingBottom: insets.bottom + spacing.md },
        ]}>
        <View style={[styles.handle, { backgroundColor: colors.divider }]} />
        <AppText variant="h2" style={styles.title}>
          Ordenar canciones por
        </AppText>
        {OPTIONS.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              android_ripple={{ color: colors.surfaceVariant }}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={styles.option}>
              <AppText variant="body" tone={selected ? 'accent' : 'primary'} style={styles.flex}>
                {option.label}
              </AppText>
              {selected ? (
                <MaterialIcons name="check" size={sizes.icon} color={colors.accent} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.xs,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radius.round,
    marginBottom: spacing.sm,
  },
  title: { paddingHorizontal: sizes.screenPadding, marginBottom: spacing.xs },
  option: {
    minHeight: sizes.minTouchTarget + spacing.xs,
    paddingHorizontal: sizes.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: { flex: 1 },
});
