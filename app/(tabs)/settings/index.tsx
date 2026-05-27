import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';
import { SettingItem, SettingSection } from '../../../src/components/SettingsSection';

export default function SettingsScreen() {
  const { colors, mode, toggle } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Configurações
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Gerencie sua conta e preferências
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <SettingSection title="Perfil" colors={colors}>
          <SettingItem
            icon="person-circle"
            title={user?.name || 'Usuário'}
            subtitle={user?.email}
            onPress={() => router.push('./account')}
            colors={colors}
            iconColor={colors.primary}
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferências" colors={colors}>
          <SettingItem
            icon={mode === 'dark' ? 'moon' : 'sunny'}
            title="Tema"
            subtitle={mode === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
            onPress={toggle}
            colors={colors}
            iconColor={colors.warning}
          />
          <SettingItem
            icon="language"
            title="Idioma"
            value="Português"
            colors={colors}
            iconColor={colors.info}
          />
        </SettingSection>

        {/* Products & Data Section */}
        <SettingSection title="Dados" colors={colors}>
          <SettingItem
            icon="flask"
            title="Catálogo de Produtos"
            subtitle="Gerencie seus produtos"
            onPress={() => router.push('./products')}
            colors={colors}
            iconColor={colors.success}
          />
          <SettingItem
            icon="cog"
            title="Status de Produção"
            subtitle="Referências e pesos"
            onPress={() => router.push('./production')}
            colors={colors}
            iconColor={colors.secondary}
          />
        </SettingSection>

        {/* App Section */}
        <SettingSection title="Aplicativo" colors={colors}>
          <SettingItem
            icon="information-circle"
            title="Versão"
            value="2.0.0"
            colors={colors}
            iconColor={colors.primary}
          />
          <SettingItem
            icon="shield-checkmark"
            title="Segurança"
            subtitle="Gerenciar permissões"
            colors={colors}
            iconColor={colors.warning}
          />
        </SettingSection>

        {/* Danger Zone */}
        <View style={[styles.dangerSection]}>
          <SettingItem
            icon="log-out"
            title="Sair da conta"
            onPress={handleLogout}
            colors={{
              ...colors,
              surface: colors.dangerBg,
              border: colors.danger + '20',
            }}
            iconColor={colors.danger}
          />
        </View>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Bayer Preparação® · v2.0.0
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  dangerSection: {
    marginTop: 20,
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
});
