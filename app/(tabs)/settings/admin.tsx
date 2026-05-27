import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';
import { useResponsive } from '../../../src/useResponsive';

export default function AdminScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const responsive = useResponsive();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const adminActions = [
    {
      id: 'users',
      title: 'Gerenciar Usuários',
      subtitle: 'Criar, editar e remover usuários',
      icon: 'people-outline',
      color: colors.primary,
      badge: '12 usuários',
    },
    {
      id: 'products',
      title: 'Gerenciar Produtos',
      subtitle: 'Produtos, categorias e preços',
      icon: 'cube-outline',
      color: colors.success,
      badge: '24 produtos',
    },
    {
      id: 'reports',
      title: 'Relatórios',
      subtitle: 'Estatísticas e análises',
      icon: 'bar-chart-outline',
      color: colors.warning,
      badge: 'Ver',
    },
    {
      id: 'backup',
      title: 'Backup & Restauração',
      subtitle: 'Dados e configurações',
      icon: 'download-outline',
      color: colors.info,
      badge: 'Última 1d',
    },
  ];

  const systemSettings = [
    {
      title: 'Manutenção do Sistema',
      description: 'Coloque o sistema em modo de manutenção',
      icon: 'settings-outline',
      color: colors.primary,
      action: () => Alert.alert('Manutenção', 'Sistema entrou em modo de manutenção'),
    },
    {
      title: 'Limpar Cache',
      description: 'Libera memória removendo cache',
      icon: 'trash-outline',
      color: colors.warning,
      action: () => Alert.alert('Cache', 'Cache foi limpo com sucesso'),
    },
    {
      title: 'Sincronizar Dados',
      description: 'Sincroniza dados com servidor',
      icon: 'sync-circle-outline',
      color: colors.success,
      action: () => Alert.alert('Sincronização', 'Dados sincronizados'),
    },
  ];

  const logsAndActivity = [
    {
      title: 'Ver Logs',
      description: 'Atividades do sistema e erros',
      icon: 'document-text-outline',
      color: colors.info,
    },
    {
      title: 'Auditoria',
      description: 'Histórico de ações de usuários',
      icon: 'shield-checkmark-outline',
      color: colors.primary,
    },
    {
      title: 'Status do Servidor',
      description: 'Saúde e performance',
      icon: 'server-outline',
      color: colors.success,
    },
  ];

  if (!isAdmin) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Administração</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.centerContent, { backgroundColor: colors.background }]}>
          <View
            style={[
              styles.unauthorizedBox,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="lock-closed" size={48} color={colors.danger} />
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: '700',
                fontSize: 18,
                marginTop: 16,
              }}
            >
              Acesso Restrito
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Você não tem permissão para acessar a administração
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Administração</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: responsive.padding,
          gap: responsive.gap,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Admin Actions */}
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
            Ações Administrativas
          </Text>

          <View
            style={[
              styles.actionsGrid,
              { gap: responsive.gap },
            ]}
          >
            {adminActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => {
                  if (action.id === 'users') {
                    router.push('/admin');
                  }
                }}
                style={[
                  styles.actionCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: action.color + '15' },
                  ]}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={24}
                    color={action.color}
                  />
                </View>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '700',
                    fontSize: 14,
                    marginTop: 8,
                  }}
                >
                  {action.title}
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                    marginTop: 4,
                  }}
                  numberOfLines={1}
                >
                  {action.subtitle}
                </Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: action.color + '22' },
                  ]}
                >
                  <Text
                    style={{
                      color: action.color,
                      fontWeight: '600',
                      fontSize: 10,
                    }}
                  >
                    {action.badge}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* System Settings */}
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
            Configurações do Sistema
          </Text>

          <View
            style={[
              styles.settingsList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {systemSettings.map((setting, index, arr) => (
              <TouchableOpacity
                key={setting.title}
                onPress={setting.action}
                style={[
                  styles.settingRow,
                  index < arr.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: setting.color + '15' },
                  ]}
                >
                  <Ionicons
                    name={setting.icon as any}
                    size={18}
                    color={setting.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: '600',
                      fontSize: 14,
                    }}
                  >
                    {setting.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {setting.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logs & Activity */}
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
            Logs e Atividades
          </Text>

          <View
            style={[
              styles.logsList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {logsAndActivity.map((item, index, arr) => (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.logRow,
                  index < arr.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.logIcon,
                    { backgroundColor: item.color + '15' },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={item.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: '600',
                      fontSize: 14,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* System Info */}
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
            Informações do Sistema
          </Text>

          <View
            style={[
              styles.infoGrid,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {[
              { label: 'Versão', value: '2.0.0' },
              { label: 'Build', value: '2024.01.15' },
              { label: 'Status', value: 'Online' },
              { label: 'Usuários', value: '12 ativos' },
            ].map((info, index) => (
              <View
                key={info.label}
                style={[
                  styles.infoItem,
                  (index + 1) % 2 !== 0 &&
                    (responsive.isMobile || index < 2) && {
                    borderRightWidth: 1,
                    borderRightColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                  {info.label}
                </Text>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '700',
                    fontSize: 14,
                    marginTop: 4,
                  }}
                >
                  {info.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
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
            Zona de Risco
          </Text>

          <TouchableOpacity
            style={[
              styles.dangerButton,
              { backgroundColor: colors.dangerBg, borderColor: colors.danger + '55' },
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text
              style={{
                color: colors.danger,
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              Resetar Dados
            </Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  unauthorizedBox: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  settingsList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logsList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoItem: {
    flex: 1,
    minWidth: '50%',
    padding: 14,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
});
