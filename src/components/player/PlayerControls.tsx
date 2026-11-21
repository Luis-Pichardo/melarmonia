import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { cycleRepeat, next, previous, togglePlay, toggleShuffle, usePlayer } from '@/player/player';
import { radius, sizes, useTheme } from '@/theme';

/** Controles: 🔀 · ⏮ · ▶/⏸ · ⏭ · 🔁 (pantallas y flujos, 3.2). */
export function PlayerControls() {
  const { colors } = useTheme();
  const playing = usePlayer((s) => s.playing);
  const buffering = usePlayer((s) => s.buffering);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);

  const repeatLabel =
    repeat === 'off'
      ? 'Repetir: desactivado'
      : repeat === 'all'
        ? 'Repetir: todas'
        : 'Repetir: una';

  return (
    <View style={styles.row}>
      <Control
        icon="shuffle"
        label={shuffle ? 'Aleatorio: activado' : 'Aleatorio: desactivado'}
        color={shuffle ? colors.accent : colors.textSecondary}
        onPress={toggleShuffle}
        dot={shuffle ? colors.accent : undefined}
      />
      <Control
        icon="skip-previous"
        label="Anterior"
        size={sizes.playerIcon + 8}
        color={colors.textPrimary}
        onPress={previous}
      />
      <Pressable
        onPress={togglePlay}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pausa' : 'Reproducir'}
        style={({ pressed }) => [
          styles.play,
          { backgroundColor: pressed ? colors.primaryDark : colors.primary },
        ]}>
        {buffering && !playing ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <MaterialIcons
            name={playing ? 'pause' : 'play-arrow'}
            size={sizes.playIcon}
            color={colors.onPrimary}
          />
        )}
      </Pressable>
      <Control
        icon="skip-next"
        label="Siguiente"
        size={sizes.playerIcon + 8}
        color={colors.textPrimary}
        onPress={next}
      />
      <Control
        icon={repeat === 'one' ? 'repeat-one' : 'repeat'}
        label={repeatLabel}
        color={repeat === 'off' ? colors.textSecondary : colors.accent}
        onPress={cycleRepeat}
        dot={repeat !== 'off' ? colors.accent : undefined}
      />
    </View>
  );
}

function Control({
  icon,
  label,
  color,
  onPress,
  size = sizes.playerIcon - 4,
  dot,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  color: string;
  onPress: () => void;
  size?: number;
  dot?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.control, pressed && styles.pressed]}>
      <MaterialIcons name={icon} size={size} color={color} />
      {dot ? <View style={[styles.dot, { backgroundColor: dot }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  control: {
    width: sizes.minTouchTarget + 4,
    height: sizes.minTouchTarget + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
  dot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: radius.round },
  play: {
    width: sizes.playButton,
    height: sizes.playButton,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
