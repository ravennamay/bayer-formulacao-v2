import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../src/auth';
import { useTheme } from '../../src/theme';
import { ProductionItem, formatDateLabel, todayISO } from '../../src/types';

export default function HomeScreen() {
  const { colors, mode, toggle } = useTheme();
  const { user } = useAuth();
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

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
    return {
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
      {/* Header Card com Foto do Usuário */}
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>
              {greeting()}, {user?.name || 'Operador'}
            </Text>
            <Text
              style={[styles.sector, { color: colors.textSecondary }]}
            >
              Buffer • Preparação
            </Text>
            <Text
              style={[styles.date, { color: colors.textTertiary }]}
            >
              {dateLabel}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.navigate('/(tabs)/settings' as any)}
              hitSlop={10}
            >
              {userPhoto ? (
                <Image
                  source={{ uri: userPhoto }}
                  style={styles.userPhoto}
                />
              ) : (
                <View
                  style={[
                    styles.userPhotoPlaceholder,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="person-circle"
                    size={48}
                    color={colors.primary}
                  />
                </View>
              )}
            </TouchableOpacity>

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
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Situação da Produção */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
            SITUAÇÃO DA PRODUÇÃO
          </Text>

          <View style={styles.statusGrid}>
            <StatusItem
              label="Recebido"
              count={stats.recebido}
              icon="download-outline"
              color="#3B82F6"
              colors={colors}
            />
            <StatusItem
              label="A preparar"
              count={stats.aPreparar}
              icon="time-outline"
              color="#F59E0B"
              colors={colors}
            />
            <StatusItem
              label="Preparado"
              count={stats.preparado}
              icon="checkmark-circle-outline"
              color="#10B981"
              colors={colors}
            />
            <StatusItem
              label="Em fábrica"
              count={stats.fabrica}
              icon="sync-circle-outline"
              color="#8B5CF6"
              colors={colors}
            />
          </View>
        </View>

        {/* Por Unidade */}
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
              <View
                style={[
                  styles.unitIcon,
                  {
                    backgroundColor: colors.primary + '22',
                  },
                ]}
              >
                <Ionicons name="cube-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.unitName,
                    { color: colors.textPrimary },
                  ]}
                >
                  {unit}
                </Text>
              </View>
              <Text
                style={[
                  styles.unitCount,
                  { color: colors.primary },
                ]}
              >
                {items.filter(i => i.unit === unit).length}
              </Text>
            </View>
          ))}
        </View>

        {/* Gráfico dos Últimos 7 Dias */}
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
                Gráfico de produção dos últimos 7 dias
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusItem({
  label,
  count,
  icon,
  color,
  colors,
}: {
  label: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.statusItem,
        {
          backgroundColor: color + '12',
          borderColor: color + '20',
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
        <Ionicons name={icon} size={18} color={color} />
      </View>

      <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>

      <Text style={[styles.statusCount, { color }]}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  headerCard: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },

  greeting: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },

  sector: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },

  date: {
    fontSize: 10,
    fontWeight: '400',
  },

  headerActions: {
    gap: 8,
    alignItems: 'center',
  },

  userPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  userPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  themeBtn: {
    width: 36,
    height: 36,
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
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },

  statusGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },

  statusItem: {
    flex: 1,
    minWidth: '47%',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  statusIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },

  statusCount: {
    fontSize: 18,
    fontWeight: '800',
  },

  unitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },

  unitIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  unitName: {
    fontSize: 13,
    fontWeight: '600',
  },

  unitCount: {
    fontSize: 16,
    fontWeight: '800',
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
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
