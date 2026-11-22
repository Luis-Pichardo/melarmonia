import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useLibrary } from '@/store/library';
import { radius, spacing, useTheme } from '@/theme';

/**
 * Bienvenida y permiso de música (pantallas y flujos, 3.2).
 * Solo se muestra mientras la app no tiene acceso a la música.
 */
export default function BienvenidaScreen() {
  const { colors } = useTheme();
  const permission = useLibrary((s) => s.permission);
  const requestPermission = useLibrary((s) => s.requestPermission);
  const checkPermission = useLibrary((s) => s.checkPermission);
  const [asking, setAsking] = useState(false);

  if (permission === 'granted') return <Redirect href="/" />;

  const denied = permission === 'denied';

  const onStart = async () => {
    setAsking(true);
    const result = await requestPermission();
    setAsking(false);
    if (result === 'granted') router.replace('/');
  };

  const onOpenSettings = async () => {
    await Linking.openSettings();
  };

  // Al volver de los ajustes del teléfono se comprueba de nuevo el permiso.
  const onRetry = async () => {
    const result = await checkPermission();
    if (result === 'granted') router.replace('/');
    else await onStart();
  };

  return (
    <LinearGradient
      colors={[colors.primaryDark, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={styles.logo}>
            <Image
              source={require('@/assets/images/logo-mark.png')}
              style={styles.logoImage}
              contentFit="contain"
              accessibilityLabel="Logo de Melarmonía"
            />
          </View>
          <AppText variant="display" style={styles.white}>
            Melarmonía
          </AppText>
          <AppText variant="body" style={[styles.white, styles.subtitle]}>
            Tu música, sin interrupciones
          </AppText>
        </View>

        <View style={styles.bottom}>
          {denied ? (
            <>
              <AppText variant="bodySmall" style={[styles.white, styles.explain]}>
                Para mostrar tus canciones, Melarmonía necesita permiso para leer la música y el
                audio de tu teléfono. Actívalo en Ajustes → Permisos → Música y audio.
              </AppText>
              <PrimaryButton
                label="Abrir ajustes"
                icon="settings"
                onPress={onOpenSettings}
                style={styles.whiteButton}
              />
              <PrimaryButton label="Ya lo activé" variant="tonal" onPress={onRetry} />
            </>
          ) : (
            <>
              <AppText variant="bodySmall" style={[styles.white, styles.explain]}>
                Melarmonía reproduce la música que ya tienes en tu teléfono. Sin anuncios, sin
                cuentas y sin internet.
              </AppText>
              <PrimaryButton
                label={asking ? 'Esperando permiso…' : 'Empezar'}
                onPress={onStart}
                disabled={asking}
                style={styles.whiteButton}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  logo: {
    width: 128,
    height: 128,
    borderRadius: radius.round,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoImage: { width: 104, height: 104 },
  white: { color: '#FFFFFF', textAlign: 'center' },
  subtitle: { opacity: 0.85 },
  bottom: { gap: spacing.sm, paddingBottom: spacing.xl },
  explain: { opacity: 0.85, marginBottom: spacing.xs },
  whiteButton: { backgroundColor: 'rgba(255,255,255,0.18)' },
});
