import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useEffect, type ComponentProps } from 'react';
import { AppState } from 'react-native';

import { onMediaLibraryChange } from '@/library/scanner';
import { useLibrary } from '@/store/library';
import { sizes, useTheme } from '@/theme';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Biblioteca', icon: 'library-music' },
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

  if (!granted) return <Redirect href="/bienvenida" />;

  return (
    <Tabs
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
