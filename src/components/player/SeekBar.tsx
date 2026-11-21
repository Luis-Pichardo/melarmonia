import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { formatDuration } from '@/library/text';
import { seekTo, usePlayer } from '@/player/player';
import { spacing, useTheme } from '@/theme';

/** Barra de progreso del reproductor: se arrastra para avanzar o retroceder. */
export function SeekBar() {
  const { colors } = useTheme();
  const position = usePlayer((s) => s.positionSec);
  const duration = usePlayer((s) => s.durationSec);
  const [dragValue, setDragValue] = useState<number | null>(null);

  const max = Math.max(duration, 1);
  const shown = dragValue ?? Math.min(position, max);

  return (
    <View>
      <Slider
        value={shown}
        minimumValue={0}
        maximumValue={max}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.surfaceVariant}
        thumbTintColor={colors.accent}
        onSlidingStart={(v) => setDragValue(v)}
        onValueChange={(v) => dragValue !== null && setDragValue(v)}
        onSlidingComplete={(v) => {
          seekTo(v);
          setDragValue(null);
        }}
        accessibilityLabel="Progreso de la canción"
        style={styles.slider}
      />
      <View style={styles.times}>
        <AppText variant="caption" tone="secondary">
          {formatDuration(shown * 1000)}
        </AppText>
        <AppText variant="caption" tone="secondary">
          {formatDuration(duration * 1000)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: { height: 40, marginHorizontal: -spacing.xs },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -spacing.xxs },
});
