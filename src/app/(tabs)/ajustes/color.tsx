import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DetailHeader } from '@/components/DetailHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import {
  accentPresets,
  brandFromCustom,
  hexToHsl,
  hslToHex,
  isValidHex,
  radius,
  sizes,
  spacing,
  typography,
  useTheme,
} from '@/theme';

/**
 * Color personalizado (guía de diseño, 2.2): se elige con tono, saturación y luminosidad
 * o escribiendo el código. La app calcula el tono oscuro, el claro y el color del texto.
 */
export default function ColorScreen() {
  const { colors, mode, accent, customAccent, setAccent } = useTheme();
  const startHex =
    customAccent && isValidHex(customAccent)
      ? customAccent
      : accent !== 'custom'
        ? accentPresets[accent].primary
        : accentPresets.purple.primary;

  const [hsl, setHsl] = useState(() => hexToHsl(startHex));
  const [hexText, setHexText] = useState(startHex.toUpperCase());

  // El código exacto escrito (o el inicial) manda hasta que se mueve un control,
  // para no perder precisión al convertir a tono, saturación y luminosidad.
  const [exactHex, setExactHex] = useState<string | null>(startHex.toUpperCase());
  const hex = useMemo(() => exactHex ?? hslToHex(hsl.h, hsl.s, hsl.l), [exactHex, hsl]);
  const brand = useMemo(() => brandFromCustom(hex), [hex]);
  const previewAccent = mode === 'dark' ? brand.primaryLight : brand.primary;

  const updateHsl = (next: Partial<typeof hsl>) => {
    const merged = { ...hsl, ...next };
    setExactHex(null);
    setHsl(merged);
    setHexText(hslToHex(merged.h, merged.s, merged.l));
  };

  const onHexChange = (text: string) => {
    const value = (text.startsWith('#') ? text : `#${text}`).toUpperCase().slice(0, 7);
    setHexText(value);
    if (isValidHex(value)) {
      setHsl(hexToHsl(value));
      setExactHex(value);
    }
  };

  const save = () => {
    setAccent('custom', hex);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <DetailHeader />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText variant="h1">Color personalizado</AppText>

        {/* Vista previa con el color elegido */}
        <View style={[styles.preview, { backgroundColor: colors.surface }]}>
          <LinearGradient
            colors={[brand.primaryDark, brand.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewBanner}>
            <MaterialIcons name="music-note" size={36} color={brand.onPrimary} />
            <AppText variant="h2" style={{ color: brand.onPrimary }}>
              Melarmonía
            </AppText>
          </LinearGradient>
          <View style={styles.previewRow}>
            <View style={[styles.previewPlay, { backgroundColor: brand.primary }]}>
              <MaterialIcons name="play-arrow" size={28} color={brand.onPrimary} />
            </View>
            <View style={styles.flex}>
              <AppText variant="body" style={{ color: previewAccent }}>
                Canción que suena
              </AppText>
              <View style={[styles.track, { backgroundColor: colors.surfaceVariant }]}>
                <View style={[styles.fill, { backgroundColor: brand.primary }]} />
              </View>
            </View>
            <MaterialIcons name="shuffle" size={sizes.icon} color={previewAccent} />
          </View>
        </View>

        <View style={styles.swatchRow}>
          {(['primaryDark', 'primary', 'primaryLight'] as const).map((key) => (
            <View key={key} style={styles.swatchItem}>
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: brand[key], borderColor: colors.divider },
                ]}
              />
              <AppText variant="caption" tone="secondary">
                {brand[key]}
              </AppText>
            </View>
          ))}
        </View>

        <ColorSlider
          label="Tono"
          value={hsl.h}
          max={360}
          onChange={(h) => updateHsl({ h })}
          track={hslToHex(hsl.h, 80, 50)}
        />
        <ColorSlider
          label="Saturación"
          value={hsl.s}
          max={100}
          onChange={(s) => updateHsl({ s })}
          track={hex}
        />
        <ColorSlider
          label="Luminosidad"
          value={hsl.l}
          max={100}
          onChange={(l) => updateHsl({ l })}
          track={hex}
        />

        <View style={styles.hexRow}>
          <AppText variant="body" style={styles.flex}>
            Código
          </AppText>
          <TextInput
            value={hexText}
            onChangeText={onHexChange}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
            selectionColor={colors.accent}
            cursorColor={colors.accent}
            accessibilityLabel="Código hexadecimal del color"
            style={[
              typography.body,
              styles.hexInput,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surfaceVariant,
                borderColor: isValidHex(hexText) ? 'transparent' : colors.error,
              },
            ]}
          />
        </View>

        {brand.onPrimary !== '#FFFFFF' ? (
          <AppText variant="bodySmall" tone="secondary">
            Este color es claro: los textos y los iconos sobre él serán oscuros para que se lean
            bien.
          </AppText>
        ) : null}

        <View style={styles.buttons}>
          <PrimaryButton label="Usar este color" icon="check" onPress={save} />
          <PrimaryButton
            label="Volver al morado"
            variant="tonal"
            onPress={() => {
              setAccent('purple');
              router.back();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ColorSlider({
  label,
  value,
  max,
  onChange,
  track,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
  track: string;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <View style={styles.sliderLabel}>
        <AppText variant="bodySmall">{label}</AppText>
        <AppText variant="caption" tone="secondary">
          {Math.round(value)}
        </AppText>
      </View>
      <Slider
        value={value}
        minimumValue={0}
        maximumValue={max}
        step={1}
        onValueChange={onChange}
        minimumTrackTintColor={track}
        maximumTrackTintColor={colors.surfaceVariant}
        thumbTintColor={track}
        accessibilityLabel={label}
        style={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: sizes.screenPadding, paddingBottom: spacing.xl, gap: spacing.md },
  preview: { borderRadius: radius.lg, overflow: 'hidden' },
  previewBanner: {
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  previewPlay: {
    width: 48,
    height: 48,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { height: 3, borderRadius: radius.round, marginTop: spacing.xs, overflow: 'hidden' },
  fill: { width: '45%', height: 3 },
  swatchRow: { flexDirection: 'row', justifyContent: 'space-around' },
  swatchItem: { alignItems: 'center', gap: spacing.xxs },
  swatch: { width: 48, height: 48, borderRadius: radius.md, borderWidth: 1 },
  sliderLabel: { flexDirection: 'row', justifyContent: 'space-between' },
  slider: { height: 40, marginHorizontal: -spacing.xs },
  hexRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hexInput: {
    width: 120,
    minHeight: sizes.minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
  },
  buttons: { gap: spacing.sm, marginTop: spacing.sm },
});
