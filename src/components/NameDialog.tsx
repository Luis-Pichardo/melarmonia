import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { radius, sizes, spacing, typography, useTheme } from '@/theme';

import { AppText } from './AppText';

interface NameDialogProps {
  visible: boolean;
  title: string;
  confirmLabel: string;
  initialValue?: string;
  placeholder?: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

const MAX_LENGTH = 60;

/** Diálogo para escribir un nombre (crear o renombrar una lista). */
export function NameDialog({
  visible,
  title,
  confirmLabel,
  initialValue = '',
  placeholder = 'Nombre de la lista',
  onConfirm,
  onCancel,
}: NameDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      {visible ? (
        <DialogBody
          title={title}
          confirmLabel={confirmLabel}
          initialValue={initialValue}
          placeholder={placeholder}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      ) : null}
    </Modal>
  );
}

/** El contenido se monta al abrir, así el texto empieza siempre en `initialValue`. */
function DialogBody({
  title,
  confirmLabel,
  initialValue,
  placeholder,
  onConfirm,
  onCancel,
}: Omit<NameDialogProps, 'visible'> & { initialValue: string; placeholder: string }) {
  const { colors } = useTheme();
  const [value, setValue] = useState(initialValue);
  const trimmed = value.trim();
  const confirm = () => trimmed && onConfirm(trimmed);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Cancelar" />
      <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
        <AppText variant="h2">{title}</AppText>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          autoFocus
          maxLength={MAX_LENGTH}
          returnKeyType="done"
          onSubmitEditing={confirm}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          accessibilityLabel={placeholder}
          style={[
            typography.body,
            styles.input,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.accent,
            },
          ]}
        />
        <View style={styles.actions}>
          <Pressable
            onPress={onCancel}
            hitSlop={8}
            accessibilityRole="button"
            style={styles.action}>
            <AppText variant="body" tone="secondary">
              Cancelar
            </AppText>
          </Pressable>
          <Pressable
            onPress={confirm}
            disabled={!trimmed}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ disabled: !trimmed }}
            style={[styles.action, !trimmed && styles.disabled]}>
            <AppText variant="body" tone="accent" style={styles.bold}>
              {confirmLabel}
            </AppText>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialog: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  input: {
    minHeight: sizes.minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.lg },
  action: { minHeight: 40, justifyContent: 'center' },
  disabled: { opacity: 0.4 },
  bold: { fontFamily: 'Inter_500Medium' },
});
