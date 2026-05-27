import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';
import { SettingItem, SettingSection } from '../../../src/components/SettingsSection';

export default function AppearanceScreen() {
  const { colors, mode, toggle } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Aparência
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Selector */}
        <SettingSection title="Tema" colors={colors}>
          <SettingItem
            icon={mode === 'dark' ? 'moon' : 'sunny'}
            title={`Modo ${mode === 'dark' ? 'Escuro' : 'Claro'}`}
            subtitle="Alterne entre temas para conforto visual"
            onPress={toggle}
            colors={colors}
            iconColor={mode === 'dark' ? colors.warning : colors.secondary}
          />
        </SettingSection>

        {/* Theme Preview */}
        <View style={{ gap: 8, marginTop: 8 }}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textTertiary },
            ]}
          >
            VISUALIZAÇÃO
          </Text>

          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.previewRow}>
              <View
                style={[
                  styles.previewBox,
                  { backgroundColor: colors.primary },
                ]}
              />
              <View
                style={[
                  styles.previewBox,
                  { backgroundColor: colors.secondary },
                ]}
              />
              <View
                style={[
                  styles.previewBox,
                  { backgroundColor: colors.success },
                ]}
              />
            </View>

            <Text
              style={[
                styles.previewText,
                { color: colors.textPrimary },
              ]}
            >
              Texto Primário
            </Text>
            <Text
              style={[
                styles.previewSubtext,
                { color: colors.textSecondary },
              ]}
            >
              Texto Secundário
            </Text>
          </View>
        </View>

        {/* Display Settings */}
        <SettingSection title="Display" colors={colors}>
          <SettingItem
            icon="settings"
            title="Tamanho do Texto"
            value="Normal"
            colors={colors}
            iconColor={colors.info}
          />
          <SettingItem
            icon="contrast"
            title="Contraste"
            value="Padrão"
            colors={colors}
            iconColor={colors.warning}
          />
        </SettingSection>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          As mudanças são aplicadas instantaneamente
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 12,
  },
  previewBox: {
    flex: 1,
    height: 60,
    borderRadius: 8,
  },
  previewText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  previewSubtext: {
    fontSize: 12,
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
});
