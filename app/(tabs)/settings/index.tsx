import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const settingsOptions = [
    {
      id: 'account',
      title: 'Conta',
      subtitle: 'Informações de usuário e segurança',
      icon: 'person-circle',
      color: colors.primary,
    },
    {
      id: 'appearance',
      title: 'Aparência',
      subtitle: 'Tema claro/escuro',
      icon: 'moon',
      color: colors.secondary,
    },
    {
      id: 'products',
      title: 'Produtos',
      subtitle: 'Catálogo de produtos',
      icon: 'flask',
      color: colors.info,
    },
    {
      id: 'production',
      title: 'Status de Produção',
      subtitle: 'Referências e pesos',
      icon: 'cog',
      color: colors.warning,
    },
  ];

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Configurações</Text>
        <Ionicons name="settings-outline" size={24} color={colors.primary} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        {/* User Card */}
        <View
          style={[
            styles.userCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 24 }}>
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 16 }}>
              {user?.name || 'Usuário'}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{user?.email}</Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.successBg },
            ]}
          >
            <Text
              style={{
                color: colors.success,
                fontWeight: '700',
                fontSize: 10,
              }}
            >
              {(user?.role || 'user').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Settings Grid */}
        <View style={{ gap: 12 }}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => router.push(`./${option.id}`)}
              style={[
                styles.optionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: option.color + '15' },
                ]}
              >
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 15 }}>
                  {option.title}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {option.subtitle}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.dangerBg,
              borderColor: colors.danger + '55',
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15 }}>
            Sair da conta
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: colors.textTertiary,
            fontSize: 11,
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          Bayer Preparação · v2.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
});
