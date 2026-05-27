import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';
import { SettingItem, SettingSection } from '../../../src/components/SettingsSection';

interface StatusItem {
  label: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
}

export default function ProductionScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const statusItems: StatusItem[] = [
    {
      label: 'Recebido',
      icon: 'download-outline',
      color: colors.info,
      bg: colors.infoBg,
      description: 'Material recebido no galpão',
    },
    {
      label: 'A preparar',
      icon: 'time-outline',
      color: colors.warning,
      bg: colors.warningBg,
      description: 'Aguardando preparação',
    },
    {
      label: 'Preparado',
      icon: 'checkmark-done-circle',
      color: colors.success,
      bg: colors.successBg,
      description: 'Pronto para fábrica',
    },
    {
      label: 'Em fábrica',
      icon: 'sync-circle',
      color: colors.info,
      bg: colors.infoBg,
      description: 'Processamento em andamento',
    },
  ];

  const weights = [
    { name: 'Verango', weight: '400 kg/bag' },
    { name: 'Ureia', weight: '700 kg/bag' },
    { name: 'Demais', weight: 'Ver NF' },
  ];

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
          Produção
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Grid */}
        <View style={{ gap: 8 }}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textTertiary },
            ]}
          >
            STATUS DOS MATERIAIS
          </Text>

          <View style={styles.statusGrid}>
            {statusItems.map((item, index) => (
              <View
                key={item.label}
                style={[
                  styles.statusCard,
                  {
                    backgroundColor: item.bg,
                    borderColor: item.color + '30',
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusIconContainer,
                    { backgroundColor: item.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={item.color}
                  />
                </View>

                <Text
                  style={[
                    styles.statusLabel,
                    { color: item.color },
                  ]}
                >
                  {item.label}
                </Text>

                <Text
                  style={[
                    styles.statusDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weight Reference */}
        <SettingSection title="Pesos de Referência" colors={colors}>
          {weights.map((item, index) => (
            <SettingItem
              key={item.name}
              icon="weight"
              title={item.name}
              value={item.weight}
              colors={colors}
              iconColor={colors.primary}
            />
          ))}
        </SettingSection>

        {/* Reference Information */}
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '20',
            },
          ]}
        >
          <Ionicons
            name="information-circle"
            size={16}
            color={colors.primary}
          />
          <Text
            style={[
              styles.infoText,
              { color: colors.textSecondary },
            ]}
          >
            Os pesos são referências padrão. Consulte a nota fiscal para valores específicos.
          </Text>
        </View>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Informações de processo de produção
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
    paddingHorizontal: 0,
    marginTop: 4,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusCard: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 11,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
});
