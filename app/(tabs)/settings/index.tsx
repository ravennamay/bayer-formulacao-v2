import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';
import { PremiumCard } from '../../../src/components/Premium/PremiumCard';
import { SectionHeader } from '../../../src/components/Premium/SectionHeader';

interface SettingCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  badge?: string;
}

export default function SettingsScreen() {
  const { colors, mode } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const categories: SettingCategory[] = useMemo(
    () => [
      {
        id: 'account',
        title: 'Minha Conta',
        description: 'Gerenciar perfil e informações',
        icon: 'person-circle',
        color: colors.primary,
        route: './account',
      },
      {
        id: 'appearance',
        title: 'Aparência',
        description: `Tema ${mode === 'dark' ? 'escuro' : 'claro'}`,
        icon: mode === 'dark' ? 'moon' : 'sunny',
        color: colors.warning,
        route: './appearance',
      },
      {
        id: 'security',
        title: 'Segurança',
        description: 'Senha, autenticação e dispositivos',
        icon: 'shield-checkmark',
        color: colors.danger,
        route: './security',
      },
      {
        id: 'notifications',
        title: 'Notificações',
        description: 'Gerenciar alertas e avisos',
        icon: 'notifications',
        color: colors.info,
        route: './notifications',
      },
      {
        id: 'products',
        title: 'Produtos',
        description: 'Catálogo de produtos Bayer',
        icon: 'flask',
        color: colors.success,
        route: './products',
      },
      {
        id: 'production',
        title: 'Produção',
        description: 'Status e referências',
        icon: 'cog',
        color: colors.secondary,
        route: './production',
      },
      {
        id: 'system',
        title: 'Sistema',
        description: 'Configurações de aplicativo',
        icon: 'settings',
        color: colors.primary,
        route: './system',
      },
      {
        id: 'help',
        title: 'Ajuda & Suporte',
        description: 'Centro de ajuda e feedback',
        icon: 'help-circle',
        color: colors.info,
        route: './help',
      },
    ],
    [colors, mode]
  );

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header Premium */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Configurações
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Gerencie sua experiência
          </Text>
        </View>
        <View
          style={[
            styles.headerIcon,
            { backgroundColor: colors.primary + '10' },
          ]}
        >
          <Ionicons
            name="settings"
            size={24}
            color={colors.primary}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <PremiumCard colors={colors} variant="filled" padding={16} gap={12}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.avatarText}>
                {(user?.name || user?.email || 'U')
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                {user?.name || 'Usuário'}
              </Text>
              <Text
                style={[
                  styles.profileEmail,
                  { color: colors.textSecondary },
                ]}
              >
                {user?.email}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                { backgroundColor: colors.successBg },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: colors.success },
                ]}
              >
                {(user?.role || 'user').toUpperCase()}
              </Text>
            </View>
          </View>
        </PremiumCard>

        {/* Categories Grid */}
        <SectionHeader
          title="Configurações Principais"
          colors={colors}
        />

        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => router.push(category.route)}
              activeOpacity={0.6}
              style={{ flex: 1 }}
            >
              <PremiumCard
                colors={colors}
                variant="outlined"
                padding={14}
                gap={10}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '12' },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={20}
                    color={category.color}
                  />
                </View>

                <Text
                  style={[
                    styles.categoryTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  {category.title}
                </Text>

                <Text
                  style={[
                    styles.categoryDescription,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {category.description}
                </Text>

                <View style={styles.categoryArrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.textTertiary}
                  />
                </View>
              </PremiumCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger Zone */}
        <SectionHeader
          title="Conta"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <TouchableOpacity
            onPress={handleLogout}
            style={[
              styles.dangerItem,
              {
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.dangerIcon,
                { backgroundColor: colors.danger + '12' },
              ]}
            >
              <Ionicons
                name="log-out"
                size={18}
                color={colors.danger}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.dangerTitle,
                  { color: colors.danger },
                ]}
              >
                Sair da Conta
              </Text>
              <Text
                style={[
                  styles.dangerDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Você será desconectado
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </PremiumCard>

        {/* Footer */}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 11,
    marginTop: -2,
  },
  categoryArrow: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dangerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  dangerDescription: {
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
