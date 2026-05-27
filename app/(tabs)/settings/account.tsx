import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';
import { SettingItem, SettingSection } from '../../../src/components/SettingsSection';

export default function AccountScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
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
          Minha Conta
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              {user?.name || 'Usuário'}
            </Text>
            <Text
              style={[styles.profileEmail, { color: colors.textSecondary }]}
            >
              {user?.email}
            </Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.successBg },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.success }]}>
                {(user?.role || 'user').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Information */}
        <SettingSection title="Informações da Conta" colors={colors}>
          <SettingItem
            icon="mail"
            title="E-mail"
            value={user?.email}
            colors={colors}
            iconColor={colors.info}
          />
          <SettingItem
            icon="shield-checkmark"
            title="Função"
            value={(user?.role || 'user').toUpperCase()}
            colors={colors}
            iconColor={colors.success}
          />
        </SettingSection>

        {/* Security */}
        <SettingSection title="Segurança" colors={colors}>
          <SettingItem
            icon="lock-closed"
            title="Alterar Senha"
            subtitle="Atualize sua senha regularmente"
            onPress={() => {}}
            colors={colors}
            iconColor={colors.warning}
          />
          <SettingItem
            icon="phone-portrait"
            title="Autenticação de Dois Fatores"
            subtitle="Adicionar camada extra de segurança"
            onPress={() => {}}
            colors={colors}
            iconColor={colors.secondary}
          />
        </SettingSection>

        {/* Danger Zone */}
        <View style={[styles.dangerSection]}>
          <SettingItem
            icon="log-out"
            title="Sair da Conta"
            subtitle="Você será desconectado"
            onPress={() => {
              logout();
              router.replace('/login');
            }}
            colors={{
              ...colors,
              surface: colors.dangerBg,
              border: colors.danger + '20',
            }}
            iconColor={colors.danger}
          />
        </View>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Suas informações estão seguras
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
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
