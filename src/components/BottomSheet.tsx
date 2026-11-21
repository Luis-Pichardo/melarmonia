import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps, ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, sizes, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Cabecera opcional (título o resumen de la canción). */
  header?: ReactNode;
  children: ReactNode;
}

/** Hoja que sube desde abajo, con bordes de 16 (guía de diseño, 2.6). */
export function BottomSheet({ visible, onClose, header, children }: BottomSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar" />
      <View
        style={[
          styles.sheet,
          { backgroundColor: colors.surface, paddingBottom: insets.bottom + spacing.sm },
        ]}>
        <View style={[styles.handle, { backgroundColor: colors.divider }]} />
        {header}
        {children}
      </View>
    </Modal>
  );
}

interface SheetOptionProps {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  selected?: boolean;
  /** Para opciones de selección única (orden). */
  radio?: boolean;
}

/** Opción de una hoja: icono, texto y marca de selección. */
export function SheetOption({ label, onPress, icon, selected, radio }: SheetOptionProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.surfaceVariant }}
      accessibilityRole={radio ? 'radio' : 'button'}
      accessibilityState={radio ? { selected } : undefined}
      style={styles.option}>
      {icon ? <MaterialIcons name={icon} size={sizes.icon} color={colors.textSecondary} /> : null}
      <AppText variant="body" tone={selected ? 'accent' : 'primary'} style={styles.flex}>
        {label}
      </AppText>
      {selected ? <MaterialIcons name="check" size={sizes.icon} color={colors.accent} /> : null}
    </Pressable>
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
  option: {
    minHeight: sizes.minTouchTarget + spacing.xs,
    paddingHorizontal: sizes.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flex: { flex: 1 },
});
