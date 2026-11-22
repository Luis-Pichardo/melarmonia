import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import {
  accentPresets,
  brandFromCustom,
  isValidHex,
  radius,
  spacing,
  useTheme,
  type AccentPresetId,
} from '@/theme';

const PRESET_IDS = Object.keys(accentPresets) as AccentPresetId[];
const SIZE = 44;

/** Colores preparados y el botón "Personalizado" (guía de diseño, 2.2). */
export function ColorSwatches({ onCustomPress }: { onCustomPress: () => void }) {
  const { colors, accent, customAccent, setAccent } = useTheme();
  const customBrand =
    customAccent && isValidHex(customAccent) ? brandFromCustom(customAccent) : null;

  return (
    <View style={styles.grid}>
      {PRESET_IDS.map((id) => {
        const preset = accentPresets[id];
        const selected = accent === id;
        return (
          <Swatch
            key={id}
            label={preset.label}
            selected={selected}
            ring={colors.textPrimary}
            onPress={() => setAccent(id)}>
            <LinearGradient
              colors={[preset.primaryDark, preset.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.circle}>
              {selected ? <MaterialIcons name="check" size={22} color={preset.onPrimary} /> : null}
            </LinearGradient>
          </Swatch>
        );
      })}
      <Swatch
        label="Personalizado"
        selected={accent === 'custom'}
        ring={colors.textPrimary}
        onPress={onCustomPress}>
        {customBrand ? (
          <LinearGradient
            colors={[customBrand.primaryDark, customBrand.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.circle}>
            <MaterialIcons
              name={accent === 'custom' ? 'check' : 'colorize'}
              size={22}
              color={customBrand.onPrimary}
            />
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={['#E0457B', '#E0A030', '#3FA06B', '#2F6FD0', '#6B3FA0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.circle}>
            <MaterialIcons name="colorize" size={22} color="#FFFFFF" />
          </LinearGradient>
        )}
      </Swatch>
    </View>
  );
}

function Swatch({
  label,
  selected,
  ring,
  onPress,
  children,
}: {
  label: string;
  selected: boolean;
  ring: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`Color ${label}`}
      style={styles.item}>
      <View style={[styles.ring, { borderColor: selected ? ring : 'transparent' }]}>
        {children}
      </View>
      <AppText variant="caption" tone={selected ? 'primary' : 'secondary'} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
  },
  item: { width: '25%', alignItems: 'center', gap: spacing.xxs, paddingVertical: spacing.xs },
  ring: { padding: 3, borderRadius: radius.round, borderWidth: 2 },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
