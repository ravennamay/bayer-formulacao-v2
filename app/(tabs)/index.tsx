import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../src/auth';
import BayerLogo from '../../src/BayerLogo';
import { useTheme } from '../../src/theme';
import { ProductionItem, todayISO } from '../../src/types';

const NAV_CARDS = [
  { id: 'planilha', title: 'Planilha de Produção', subtitle: 'Controle de itens, lotes e status de material', icon: 'grid', route: '/(tabs)/planilha', accent: true },
  { id: 'report', title: 'Relatório de Turno', subtitle: 'Resumo formatado com status de todos os lotes', icon: 'document-text', route: '/(tabs)/report', accent: false },
];

const QUICK_CARDS = [
  { id: 'guia', title: 'Guia de Formulação', subtitle: 'Produtos e procedimentos', icon: 'book', route: '/(tabs)/guide' },
  { id: 'config', title: 'Configurações', subtitle: 'Conta e aparencia', icon: 'person', route: '/(tabs)/settings' },
];

export default function HomeScreen() {
  const { colors, mode, toggle } = useTheme();
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

  const stats = useMemo(() => ({
    total: items.length,
    disp: items.filter(i => i.material_status === 'Disponivel').length,
    indisp: items.filter(i => i.material_status === 'Indisponivel').length,
  }), [items]);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const firstName = user?.name || 'Operador';

  return (
    <SafeAreaView style={[S.safe, { backgroundColor: colors.background }]} edges={['top']}>

      <View style={[S.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={S.headerRow}>
          <View style={S.headerLeft}>
            <View style={[S.bayerCircle, { backgroundColor: '#fff', shadowColor: colors.primary }]}>
              <BayerLogo size={20} />
            </View>
            <View style={S.headerInfo}>
              <Text style={[S.greetingTxt, { color: colors.textPrimary }]}>{greeting()}, {firstName}</Text>
              <Text style={[S.dateTxt, { color: colors.textSecondary }]} numberOfLines={1}>{today}</Text>
            </View>
          </View>
          <View style={[S.modeToggle, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity
              onPress={mode === 'dark' ? undefined : toggle}
              style={mode === 'dark' ? [S.modeBtn, S.modeBtnActive, { backgroundColor: colors.surface }] : S.modeBtn}
            >
              <Ionicons name="moon" size={15} color={mode === 'dark' ? colors.primary : colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={mode === 'light' ? undefined : toggle}
              style={mode === 'light' ? [S.modeBtn, S.modeBtnActive, { backgroundColor: colors.surface }] : S.modeBtn}
            >
              <Ionicons name="sunny" size={15} color={mode === 'light' ? colors.primary : colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[S.appTitle, { color: colors.textPrimary }]}>Fito Formulação</Text>

        {!isDemo && items.length > 0 && (
          <View style={[S.statsBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={S.statItem}>
              <Text style={[S.statNum, { color: colors.textPrimary }]}>{stats.total}</Text>
              <Text style={[S.statLbl, { color: colors.textSecondary }]}>Total hoje</Text>
            </View>
            <View style={[S.statDiv, { backgroundColor: colors.border }]} />
            <View style={S.statItem}>
              <Text style={[S.statNum, { color: colors.success }]}>{stats.disp}</Text>
              <Text style={[S.statLbl, { color: colors.textSecondary }]}>Disponiveis</Text>
            </View>
            <View style={[S.statDiv, { backgroundColor: colors.border }]} />
            <View style={S.statItem}>
              <Text style={[S.statNum, { color: colors.danger }]}>{stats.indisp}</Text>
              <Text style={[S.statLbl, { color: colors.textSecondary }]}>Indisponiveis</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView style={S.scroll} contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>

        {isDemo && (
          <View style={[S.demoBanner, { backgroundColor: colors.warningBg, borderColor: colors.warning + '44' }]}>
            <Ionicons name="warning-outline" size={15} color={colors.warning} />
            <Text style={[S.demoBannerTxt, { color: colors.warning }]}>Modo demo ativo. Configure o backend para dados reais.</Text>
          </View>
        )}

        <Text style={[S.sectionLabel, { color: colors.textTertiary }]}>ACESSO RAPIDO</Text>

        {NAV_CARDS.map(card => card.accent ? (
          <TouchableOpacity key={card.id} onPress={() => router.navigate(card.route as any)} activeOpacity={0.82} style={S.accentWrap}>
            <LinearGradient colors={['#0FA4AF', '#007B82', '#005F73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.accentCard}>
              <View style={S.accentIconBg}>
                <Ionicons name={card.icon as any} size={26} color="#fff" />
              </View>
              <View style={S.cardBody}>
                <Text style={S.accentTitle}>{card.title}</Text>
                <Text style={S.accentSub}>{card.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.55)" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            key={card.id}
            onPress={() => router.navigate(card.route as any)}
            activeOpacity={0.82}
            style={[S.darkCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[S.darkIconBg, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name={card.icon as any} size={26} color={colors.primary} />
            </View>
            <View style={S.cardBody}>
              <Text style={[S.darkTitle, { color: colors.textPrimary }]}>{card.title}</Text>
              <Text style={[S.darkSub, { color: colors.textSecondary }]}>{card.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}

        <Text style={[S.sectionLabel, { color: colors.textTertiary }]}>FERRAMENTAS</Text>

        <View style={S.smallRow}>
          {QUICK_CARDS.map(card => (
            <TouchableOpacity
              key={card.id}
              onPress={() => router.navigate(card.route as any)}
              activeOpacity={0.82}
              style={[S.smallCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[S.smallIconBg, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name={card.icon as any} size={22} color={colors.primary} />
              </View>
              <Text style={[S.smallTitle, { color: colors.textPrimary }]}>{card.title}</Text>
              <Text style={[S.smallSub, { color: colors.textSecondary }]}>{card.subtitle}</Text>
              <View style={S.smallArrowWrap}>
                <Ionicons name="chevron-forward" size={15} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[S.version, { color: colors.textTertiary }]}>Bayer Fito Formulação · v2.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    borderBottomWidth: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bayerCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  headerInfo: {
    flex: 1,
    gap: 1,
  },
  greetingTxt: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateTxt: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    gap: 2,
  },
  modeBtn: {
    width: 30,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: 10,
  },
  statsBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginTop: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '500',
  },
  statDiv: {
    width: 1,
    height: 28,
    alignSelf: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  demoBannerTxt: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: -2,
  },
  accentWrap: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#0A9396',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  accentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 22,
  },
  accentIconBg: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  accentTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  accentSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 17,
  },
  darkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  darkIconBg: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  darkSub: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  smallRow: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  smallIconBg: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  smallSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  smallArrowWrap: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  version: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});
