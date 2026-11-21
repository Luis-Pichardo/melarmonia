import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Artwork } from '@/components/library/Artwork';
import { useTheme } from '@/theme';

interface PlaylistMosaicProps {
  artwork: (string | null)[];
  size: number;
  radius: number;
  /** Favoritos: degradado de marca con un corazón. */
  favorites?: boolean;
}

/**
 * Mosaico de 4 carátulas de una lista (pantallas y flujos, 3.2).
 * Con 1 a 3 carátulas se muestra la primera; sin ninguna, el marcador de la guía.
 */
export function PlaylistMosaic({ artwork, size, radius, favorites }: PlaylistMosaicProps) {
  const { colors } = useTheme();

  if (favorites) {
    return (
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.center, { width: size, height: size, borderRadius: radius }]}>
        <MaterialIcons name="favorite" size={size * 0.45} color="#FFFFFF" />
      </LinearGradient>
    );
  }

  if (artwork.length < 4) {
    return <Artwork uri={artwork[0] ?? null} size={size} radius={radius} />;
  }

  const half = size / 2;
  return (
    <View
      style={[
        styles.grid,
        { width: size, height: size, borderRadius: radius, backgroundColor: colors.surfaceVariant },
      ]}>
      {artwork.slice(0, 4).map((uri, i) => (
        <Artwork key={`${uri}-${i}`} uri={uri} size={half} radius={0} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' },
});
