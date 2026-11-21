import { Stack } from 'expo-router';

/** Pila de la Biblioteca: la lista y los detalles de álbum y artista, con el menú inferior visible. */
export default function BibliotecaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="album/[id]" />
      <Stack.Screen name="artista/[name]" />
    </Stack>
  );
}
