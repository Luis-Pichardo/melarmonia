import Constants from 'expo-constants';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/Screen';
import { ColorSwatches } from '@/components/settings/ColorSwatches';
import { SegmentedControl, SettingsRow, SettingsSection } from '@/components/settings/Settings';
import { pluralize } from '@/library/text';
import {
  getExcludedFolders,
  getMinDurationSec,
  MIN_DURATION_OPTIONS,
  setMinDurationSec,
} from '@/storage/settings';
import { useLibrary } from '@/store/library';
import { spacing, useTheme, type ThemePreference } from '@/theme';

const MANUAL_URL =
  'https://github.com/Luis-Pichardo/melarmonia/blob/main/docs/05-manual-de-usuario.md';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'dark', label: 'Oscuro' },
  { value: 'light', label: 'Claro' },
  { value: 'system', label: 'Sistema' },
];

const durationOptions = MIN_DURATION_OPTIONS.map((value) => ({
  value,
  label: value === 0 ? 'Todas' : `${value} s`,
}));

function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

/** Ajustes (pantallas y flujos, 3.2): Apariencia, Biblioteca, Reproducción y Acerca de. */
export default function AjustesScreen() {
  const { colors, preference, setPreference } = useTheme();
  const status = useLibrary((s) => s.status);
  const lastScan = useLibrary((s) => s.lastScan);
  const total = useLibrary((s) => s.songs.length);
  const rescan = useLibrary((s) => s.rescan);
  const [minDuration, setMinDuration] = useState(getMinDurationSec);
  const [excludedCount, setExcludedCount] = useState(() => getExcludedFolders().length);
  useFocusEffect(useCallback(() => setExcludedCount(getExcludedFolders().length), []));

  const scanning = status === 'scanning';
  const scanDescription = scanning
    ? 'Buscando…'
    : lastScan
      ? `${pluralize(total, 'canción', 'canciones')} · última vez a las ${formatTime(lastScan.at)}` +
        (lastScan.added || lastScan.removed ? ` (+${lastScan.added} / −${lastScan.removed})` : '')
      : pluralize(total, 'canción', 'canciones');

  return (
    <Screen title="Ajustes" fullWidth>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SettingsSection title="Apariencia">
          <SettingsRow icon="dark-mode" label="Tema" />
          <SegmentedControl
            label="Tema"
            options={themeOptions}
            value={preference}
            onChange={setPreference}
          />
          <SettingsRow
            icon="palette"
            label="Color"
            description="El morado es el color de Melarmonía"
          />
          <ColorSwatches onCustomPress={() => router.push('/ajustes/color')} />
        </SettingsSection>

        <SettingsSection
          title="Biblioteca"
          footer="Los audios más cortos que la duración mínima no aparecen (notas de voz, tonos…).">
          <SettingsRow
            icon="refresh"
            label="Buscar música de nuevo"
            description={scanDescription}
            onPress={scanning ? undefined : () => rescan({ userInitiated: true })}
            right={scanning ? <ActivityIndicator color={colors.accent} /> : null}
          />
          <SettingsRow
            icon="folder-off"
            label="Carpetas excluidas"
            value={String(excludedCount)}
            onPress={() => router.push('/ajustes/carpetas')}
            chevron
          />
          <SettingsRow icon="timer" label="Duración mínima" />
          <SegmentedControl
            label="Duración mínima"
            options={durationOptions}
            value={minDuration}
            onChange={(value) => {
              setMinDuration(value);
              setMinDurationSec(value);
              rescan();
            }}
          />
        </SettingsSection>

        <SettingsSection title="Reproducción">
          <SettingsRow
            icon="headset-off"
            label="Pausa al desconectar los auriculares"
            description="Siempre activa: Android pausa la música para que no suene por el altavoz."
          />
          <SettingsRow
            icon="notifications"
            label="Controles en la notificación"
            description="Si no los ves, permite las notificaciones de Melarmonía en los ajustes del teléfono."
            onPress={() => Linking.openSettings()}
            chevron
          />
        </SettingsSection>

        <SettingsSection title="Acerca de">
          <SettingsRow
            icon="info-outline"
            label="Versión"
            value={Constants.expoConfig?.version ?? '—'}
          />
          <SettingsRow
            icon="menu-book"
            label="Manual de usuario"
            description="Se abre en el navegador"
            onPress={() => Linking.openURL(MANUAL_URL)}
            chevron
          />
          <SettingsRow
            icon="gavel"
            label="Licencias"
            onPress={() => router.push('/ajustes/licencias')}
            chevron
          />
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xs, paddingBottom: spacing.xl },
});
