import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DetailHeader } from '@/components/DetailHeader';
import { IconButton } from '@/components/IconButton';
import { NameDialog } from '@/components/NameDialog';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SettingsRow, SettingsSection } from '@/components/settings/Settings';
import { compareText, pluralize } from '@/library/text';
import {
  DEFAULT_EXCLUDED_FOLDERS,
  getExcludedFolders,
  setExcludedFolders,
} from '@/storage/settings';
import { useLibrary } from '@/store/library';
import { showToast } from '@/store/toast';
import { sizes, spacing, useTheme } from '@/theme';

/** Último tramo legible de una ruta: ".../Music/WhatsApp Audio" → "Music/WhatsApp Audio". */
function shortPath(path: string): string {
  return path.replace(/^\/storage\/emulated\/\d+\//, '');
}

/**
 * Carpetas excluidas: los audios cuya ruta contiene alguno de estos textos no se muestran.
 * También se puede excluir cualquier carpeta que ya tenga música.
 */
export default function CarpetasScreen() {
  const { colors } = useTheme();
  const songs = useLibrary((s) => s.songs);
  const rescan = useLibrary((s) => s.rescan);
  const [rules, setRules] = useState<string[]>(getExcludedFolders);
  const [adding, setAdding] = useState(false);

  const folders = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of songs) counts.set(s.folder, (counts.get(s.folder) ?? 0) + 1);
    return [...counts.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => compareText(a.path, b.path));
  }, [songs]);

  const apply = (next: string[]) => {
    setRules(next);
    setExcludedFolders(next);
    rescan();
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <DetailHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h1" style={styles.title}>
          Carpetas excluidas
        </AppText>
        <AppText variant="bodySmall" tone="secondary" style={styles.intro}>
          Los audios cuya carpeta contenga alguno de estos textos no aparecen en Melarmonía. No se
          borran del teléfono.
        </AppText>

        <SettingsSection title={`Reglas (${rules.length})`}>
          {rules.length === 0 ? (
            <SettingsRow label="No hay carpetas excluidas" />
          ) : (
            rules.map((rule) => (
              <SettingsRow
                key={rule}
                icon="folder-off"
                label={rule}
                right={
                  <IconButton
                    icon="close"
                    label={`Volver a mostrar ${rule}`}
                    onPress={() => apply(rules.filter((r) => r !== rule))}
                    size={20}
                  />
                }
              />
            ))
          )}
        </SettingsSection>

        <View style={styles.buttons}>
          <PrimaryButton label="Añadir carpeta" icon="add" onPress={() => setAdding(true)} />
          <PrimaryButton
            label="Restaurar las predeterminadas"
            variant="tonal"
            onPress={() => {
              apply([...DEFAULT_EXCLUDED_FOLDERS]);
              showToast('Carpetas predeterminadas restauradas');
            }}
          />
        </View>

        {folders.length > 0 ? (
          <SettingsSection
            title="Carpetas con música"
            footer="Toca ⊘ para dejar de mostrar los audios de esa carpeta.">
            {folders.map((folder) => (
              <SettingsRow
                key={folder.path}
                icon="folder"
                label={shortPath(folder.path)}
                description={pluralize(folder.count, 'canción', 'canciones')}
                right={
                  <IconButton
                    icon="block"
                    label={`Excluir ${shortPath(folder.path)}`}
                    onPress={() => {
                      apply([...rules, folder.path]);
                      showToast(`Carpeta excluida: ${shortPath(folder.path)}`);
                    }}
                    size={20}
                  />
                }
              />
            ))}
          </SettingsSection>
        ) : null}
      </ScrollView>

      <NameDialog
        visible={adding}
        title="Excluir carpeta"
        confirmLabel="Excluir"
        placeholder="Nombre o parte de la ruta"
        onCancel={() => setAdding(false)}
        onConfirm={(text) => {
          setAdding(false);
          if (rules.some((r) => r.toLowerCase() === text.toLowerCase())) return;
          apply([...rules, text]);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  title: { paddingHorizontal: sizes.screenPadding },
  intro: {
    paddingHorizontal: sizes.screenPadding,
    paddingTop: spacing.xxs,
    paddingBottom: spacing.md,
  },
  buttons: { gap: spacing.sm, paddingHorizontal: sizes.screenPadding, marginBottom: spacing.lg },
});
