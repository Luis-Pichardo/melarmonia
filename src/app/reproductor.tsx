import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { Artwork } from '@/components/library/Artwork';
import { PlayerControls } from '@/components/player/PlayerControls';
import { SeekBar } from '@/components/player/SeekBar';
import { next, previous, usePlayer } from '@/player/player';
import { radius, sizes, spacing, useTheme } from '@/theme';

const SWIPE_TRACK_THRESHOLD = 80;
const SWIPE_CLOSE_THRESHOLD = 140;

/**
 * Reproductor completo (pantallas y flujos, 3.2).
 * Deslizar la carátula a los lados cambia de canción; deslizar hacia abajo lo cierra.
 */
export default function ReproductorScreen() {
  const { colors, mode } = useTheme();
  const { width } = useWindowDimensions();
  const current = usePlayer((s) => s.current);
  const sourceLabel = usePlayer((s) => s.sourceLabel);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const pan = usePanGesture({
    runOnJS: true,
    minDistance: 12,
    onUpdate: (e) => {
      if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
        translateX.value = e.translationX;
        translateY.value = 0;
      } else if (e.translationY > 0) {
        translateY.value = e.translationY;
        translateX.value = 0;
      }
    },
    onDeactivate: (e) => {
      const horizontal = Math.abs(e.translationX) > Math.abs(e.translationY);
      if (horizontal && e.translationX < -SWIPE_TRACK_THRESHOLD) next();
      else if (horizontal && e.translationX > SWIPE_TRACK_THRESHOLD) previous();
      else if (!horizontal && e.translationY > SWIPE_CLOSE_THRESHOLD) {
        translateY.value = withTiming(800, { duration: 200 });
        close();
        return;
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const screenStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(translateY.value, [0, 400], [1, 0.6], 'clamp'),
  }));
  const artworkStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${interpolate(translateX.value, [-200, 0, 200], [-4, 0, 4], 'clamp')}deg` },
    ],
  }));

  if (!current) return <Redirect href="/" />;

  const artworkSize = Math.min(width * 0.85, 420);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.flex, screenStyle]}>
        <LinearGradient
          colors={[colors.primaryDark, colors.background]}
          locations={[0, mode === 'dark' ? 0.7 : 0.55]}
          style={styles.flex}>
          <SafeAreaView style={styles.safe}>
            <View style={styles.topBar}>
              <IconButton
                icon="keyboard-arrow-down"
                label="Cerrar reproductor"
                onPress={close}
                size={32}
                color="#FFFFFF"
              />
              <View style={styles.source}>
                <AppText variant="caption" style={styles.sourceCaption}>
                  REPRODUCIENDO DESDE
                </AppText>
                <AppText variant="bodySmall" numberOfLines={1} style={styles.sourceLabel}>
                  {sourceLabel || 'Tu biblioteca'}
                </AppText>
              </View>
              <View style={styles.topBarSpacer} />
            </View>

            <View style={styles.artworkWrap}>
              <Animated.View style={artworkStyle}>
                <Artwork
                  uri={current.artworkPath}
                  size={artworkSize}
                  radius={radius.lg}
                  style={styles.artworkShadow}
                />
              </Animated.View>
            </View>

            <View style={styles.info}>
              <AppText variant="display" numberOfLines={2}>
                {current.title}
              </AppText>
              <AppText variant="body" tone="secondary" numberOfLines={1}>
                {current.artist}
              </AppText>
            </View>

            <SeekBar />
            <PlayerControls />
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  topBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -spacing.sm },
  source: { flex: 1, alignItems: 'center' },
  sourceCaption: { color: '#FFFFFF', opacity: 0.75, letterSpacing: 1, fontSize: 10 },
  sourceLabel: { color: '#FFFFFF', fontFamily: 'Inter_500Medium' },
  topBarSpacer: { width: sizes.minTouchTarget },
  artworkWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  artworkShadow: { elevation: 12 },
  info: { gap: spacing.xxs },
});
