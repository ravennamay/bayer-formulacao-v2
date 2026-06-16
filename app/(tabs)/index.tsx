import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../src/auth';
import BayerLogo from '../../src/BayerLogo';
import { useTheme } from '../../src/theme';
import { ProductionItem, todayISO } from '../../src/types';

const STAT_CONFIG: Array<{
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  colorKey: string;
}> = [
  { key: 'Recebido',   icon: 'archive-outline',              colorKey: 'secondary' },
  { key: 'A preparar', icon: 'time-outline',                 colorKey: 'warning'   },
  { key: 'Preparado',  icon: 'checkmark-done-circle-outline', colorKey: 'success'   },
  { key: 'Em fábrica', icon: 'sync-outline',                 colorKey: 'info'      },
];

export default function HomeScreen() {
  const { colors, mode } = useTheme();
  const { user, isDemo } = useAuth();
  const [items, setItems] = useState<ProductionItem[]>([]);

  const fetchItems = useCallback(async () => {
    if (isDemo) return;
    try {
      const r = await api.get('/items', { params: { date: todayISO() } });
      setItems(Array.isArray(r.data) ? r.data : []);
    } catch {}
  }, [isDemo]);

  useFocusEffect(useCallback(() => { fetchItems(); }, [fetchItems]));

  const stats = useMemo(() => {
    const situationCounts: Record<string, number> = {
      Recebido: 0, 'A preparar': 0, Preparado: 0, 'Em fábrica': 0,
    };
    items.forEach(i => { if (i.situation in situationCounts) situationCounts[i.situation]++; });
    return { situationCounts, total: items.length };
  }, [items]);

  const showStats = !isDemo;

  return (
    <SafeAreaView style={[S.safe, { backgroundColor: colors.background }]} edges={['top']}>

      {/* ── HEADER ── */}
      <View style={[S.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={S.headerRow}>
          {/* Logo */}
          <View style={S.logoBg}>
            <BayerLogo size={28} />
          </View>

          {/* Title + brand subtitle */}
          <View style={S.headerMid}>
            <Text style={[S.headerLabel, { color: colors.primary }]}>Bayer Crop Science</Text>
            <Text style={[S.appTitle, { color: colors.textPrimary }]}>Preparação</Text>
            <Text style={[S.subtitleSub, { color: colors.textSecondary }]}>Produção Industrial</Text>
          </View>

          {/* Bell icon */}
          <TouchableOpacity style={[S.bellBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="notifications-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── STATS SECTION (always visible when not demo) ── */}
      {showStats && (
        <View style={[S.statsSection, { backgroundColor: colors.surface }]}>
          <Text style={[S.sectionLabel, { color: colors.textTertiary }]}>SITUAÇÃO HOJE</Text>
          {items.length > 0 ? (
            <View style={S.statsGrid}>
              {STAT_CONFIG.map(({ key, icon, colorKey }) => {
                const color = (colors as any)[colorKey];
                const count = stats.situationCounts[key] ?? 0;
                return (
                  <View key={key} style={[S.statTile, { backgroundColor: colors.surfaceElevated }]}>
                    <View style={[S.statIcon, { backgroundColor: color + '22' }]}>
                      <Ionicons name={icon} size={16} color={color} />
                    </View>
                    <View>
                      <Text style={[S.statNum, { color }]}>{count}</Text>
                      <Text style={[S.statLbl, { color: colors.textSecondary }]}>{key}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={[S.emptyStats, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <Ionicons name="clipboard-outline" size={28} color={colors.textTertiary} />
              <View style={{ flex: 1 }}>
                <Text style={[S.emptyStatsTitle, { color: colors.textSecondary }]}>Sem lançamentos hoje</Text>
                <Text style={[S.emptyStatsSub, { color: colors.textTertiary }]}>Adicione itens na Planilha para acompanhar aqui</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* ── SCROLL CONTENT ── */}
      <ScrollView
        style={S.scroll}
        contentContainerStyle={S.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isDemo && (
          <View style={[S.demoBanner, { backgroundColor: colors.warningBg, borderColor: colors.warning + '44' }]}>
            <Ionicons name="warning-outline" size={15} color={colors.warning} />
            <Text style={[S.demoBannerTxt, { color: colors.warning }]}>
              Modo demo ativo. Configure o backend para dados reais.
            </Text>
          </View>
        )}

        {/* ACESSO RÁPIDO */}
        <Text style={[S.sectionLabel, { color: colors.textTertiary }]}>ACESSO RÁPIDO</Text>

        {/* Planilha — hero card */}
        <TouchableOpacity
          onPress={() => router.navigate('/(tabs)/planilha' as any)}
          activeOpacity={0.85}
          style={S.heroWrap}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryActive]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={S.heroCard}
          >
            <View style={S.heroIconBg}>
              <Ionicons name="grid" size={22} color="#fff" />
            </View>
            <View style={S.heroBody}>
              <Text style={S.heroTitle}>Planilha de Produção</Text>
              <Text style={S.heroSub}>Controle de itens, lotes e status</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.6)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Relatório de Turno — full-width secondary */}
        <TouchableOpacity
          onPress={() => router.navigate('/(tabs)/report' as any)}
          activeOpacity={0.85}
          style={[S.rowCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[S.rowCardIcon, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="document-text" size={20} color={colors.primary} />
          </View>
          <View style={S.rowCardBody}>
            <Text style={[S.rowCardTitle, { color: colors.textPrimary }]}>Relatório de Turno</Text>
            <Text style={[S.rowCardSub, { color: colors.textSecondary }]}>Fechamento e notas do turno</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* Escala + Guia — side by side */}
        <View style={S.pairRow}>
          <TouchableOpacity
            onPress={() => router.navigate('/tabela-turno' as any)}
            activeOpacity={0.85}
            style={[S.pairCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[S.pairIcon, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name="calendar" size={18} color={colors.primary} />
            </View>
            <Text style={[S.pairTitle, { color: colors.textPrimary }]}>Escala</Text>
            <Text style={[S.pairSub, { color: colors.textSecondary }]}>Tabela de turnos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate('/(tabs)/guide' as any)}
            activeOpacity={0.85}
            style={[S.pairCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[S.pairIcon, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name="book" size={18} color={colors.primary} />
            </View>
            <Text style={[S.pairTitle, { color: colors.textPrimary }]}>Guia</Text>
            <Text style={[S.pairSub, { color: colors.textSecondary }]}>Formulação e procedimentos</Text>
          </TouchableOpacity>
        </View>

        {/* FERRAMENTAS */}
        <Text style={[S.sectionLabel, { color: colors.textTertiary, marginTop: 4 }]}>FERRAMENTAS</Text>

        <View style={S.pairRow}>
          <TouchableOpacity
            onPress={() => router.navigate('/(tabs)/turno' as any)}
            activeOpacity={0.85}
            style={[S.toolCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={[S.toolLabel, { color: colors.textSecondary }]}>Gestão de Turno</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate('/(tabs)/settings' as any)}
            activeOpacity={0.85}
            style={[S.toolCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="settings" size={20} color={colors.primary} />
            <Text style={[S.toolLabel, { color: colors.textSecondary }]}>Config</Text>
          </TouchableOpacity>
        </View>

        <Text style={[S.version, { color: colors.textTertiary }]}>Bayer Preparação · v2.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1 },

  // ── Header ──
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerMid: {
    flex: 1,
    gap: 1,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  subtitleSub: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // ── Stats ──
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  statTile: {
    width: '47.5%',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
    marginTop: 6,
  },

  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
  },
  demoBannerTxt: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },

  // ── Hero card ──
  heroWrap: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#89D329',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 20,
  },
  heroIconBg: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: { flex: 1, gap: 3 },
  heroTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 17 },

  // ── Full-width row card ──
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  rowCardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCardBody: { flex: 1, gap: 2 },
  rowCardTitle: { fontSize: 15, fontWeight: '700' },
  rowCardSub: { fontSize: 12, lineHeight: 16 },

  // ── Pair row ──
  pairRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pairCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  pairIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pairTitle: { fontSize: 14, fontWeight: '700' },
  pairSub: { fontSize: 11, lineHeight: 15 },

  // ── Tool cards ──
  toolCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 72,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
  },

  version: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
  },

  emptyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
  emptyStatsTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  emptyStatsSub: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});
