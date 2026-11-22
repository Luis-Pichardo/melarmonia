import { Linking, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DetailHeader } from '@/components/DetailHeader';
import { SettingsRow, SettingsSection } from '@/components/settings/Settings';
import { sizes, spacing, useTheme } from '@/theme';

/** Software de código abierto que usa Melarmonía. */
const LIBRARIES: { name: string; license: string; url: string }[] = [
  { name: 'React Native', license: 'MIT', url: 'https://github.com/facebook/react-native' },
  {
    name: 'Expo (expo-audio, expo-media-library, expo-sqlite…)',
    license: 'MIT',
    url: 'https://github.com/expo/expo',
  },
  { name: 'Expo Router', license: 'MIT', url: 'https://github.com/expo/expo' },
  {
    name: 'React Native Reanimated',
    license: 'MIT',
    url: 'https://github.com/software-mansion/react-native-reanimated',
  },
  {
    name: 'React Native Gesture Handler',
    license: 'MIT',
    url: 'https://github.com/software-mansion/react-native-gesture-handler',
  },
  { name: 'FlashList', license: 'MIT', url: 'https://github.com/Shopify/flash-list' },
  {
    name: 'React Native MMKV',
    license: 'MIT',
    url: 'https://github.com/mrousavy/react-native-mmkv',
  },
  {
    name: 'React Native Metadata Retriever',
    license: 'MIT',
    url: 'https://github.com/MissingCore/react-native-metadata-retriever',
  },
  {
    name: 'React Native Reorderable List',
    license: 'MIT',
    url: 'https://github.com/omahili/react-native-reorderable-list',
  },
  {
    name: 'React Native Slider',
    license: 'MIT',
    url: 'https://github.com/callstack/react-native-slider',
  },
  { name: 'Zustand', license: 'MIT', url: 'https://github.com/pmndrs/zustand' },
  {
    name: 'Material Icons',
    license: 'Apache 2.0',
    url: 'https://github.com/google/material-design-icons',
  },
  {
    name: 'Poppins',
    license: 'SIL Open Font License 1.1',
    url: 'https://fonts.google.com/specimen/Poppins',
  },
  {
    name: 'Inter',
    license: 'SIL Open Font License 1.1',
    url: 'https://fonts.google.com/specimen/Inter',
  },
];

export default function LicenciasScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <DetailHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h1" style={styles.pad}>
          Licencias
        </AppText>
        <AppText variant="bodySmall" tone="secondary" style={[styles.pad, styles.intro]}>
          Melarmonía está hecha con estas herramientas de código abierto. Gracias a quienes las
          crean y las mantienen.
        </AppText>
        <SettingsSection title="Software">
          {LIBRARIES.map((lib) => (
            <SettingsRow
              key={lib.name}
              label={lib.name}
              description={lib.license}
              onPress={() => Linking.openURL(lib.url)}
              chevron
            />
          ))}
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  pad: { paddingHorizontal: sizes.screenPadding },
  intro: { paddingTop: spacing.xxs, paddingBottom: spacing.md },
});
