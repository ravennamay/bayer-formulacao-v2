import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BayerLogo from '../../src/BayerLogo';
import { useAuth } from '../../src/auth';
import { useTheme } from '../../src/theme';

export default function SettingsScreen() {
  const { colors, mode, toggle } = useTheme();
  const { user, logout, isDemo } = useAuth();
  const router = useRouter();

  const handleLogout = () =>
    Alert.alert('Sair', 'Confirma encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View
        style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      >
        <View style={styles.bayerBadge}>
          <BayerLogo size={22} />
        </View>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Configurações</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Perfil */}
        <View
          style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              {user?.name || 'Operador'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email || '—'}
            </Text>
          </View>
          <View
            style={[
              styles.rolePill,
              { backgroundColor: isDemo ? colors.warningBg : colors.successBg },
            ]}
          >
            <Text
              style={{
                color: isDemo ? colors.warning : colors.success,
                fontWeight: '700',
                fontSize: 10,
                letterSpacing: 0.5,
              }}
            >
              {isDemo ? 'DEMO' : (user?.role || 'user').toUpperCase()}
            </Text>
          </View>
        </View>

        {isDemo && (
          <View
            style={[
              styles.alertBanner,
              { backgroundColor: colors.warningBg, borderColor: colors.warning + '44' },
            ]}
          >
            <Ionicons name="warning-outline" size={15} color={colors.warning} />
            <Text style={[styles.alertText, { color: colors.warning }]}>
              Modo demonstração ativo — dados não são persistidos.
            </Text>
          </View>
        )}

        {/* Aparência */}
        <Section label="APARÊNCIA" colors={colors}>
          <Row
            icon={mode === 'dark' ? 'moon' : 'sunny-outline'}
            iconColor={colors.primary}
            title={`Modo ${mode === 'dark' ? 'Escuro' : 'Claro'}`}
            subtitle="Toque para alternar"
            onPress={toggle}
            colors={colors}
            right={
              <View
                style={[
                  styles.themeToggle,
                  {
                    backgroundColor: mode === 'dark' ? colors.primary : colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={mode === 'dark' ? 'moon' : 'sunny'}
                  size={14}
                  color={mode === 'dark' ? '#000' : colors.textSecondary}
                />
              </View>
            }
          />
        </Section>

        {/* Catálogo */}
        <Section label="CATÁLOGO DE PRODUTOS" colors={colors}>
          <Row
            icon="flask-outline"
            iconColor={colors.secondary}
            title="Ver Catálogo Completo"
            subtitle="Produtos, ingredientes e procedimentos"
            onPress={() => router.push('/(tabs)/products')}
            colors={colors}
            chevron
          />
          <Row
            icon="book-outline"
            iconColor={colors.primary}
            title="Guia de Formulação"
            subtitle="Receitas, química e EPIs"
            onPress={() => router.push('/(tabs)/guide')}
            colors={colors}
            chevron
          />
        </Section>

        {/* Admin */}
        {user?.role === 'admin' && (
          <Section label="ADMINISTRAÇÃO" colors={colors}>
            <Row
              icon="shield-checkmark-outline"
              iconColor={colors.primary}
              title="Painel Administrativo"
              subtitle="Gerenciar usuários e dados"
              onPress={() => router.push('/admin')}
              colors={colors}
              chevron
            />
          </Section>
        )}

        {/* Links */}
        <Section label="LINKS ÚTEIS" colors={colors}>
          <Row
            icon="globe-outline"
            iconColor={colors.secondary}
            title="Portal Bayer Agrícola"
            subtitle="Informações técnicas oficiais"
            onPress={() => Linking.openURL('https://www.bayer.com')}
            colors={colors}
            right={
              <Ionicons name="open-outline" size={16} color={colors.textTertiary} />
            }
          />
        </Section>

        {/* Sair */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutBtn,
            { backgroundColor: colors.dangerBg, borderColor: colors.danger + '55' },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textTertiary }]}>
          Bayer Preparação · v2.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{label}</Text>
      <View
        style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        {children}
      </View>
    </View>
  );
}

function Row({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  colors,
  chevron,
  right,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  colors: any;
  chevron?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.row, { borderBottomColor: colors.border }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon} size={19} color={iconColor} />
      </View>
      <View style={{ flex: 1, gap: 1 }}>
        <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {right ?? (chevron && <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  bayerBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#000', fontWeight: '800', fontSize: 18 },
  profileName: { fontSize: 16, fontWeight: '700' },
  profileEmail: { fontSize: 13, marginTop: 1 },
  rolePill: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  alertText: { flex: 1, fontSize: 13, fontWeight: '500' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowSubtitle: { fontSize: 12 },
  themeToggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  logoutText: { fontSize: 15, fontWeight: '700' },
  version: { fontSize: 11, textAlign: 'center', marginTop: 4 },
});
