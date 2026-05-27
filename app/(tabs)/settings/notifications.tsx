import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../src/theme';
import { useResponsive } from '../../../src/useResponsive';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const responsive = useResponsive();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);
  const [productNews, setProductNews] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const notificationCategories = [
    {
      title: 'Atualizações de Pedido',
      description: 'Pedidos, entregas e mudanças de status',
      enabled: orderUpdates,
      onChange: setOrderUpdates,
      icon: 'cube-outline',
      color: colors.primary,
    },
    {
      title: 'Alertas de Status',
      description: 'Produção e alterações críticas',
      enabled: statusAlerts,
      onChange: setStatusAlerts,
      icon: 'alert-circle-outline',
      color: colors.warning,
    },
    {
      title: 'Novidades de Produtos',
      description: 'Novos produtos e atualizações',
      enabled: productNews,
      onChange: setProductNews,
      icon: 'star-outline',
      color: colors.success,
    },
    {
      title: 'Resumo Semanal',
      description: 'Estatísticas e resumo da semana',
      enabled: weeklyDigest,
      onChange: setWeeklyDigest,
      icon: 'bar-chart-outline',
      color: colors.info,
    },
  ];

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
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notificações</Text>
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
        {/* Master Controls */}
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
            Controles Gerais
          </Text>

          <View
            style={[
              styles.optionsList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.optionRow,
                { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Notificações Push
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Alertas em tempo real no aplicativo
                </Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '55' }}
                thumbColor={pushEnabled ? colors.primary : colors.textTertiary}
                style={{ marginLeft: 12 }}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Notificações por Email
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Resumos e alertas importantes
                </Text>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '55' }}
                thumbColor={emailEnabled ? colors.primary : colors.textTertiary}
                style={{ marginLeft: 12 }}
              />
            </View>
          </View>
        </View>

        {/* Notification Categories */}
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
            Tipos de Notificação
          </Text>

          <View
            style={[
              styles.categoryList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {notificationCategories.map((category, index, arr) => (
              <View
                key={category.title}
                style={[
                  styles.categoryRow,
                  index < arr.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '15' },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={18}
                    color={category.color}
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
                    {category.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {category.description}
                  </Text>
                </View>
                <Switch
                  value={category.enabled}
                  onValueChange={category.onChange}
                  trackColor={{ false: colors.border, true: colors.primary + '55' }}
                  thumbColor={category.enabled ? colors.primary : colors.textTertiary}
                  style={{ marginLeft: 12 }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Schedule */}
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
            Programação
          </Text>

          <TouchableOpacity
            style={[
              styles.row,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '600',
                  fontSize: 15,
                }}
              >
                Horas Silenciosas
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                22:00 - 08:00
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.row,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '600',
                  fontSize: 15,
                }}
              >
                Frequência de Email
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Semanalmente
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Notification History */}
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
            Centro de Notificações
          </Text>

          <TouchableOpacity
            style={[
              styles.row,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '600',
                  fontSize: 15,
                }}
              >
                Ver Centro de Notificações
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Veja todas as suas notificações
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <View
            style={[
              styles.notificationList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {[
              {
                title: 'Pedido Confirmado',
                time: 'Há 2 horas',
                read: true,
                icon: 'checkmark-circle-outline',
                color: colors.success,
              },
              {
                title: 'Status de Produção',
                time: 'Há 1 dia',
                read: true,
                icon: 'sync-circle-outline',
                color: colors.warning,
              },
              {
                title: 'Pedido Entregue',
                time: 'Há 3 dias',
                read: false,
                icon: 'cube-outline',
                color: colors.info,
              },
            ].map((notif, index, arr) => (
              <View
                key={index}
                style={[
                  styles.notificationItem,
                  index < arr.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.notifIcon,
                    { backgroundColor: notif.color + '15' },
                  ]}
                >
                  <Ionicons
                    name={notif.icon as any}
                    size={16}
                    color={notif.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: '600',
                      fontSize: 13,
                    }}
                  >
                    {notif.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {notif.time}
                  </Text>
                </View>
                {!notif.read && (
                  <View
                    style={[
                      styles.unreadDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Clear All */}
        <TouchableOpacity
          style={[
            styles.row,
            { backgroundColor: colors.dangerBg, borderColor: colors.danger + '55' },
          ]}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text
            style={{
              color: colors.danger,
              fontWeight: '700',
              fontSize: 15,
              flex: 1,
            }}
          >
            Limpar Todas as Notificações
          </Text>
        </TouchableOpacity>
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
  optionsList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  categoryList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
