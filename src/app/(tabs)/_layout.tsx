import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect } from 'expo-router';
import { BottomTabBar, Tabs } from 'expo-router/js-tabs';
import { useEffect, type ComponentProps } from 'react';
import { AppState } from 'react-native';

import { MiniPlayer } from '@/components/player/MiniPlayer';
import { onMediaLibraryChange } from '@/library/scanner';
import { restorePlayback } from '@/player/player';
import { useLibrary } from '@/store/library';
import { usePlaylists } from '@/store/playlists';
import { sizes, useTheme } from '@/theme';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: '(biblioteca)', title: 'Biblioteca', icon: 'library-music' },
  { name: 'buscar', title: 'Buscar', icon: 'search' },
  { name: 'listas', title: 'Listas', icon: 'queue-music' },
  { name: 'ajustes', title: 'Ajustes', icon: 'settings' },
];

/** Menú inferior con las 4 pestañas (guía de diseño, 2.6). */
export default function TabsLayout() {
  const { colors } = useTheme();
  const permission = useLibrary((s) => s.permission);
  const granted = permission === 'granted';

  // Con permiso: carga la biblioteca y vuelve a buscar cuando cambian los audios del teléfono.
  useEffect(() => {
    if (!granted) return;
    const { init, rescan } = useLibrary.getState();
    init();
    usePlaylists.getState().load();

    let timer: ReturnType<typeof setTimeout> | undefined;
    const debouncedRescan = () => {
      clearTimeout(timer);
      timer = setTimeout(() => rescan(), 1500);
    };
    const mediaSub = onMediaLibraryChange(debouncedRescan);
    const appSub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      // Al volver a la app: el permiso pudo retirarse y pudo haber música nueva.
      useLibrary
        .getState()
        .checkPermission()
        .then((p) => p === 'granted' && debouncedRescan())
        .catch(() => {});
    });
    return () => {
      clearTimeout(timer);
      mediaSub.remove();
      appSub.remove();
    };
  }, [granted]);

  // Recupera la última cola (en pausa) en cuanto la biblioteca está cargada.
  const songs = useLibrary((s) => s.songs);
  useEffect(() => {
    if (songs.length > 0) restorePlayback(new Map(songs.map((s) => [s.id, s])));
  }, [songs]);

  if (!granted) return <Redirect href="/bienvenida" />;

  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => (
        <>
          <MiniPlayer />
          <BottomTabBar {...props} />
        </>
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.divider },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 12 },
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={tab.icon} size={sizes.icon} color={color as string} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
