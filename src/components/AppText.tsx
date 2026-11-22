import { Text, type TextProps } from 'react-native';

import { typography, useTheme, type TypographyVariant } from '@/theme';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  /** `secondary` usa textSecondary; `accent` usa el color activo de marca. */
  tone?: 'primary' | 'secondary' | 'accent';
}

/** Texto con la tipografía y los colores de la guía de diseño. */
export function AppText({ variant = 'body', tone = 'primary', style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  const color =
    tone === 'secondary'
      ? colors.textSecondary
      : tone === 'accent'
        ? colors.accent
        : colors.textPrimary;
  // Respeta el tamaño de letra del sistema hasta 1,4×, para que las filas no se corten.
  return (
    <Text maxFontSizeMultiplier={1.4} style={[typography[variant], { color }, style]} {...rest} />
  );
}
