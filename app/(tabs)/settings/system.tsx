import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';
import { PremiumCard } from '../../../src/components/Premium/PremiumCard';
import { SectionHeader } from '../../../src/components/Premium/SectionHeader';
import { SettingItem } from '../../../src/components/SettingsSection';

export default function SystemScreen() {
  const { colors } = useTheme();
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
          Sistema
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <SectionHeader
          title="Informações do Aplicativo"
          icon="information-circle"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <SettingItem
            icon="cube"
            title="Versão do App"
            value="2.0.0"
            colors={colors}
            iconColor={colors.primary}
          />
          <SettingItem
            icon="build"
            title="Build"
            value="B2024.05.001"
            colors={colors}
            iconColor={colors.secondary}
          />
          <SettingItem
            icon="calendar"
            title="Atualizado em"
            value="27 de Maio de 2026"
            colors={colors}
            iconColor={colors.info}
          />
        </PremiumCard>

        {/* Server Status */}
        <SectionHeader
          title="Status do Servidor"
          icon="cloud-offline"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="filled" padding={14} gap={12}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: colors.success },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>
                Conexão com Servidor
              </Text>
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                Todas os serviços operacionais
              </Text>
            </View>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.success}
            />
          </View>
        </PremiumCard>

        {/* Data Management */}
        <SectionHeader
          title="Gerenciamento de Dados"
          icon="database"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <SettingItem
            icon="refresh-circle"
            title="Sincronizar Agora"
            subtitle="Sincronizar dados com servidor"
            onPress={() => {}}
            colors={colors}
            iconColor={colors.primary}
          />
          <SettingItem
            icon="download"
            title="Fazer Backup"
            subtitle="Baixar seus dados"
            onPress={() => {}}
            colors={colors}
            iconColor={colors.info}
          />
          <SettingItem
            icon="trash"
            title="Limpar Cache"
            subtitle="Liberar 45 MB de espaço"
            colors={colors}
            iconColor={colors.warning}
          />
        </PremiumCard>

        {/* Developer Options */}
        <SectionHeader
          title="Opções de Desenvolvedor"
          icon="code"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <SettingItem
            icon="terminal"
            title="Logs do Sistema"
            subtitle="Ver histórico de eventos"
            onPress={() => {}}
            colors={colors}
            iconColor={colors.secondary}
          />
          <SettingItem
            icon="bug"
            title="Modo Debug"
            value="OFF"
            colors={colors}
            iconColor={colors.danger}
          />
        </PremiumCard>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Sistema versão 2.0.0 · Bayer Preparação
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
});
