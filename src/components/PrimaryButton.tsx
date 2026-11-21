import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { radius, sizes, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  /** `filled`: fondo primary. `tonal`: fondo surfaceVariant con texto accent. */
  variant?: 'filled' | 'tonal';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'filled',
  disabled,
  style,
}: PrimaryButtonProps) {
  const { colors } = useTheme();
  const filled = variant === 'filled';
  const fg = filled ? colors.onPrimary : colors.accent;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: filled
            ? pressed
              ? colors.primaryDark
              : colors.primary
            : colors.surfaceVariant,
          opacity: disabled ? 0.5 : pressed && !filled ? 0.7 : 1,
        },
        style,
      ]}>
      {icon ? <MaterialIcons name={icon} size={20} color={fg} /> : null}
      <AppText variant="body" style={[styles.label, { color: fg }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: sizes.minTouchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.round,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  label: { fontFamily: 'Inter_500Medium' },
});
