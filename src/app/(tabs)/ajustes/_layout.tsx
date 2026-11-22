import { Stack } from 'expo-router';

/** Pila de Ajustes: la pantalla principal, el color personalizado, las carpetas y las licencias. */
export default function AjustesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="color" />
      <Stack.Screen name="carpetas" />
      <Stack.Screen name="licencias" />
    </Stack>
  );
}
