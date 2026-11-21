import { StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { BottomSheet, SheetOption } from '@/components/BottomSheet';
import type { LibrarySort } from '@/storage/settings';
import { sizes, spacing } from '@/theme';

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

/** Hoja de opciones para el orden de las canciones. */
export function SortSheet({ visible, value, onSelect, onClose }: SortSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={
        <AppText variant="h2" style={styles.title}>
          Ordenar canciones por
        </AppText>
      }>
      {OPTIONS.map((option) => (
        <SheetOption
          key={option.value}
          label={option.label}
          radio
          selected={option.value === value}
          onPress={() => {
            onSelect(option.value);
            onClose();
          }}
        />
      ))}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { paddingHorizontal: sizes.screenPadding, marginBottom: spacing.xs },
});
