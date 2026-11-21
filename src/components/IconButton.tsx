import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { radius, sizes, useTheme } from '@/theme';

interface IconButtonProps {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  onPress: () => void;
  active?: boolean;
  size?: number;
}

/** Botón de icono con área táctil de 48 (guía de diseño, 2.4 y 2.5). */
export function IconButton({ icon, label, onPress, active, size = sizes.icon }: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: colors.surfaceVariant, borderless: true, radius: 24 }}
      style={styles.button}>
      <MaterialIcons
        name={icon}
        size={size}
        color={active ? colors.accent : colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: sizes.minTouchTarget,
    height: sizes.minTouchTarget,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
