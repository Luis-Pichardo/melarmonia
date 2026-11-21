import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TOAST_DURATION_MS, useToast } from '@/store/toast';
import { radius, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

/** Aviso breve encima del menú inferior. Se monta una vez en la raíz de la app. */
export function Toast() {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const message = useToast((s) => s.message);
  const tone = useToast((s) => s.tone);
  const key = useToast((s) => s.key);
  const hide = useToast((s) => s.hide);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [message, key, hide]);

  if (!message) return null;

  const accent =
    tone === 'error' ? colors.error : tone === 'success' ? colors.success : colors.accent;

  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: insets.bottom + 140 }]}>
      <Animated.View
        key={key}
        entering={FadeInDown.duration(200)}
        exiting={FadeOutDown.duration(200)}
        accessibilityLiveRegion="polite"
        style={[
          styles.toast,
          {
            backgroundColor: mode === 'dark' ? colors.surfaceVariant : colors.textPrimary,
            borderLeftColor: accent,
          },
        ]}>
        <AppText
          variant="bodySmall"
          style={{ color: mode === 'dark' ? colors.textPrimary : colors.background }}>
          {message}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.md, right: spacing.md, alignItems: 'center' },
  toast: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    maxWidth: 480,
  },
});
