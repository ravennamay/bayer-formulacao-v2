import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';
import { PremiumCard } from '../../../src/components/Premium/PremiumCard';
import { SectionHeader } from '../../../src/components/Premium/SectionHeader';
import { SettingItem } from '../../../src/components/SettingsSection';

export default function SecurityScreen() {
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
          Segurança
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Status */}
        <PremiumCard colors={colors} variant="filled" padding={14} gap={12}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: colors.success + '20' },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={colors.success}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>
                Conta Segura
              </Text>
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                Sua conta está bem protegida
              </Text>
            </View>
          </View>
        </PremiumCard>

        {/* Senha Section */}
        <SectionHeader
          title="Autenticação"
          icon="lock-closed"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <SettingItem
            icon="key"
            title="Alterar Senha"
            subtitle="Atualize sua senha regularmente"
            onPress={() => router.push('./security-password')}
            colors={colors}
            iconColor={colors.warning}
          />
          <SettingItem
            icon="phone-portrait"
            title="Autenticação de Dois Fatores"
            subtitle="Adicione segurança extra com 2FA"
            onPress={() => router.push('./security-2fa')}
            colors={colors}
            iconColor={colors.success}
          />
        </PremiumCard>

        {/* Sessions */}
        <SectionHeader
          title="Sessões Ativas"
          icon="phone"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={14} gap={12}>
          <View style={styles.sessionRow}>
            <View
              style={[
                styles.sessionIcon,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Ionicons
                name="phone-portrait"
                size={18}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sessionName, { color: colors.textPrimary }]}>
                Este Dispositivo
              </Text>
              <Text style={[styles.sessionInfo, { color: colors.textSecondary }]}>
                Ativo agora • Última atividade há poucos segundos
              </Text>
            </View>
            <View
              style={[
                styles.activeBadge,
                { backgroundColor: colors.success + '20' },
              ]}
            >
              <Text style={[styles.activeBadgeText, { color: colors.success }]}>
                Ativo
              </Text>
            </View>
          </View>
        </PremiumCard>

        {/* Devices Management */}
        <SectionHeader
          title="Gerenciar Dispositivos"
          icon="tablets"
          colors={colors}
        />

        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="devices"
            size={40}
            color={colors.textTertiary}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhum outro dispositivo conectado
          </Text>
          <Text
            style={[
              styles.emptySubtext,
              { color: colors.textTertiary },
            ]}
          >
            Seus outros dispositivos aparecerão aqui
          </Text>
        </View>

        {/* Security Recommendations */}
        <SectionHeader
          title="Recomendações"
          icon="lightbulb"
          colors={colors}
        />

        <View style={styles.recommendationsStack}>
          <PremiumCard
            colors={colors}
            variant="outlined"
            padding={12}
            gap={10}
          >
            <View style={styles.recommendationRow}>
              <View
                style={[
                  styles.recIcon,
                  { backgroundColor: colors.success + '20' },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.success}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.recTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  Senha Forte
                </Text>
                <Text
                  style={[
                    styles.recText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Sua senha atende aos critérios de segurança
                </Text>
              </View>
            </View>
          </PremiumCard>

          <PremiumCard
            colors={colors}
            variant="outlined"
            padding={12}
            gap={10}
          >
            <View style={styles.recommendationRow}>
              <View
                style={[
                  styles.recIcon,
                  { backgroundColor: colors.warning + '20' },
                ]}
              >
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={colors.warning}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.recTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  Ative 2FA
                </Text>
                <Text
                  style={[
                    styles.recText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Adicione uma camada extra de proteção
                </Text>
              </View>
            </View>
          </PremiumCard>
        </View>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Suas informações estão criptografadas e seguras
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
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    marginTop: 2,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionName: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionInfo: {
    fontSize: 11,
    marginTop: 2,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 12,
  },
  recommendationsStack: {
    gap: 10,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  recText: {
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
});
