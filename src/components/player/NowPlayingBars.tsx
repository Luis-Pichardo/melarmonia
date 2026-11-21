import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface NowPlayingBarsProps {
  color: string;
  playing: boolean;
  size?: number;
}

const BARS = [
  { delay: 0, peak: 1 },
  { delay: 180, peak: 0.6 },
  { delay: 90, peak: 0.85 },
];

/** Ecualizador animado que marca la canción que suena (guía de diseño, 2.6). */
export function NowPlayingBars({ color, playing, size = 18 }: NowPlayingBarsProps) {
  return (
    <View
      style={[styles.row, { height: size, gap: size / 9 }]}
      accessibilityLabel={playing ? 'Sonando ahora' : 'En pausa'}>
      {BARS.map((bar, i) => (
        <Bar key={i} color={color} playing={playing} size={size} {...bar} />
      ))}
    </View>
  );
}

function Bar({
  color,
  playing,
  size,
  delay,
  peak,
}: {
  color: string;
  playing: boolean;
  size: number;
  delay: number;
  peak: number;
}) {
  const scale = useSharedValue(0.35);

  useEffect(() => {
    if (playing) {
      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(peak, { duration: 320, easing: Easing.inOut(Easing.quad) }),
            withTiming(0.25, { duration: 320, easing: Easing.inOut(Easing.quad) }),
          ),
          -1,
        ),
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(0.35, { duration: 200 });
    }
    return () => cancelAnimation(scale);
  }, [playing, delay, peak, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scaleY: scale.value }] }));

  return (
    <Animated.View
      style={[styles.bar, { width: size / 5, height: size, backgroundColor: color }, style]}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  bar: { borderRadius: 2, transformOrigin: 'bottom' },
});
