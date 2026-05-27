import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';
import { PremiumCard } from '../../../src/components/Premium/PremiumCard';
import { SectionHeader } from '../../../src/components/Premium/SectionHeader';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'production',
      title: 'Atualizações de Produção',
      description: 'Alertas sobre status de lotes',
      enabled: true,
      icon: 'flask',
    },
    {
      id: 'alerts',
      title: 'Alertas Críticos',
      description: 'Problemas urgentes e erros',
      enabled: true,
      icon: 'warning',
    },
    {
      id: 'shifts',
      title: 'Avisos de Turno',
      description: 'Notificações de próximos turnos',
      enabled: false,
      icon: 'time',
    },
    {
      id: 'reports',
      title: 'Relatórios Prontos',
      description: 'Quando seus relatórios estão prontos',
      enabled: true,
      icon: 'document-text',
    },
    {
      id: 'security',
      title: 'Alertas de Segurança',
      description: 'Atividades suspeitas e acessos',
      enabled: true,
      icon: 'shield-checkmark',
    },
    {
      id: 'updates',
      title: 'Atualizações do App',
      description: 'Novas versões disponíveis',
      enabled: false,
      icon: 'cloud-download',
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

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
          Notificações
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Gerenciar Notificações"
          description="Escolha quais notificações deseja receber"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          {notifications.map((notification, index) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationRow,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth:
                    index < notifications.length - 1 ? 1 : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.icon,
                  {
                    backgroundColor: notification.enabled
                      ? colors.primary + '20'
                      : colors.textTertiary + '10',
                  },
                ]}
              >
                <Ionicons
                  name={notification.icon as any}
                  size={16}
                  color={
                    notification.enabled ? colors.primary : colors.textTertiary
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: notification.enabled
                        ? colors.textPrimary
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {notification.title}
                </Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {notification.description}
                </Text>
              </View>

              <Switch
                value={notification.enabled}
                onValueChange={() => toggleNotification(notification.id)}
                trackColor={{
                  false: colors.textTertiary + '30',
                  true: colors.primary + '40',
                }}
                thumbColor={notification.enabled ? colors.primary : colors.textTertiary}
              />
            </TouchableOpacity>
          ))}
        </PremiumCard>

        <SectionHeader
          title="Preferências"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <View
            style={[
              styles.preferencesRow,
              { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
          >
            <View
              style={[
                styles.prefIcon,
                { backgroundColor: colors.info + '20' },
              ]}
            >
              <Ionicons
                name="notifications-off"
                size={16}
                color={colors.info}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>
                Modo Silencioso
              </Text>
              <Text style={[styles.prefDesc, { color: colors.textSecondary }]}>
                Não perturbe entre 22:00 e 08:00
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{
                false: colors.textTertiary + '30',
                true: colors.primary + '40',
              }}
              thumbColor={colors.primary}
            />
          </View>

          <View style={styles.preferencesRow}>
            <View
              style={[
                styles.prefIcon,
                { backgroundColor: colors.success + '20' },
              ]}
            >
              <Ionicons
                name="vibrate"
                size={16}
                color={colors.success}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>
                Vibração
              </Text>
              <Text style={[styles.prefDesc, { color: colors.textSecondary }]}>
                Háptica ao receber notificações
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{
                false: colors.textTertiary + '30',
                true: colors.primary + '40',
              }}
              thumbColor={colors.primary}
            />
          </View>
        </PremiumCard>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Suas preferências serão salvas automaticamente
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
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  preferencesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  prefIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  prefDesc: {
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
