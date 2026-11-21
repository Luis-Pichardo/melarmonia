import { Stack } from 'expo-router';

/** Pila de Listas: el índice, el detalle de cada lista y la pantalla para añadir canciones. */
export default function ListasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="agregar/[id]" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
