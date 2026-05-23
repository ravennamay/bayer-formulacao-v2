import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../src/auth';
import BayerLogo from '../../src/BayerLogo';
import { useTheme } from '../../src/theme';
import { ProductionItem, formatDateLabel, todayISO } from '../../src/types';

export default function HomeScreen() {
  const { colors, mode, toggle } = useTheme();
  const { user } = useAuth();
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/items', { params: { date: todayISO() } });
      setItems(Array.isArray(r.data) ? r.data : []);
    } catch (err) {
      console.log('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchItems();
  }, [fetchItems]));

  const stats = useMemo(() => {
    const situations = ['Recebido', 'A preparar', 'Preparado', 'Em fábrica'];
    return {
      total: items.length,
      recebido: items.filter(i => i.situation === 'Recebido').length,
      aPreparar: items.filter(i => i.situation === 'A preparar').length,
      preparado: items.filter(i => i.situation === 'Preparado').length,
      fabrica: items.filter(i => i.situation === 'Em fábrica').length,
    };
  }, [items]);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  };

  const dateLabel = formatDateLabel(todayISO());

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header Card */}
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View
            style={[
              styles.logoBg,
              {
                backgroundColor: '#FFFFFF',
                borderColor: colors.border,
              },
            ]}
          >
            <BayerLogo size={28} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>
              {greeting()}, {user?.name || 'Operador'}
            </Text>
            <Text style={[styles.appTitle, { color: colors.textSecondary }]}>
              Formulação · Bayer
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggle}
            style={[
              styles.themeBtn,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {dateLabel}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Shift Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
            RESUMO DO TURNO
          </Text>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.summaryIcon,
                {
                  backgroundColor: colors.primary + '22',
                },
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={32}
                color={colors.primary}
              />
            </View>

            <View>
              <Text style={[styles.summaryNum, { color: colors.textPrimary }]}>
                {stats.total}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Materiais hoje
              </Text>
            </View>
          </View>
        </View>

        {/* Production Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
            SITUAÇÃO DA PRODUÇÃO
          </Text>

          <View style={styles.statusGrid}>
            <StatusCard
              icon="download-outline"
              label="Recebido"
              value={stats.recebido}
              color="#3B82F6"
              colors={colors}
            />
            <StatusCard
              icon="time-outline"
              label="A preparar"
              value={stats.aPreparar}
              color="#F59E0B"
              colors={colors}
            />
            <StatusCard
              icon="checkmark-circle-outline"
              label="Preparado"
              value={stats.preparado}
              color="#10B981"
              colors={colors}
            />
            <StatusCard
              icon="sync-circle-outline"
              label="Em fábrica"
              value={stats.fabrica}
              color="#8B5CF6"
              colors={colors}
            />
          </View>
        </View>

        {/* By Unit */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
            POR UNIDADE
          </Text>

          {[...new Set(items.map(i => i.unit))].map(unit => (
            <View
              key={unit}
              style={[
                styles.unitCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="cube-outline" size={24} color={colors.primary} />
              <Text style={[styles.unitName, { color: colors.textPrimary }]}>
                {unit}
              </Text>
              <Text style={[styles.unitCount, { color: colors.textSecondary }]}>
                {items.filter(i => i.unit === unit).length}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
            AÇÕES RÁPIDAS
          </Text>

          <TouchableOpacity
            onPress={() => router.navigate('/(tabs)/planilha' as any)}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons name="grid-outline" size={20} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Planilha Operacional</Text>
              <Text style={styles.actionSub}>Controle completo de materiais</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate('/(tabs)/report' as any)}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={colors.primary}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                Relatórios
              </Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]}>
                Gerar e exportar relatórios
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Last 7 Days */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
            ÚLTIMOS 7 DIAS
          </Text>

          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.chartPlaceholder}>
              <Ionicons
                name="stats-chart-outline"
                size={48}
                color={colors.textTertiary}
              />
              <Text
                style={[
                  styles.chartText,
                  { color: colors.textSecondary },
                ]}
              >
                Dados de resumo dos últimos 7 dias
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusCard({
  icon,
  label,
  value,
  color,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.statusCard,
        {
          backgroundColor: color + '15',
          borderColor: color + '30',
        },
      ]}
    >
      <View
        style={[
          styles.statusIconBg,
          {
            backgroundColor: color + '20',
          },
        ]}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>

      <Text style={[styles.statusValue, { color }]}>
        {value}
      </Text>

      <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  headerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logoBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  greeting: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },

  appTitle: {
    fontSize: 11,
    fontWeight: '500',
  },

  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },

  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
    gap: 16,
  },

  section: {
    gap: 10,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryNum: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  statusGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },

  statusCard: {
    flex: 1,
    minWidth: '48%',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },

  statusIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusValue: {
    fontSize: 18,
    fontWeight: '800',
  },

  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  unitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },

  unitName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },

  unitCount: {
    fontSize: 13,
    fontWeight: '700',
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  actionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },

  actionSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },

  chartCard: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    borderRadius: 12,
    borderWidth: 1,
  },

  chartPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },

  chartText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
