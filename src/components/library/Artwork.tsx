import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

interface ArtworkProps {
  uri: string | null;
  size: number | '100%';
  radius: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Carátula de una canción o álbum.
 * Sin carátula: fondo surfaceVariant con una nota en accent (guía de diseño, 3.4).
 */
export function Artwork({ uri, size, radius, style }: ArtworkProps) {
  const { colors } = useTheme();
  const box =
    size === '100%' ? { width: '100%' as const, aspectRatio: 1 } : { width: size, height: size };
  const iconSize = typeof size === 'number' ? Math.round(size * 0.45) : 48;

  return (
    <View
      style={[
        styles.root,
        box,
        { borderRadius: radius, backgroundColor: colors.surfaceVariant },
        style,
      ]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          recyclingKey={uri}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <MaterialIcons name="music-note" size={iconSize} color={colors.accent} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
