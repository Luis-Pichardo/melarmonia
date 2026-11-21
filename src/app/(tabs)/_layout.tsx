import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';

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
