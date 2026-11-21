import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { sizes, spacing } from '@/theme';

import { IconButton } from './IconButton';

/** Barra superior de las pantallas de detalle: botón de volver. */
export function DetailHeader() {
  return (
    <View style={styles.bar}>
      <IconButton
        icon="arrow-back"
        label="Volver"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.screenPadding - spacing.sm,
    paddingVertical: spacing.xxs,
  },
});
