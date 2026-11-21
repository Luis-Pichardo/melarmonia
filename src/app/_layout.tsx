import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SongMenuSheet } from '@/components/library/SongMenuSheet';
import { Toast } from '@/components/Toast';
import { useLibrary } from '@/store/library';
import { fontAssets, MelarmoniaThemeProvider, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

/** Conecta nuestros colores con la navegación (fondos y transiciones sin destellos). */
function NavigationTheme() {
  const { mode, colors } = useTheme();
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.divider,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="bienvenida" options={{ animation: 'fade' }} />
        <Stack.Screen
          name="reproductor"
          options={{
            animation: 'slide_from_bottom',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen name="cola" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
      <SongMenuSheet />
      <Toast />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const permission = useLibrary((s) => s.permission);
  const checkPermission = useLibrary((s) => s.checkPermission);
  const ready = (fontsLoaded || !!fontError) && permission !== 'checking';

  useEffect(() => {
    checkPermission().catch(() => useLibrary.setState({ permission: 'undetermined' }));
  }, [checkPermission]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MelarmoniaThemeProvider>
        <NavigationTheme />
      </MelarmoniaThemeProvider>
    </GestureHandlerRootView>
  );
}
