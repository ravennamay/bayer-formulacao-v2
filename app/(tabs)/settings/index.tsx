import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BayerLogo from '../../../src/BayerLogo';
import { useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';
import { useResponsive } from '../../../src/useResponsive';

export default function SettingsIndexScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const responsive = useResponsive();

  const handleLogout = () =>
    Alert.alert('Sair', 'Confirma encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: logout,
      },
    ]);

  const menuItems = [
    {
      id: 'account',
      title: 'Minha Conta',
      subtitle: 'Perfil e informações pessoais',
      icon: 'person-circle-outline',
      color: colors.primary,
    },
    {
      id: 'appearance',
      title: 'Aparência',
      subtitle: 'Tema e modo escuro',
      icon: 'palette-outline',
      color: colors.primary,
    },
    {
      id: 'security',
      title: 'Segurança',
      subtitle: 'Senha e autenticação',
      icon: 'shield-checkmark-outline',
      color: colors.warning,
    },
    {
      id: 'notifications',
      title: 'Notificações',
      subtitle: 'Alertas e preferências',
      icon: 'notifications-outline',
      color: colors.info,
    },
    {
      id: 'products',
      title: 'Catálogo de Produtos',
      subtitle: 'Produtos e pesos de referência',
      icon: 'flask-outline',
      color: colors.success,
    },
    ...(user?.role === 'admin'
      ? [
          {
            id: 'admin',
            title: 'Administração',
            subtitle: 'Gerenciar usuários e dados',
            icon: 'settings-outline',
            color: colors.danger,
          },
        ]
      : []),
  ];

  // ✅ CORREÇÃO AQUI
  const handleMenuPress = (id: string) => {
    router.push({
      pathname: '/(tabs)/settings/[id]',
      params: { id },
    });
  };

  const numColumns = responsive.isMobile ? 1 : responsive.isTablet ? 2 : 3;
  const containerPadding = responsive.padding;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.bayerBadge}>
            <BayerLogo size={24} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Configurações</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Gerencie suas preferências
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: containerPadding,
          gap: responsive.gap,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* User Info Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              padding: containerPadding,
            },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 20 }}>
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 16 }}>
              {user?.name || 'Usuário'}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{user?.email}</Text>
          </View>

          <View style={[styles.roleBadge, { backgroundColor: colors.successBg }]}>
            <Text style={{ color: colors.success, fontWeight: '700', fontSize: 11 }}>
              {(user?.role || 'USER').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <View style={{ gap: responsive.gap }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Configurações
          </Text>

          <View style={[styles.menuGrid, { gap: responsive.gap }]}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    flex: 1 / numColumns,
                    minHeight: responsive.isMobile ? 120 : 140,
                  },
                ]}
                onPress={() => handleMenuPress(item.id)}
              >
                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                </View>

                <Text style={{ color: colors.textPrimary, fontWeight: '700', marginTop: 8 }}>
                  {item.title}
                </Text>

                <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.dangerBg,
              borderColor: colors.danger + '55',
              height: responsive.buttonHeight,
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={{ color: colors.danger, fontWeight: '700' }}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.textTertiary, fontSize: 11, textAlign: 'center' }}>
          Bayer Preparação · v2.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bayerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menuCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
});
