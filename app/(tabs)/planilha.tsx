import { Ionicons } from '@expo/vector-icons';
import BayerLogo from '../../src/BayerLogo';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../src/auth';
import ItemFormModal from '../../src/ItemFormModal';
import StatusPill from '../../src/StatusPill';
import { useTheme } from '../../src/theme';
import { formatDateLabel, ProductionItem, todayISO } from '../../src/types';

const buildLast14Days = (): string[] => {
  const out: string[] = [];
  const d = new Date();
  for (let i = 7; i >= -6; i--) {
    const dt = new Date(d);
    dt.setDate(d.getDate() - i);
    out.push(dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'));
  }
  return out;
};

const DEMO_ITEMS = [
  {
    "id": "d1",
    "date": "2026-05-08",
    "unit": "EVEREST",
    "sc": "SC1",
    "product": "Verango",
    "product_abbr": "VER",
    "batch": "000/26",
    "quantity": 400,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "Preparado",
    "observation": "parte A",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d2",
    "date": "2026-05-08",
    "unit": "EVEREST",
    "sc": "SC1",
    "product": "Verango",
    "product_abbr": "VER",
    "batch": "000/26",
    "quantity": 400,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "A preparar",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d3",
    "date": "2026-05-08",
    "unit": "EVEREST",
    "sc": "SC5",
    "product": "Fox Xpro",
    "product_abbr": "FXX",
    "batch": "143/26",
    "quantity": 2400,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "A preparar",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d4",
    "date": "2026-05-08",
    "unit": "EVEREST",
    "sc": "SC5",
    "product": "Fox Xpro",
    "product_abbr": "FXX",
    "batch": "144/26",
    "quantity": 2400,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "A preparar",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d5",
    "date": "2026-05-08",
    "unit": "FENIX",
    "sc": "SC3",
    "product": "Nativo",
    "product_abbr": "NAT",
    "batch": "113/26",
    "quantity": 1200,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "Preparado",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d6",
    "date": "2026-05-08",
    "unit": "FENIX",
    "sc": "SC3",
    "product": "Nativo",
    "product_abbr": "NAT",
    "batch": "114/26",
    "quantity": 1200,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "A preparar",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d7",
    "date": "2026-05-08",
    "unit": "FENIX",
    "sc": "SC3",
    "product": "Nativo",
    "product_abbr": "NAT",
    "batch": "115/26",
    "quantity": 1200,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "A preparar",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d8",
    "date": "2026-05-08",
    "unit": "FENIX",
    "sc": "SC3",
    "product": "Nativo",
    "product_abbr": "NAT",
    "batch": "116/26",
    "quantity": 1200,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "A preparar",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d9",
    "date": "2026-05-08",
    "unit": "FENIX",
    "sc": "SC2",
    "product": "Belt",
    "product_abbr": "BEL",
    "batch": "019/26",
    "quantity": 1000,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "Em fábrica",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  },
  {
    "id": "d10",
    "date": "2026-05-08",
    "unit": "FENIX",
    "sc": "SC2",
    "product": "Belt",
    "product_abbr": "BEL",
    "batch": "020/26",
    "quantity": 1000,
    "quantity_unit": "kg",
    "material_status": "Disponível",
    "situation": "Em fábrica",
    "observation": "",
    "created_at": "2026-05-08T02:19:20.186Z",
    "updated_at": "2026-05-08T02:19:20.186Z"
  }
];

export default function PlanilhaScreen() {
  const { colors, mode, toggle } = useTheme();
  const { user, isDemo } = useAuth();
  const [date, setDate] = useState(todayISO());
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<ProductionItem | null>(null);
  const dates = useMemo(buildLast14Days, []);
  const fetchItems = useCallback(async () => {
    if (isDemo) { setItems(DEMO_ITEMS as any); setLoading(false); return; }
    setLoading(true);
    try {
      const r = await api.get('/items', { params: { date } });
      setItems(Array.isArray(r.data) ? r.data : []);
    } catch { Alert.alert('Erro', 'Falha ao carregar dados.'); }
    finally { setLoading(false); }
  }, [date, isDemo]);
  useFocusEffect(useCallback(() => { fetchItems(); }, [fetchItems]));
  const onRefresh = async () => { setRefreshing(true); await fetchItems(); setRefreshing(false); };
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(it => {
      if (statusFilter !== 'Todos' && it.material_status !== statusFilter) return false;
      if (!q) return true;
      return it.product?.toLowerCase().includes(q) || it.product_abbr?.toLowerCase().includes(q) ||
        it.batch?.toLowerCase().includes(q) || it.sc?.toLowerCase().includes(q) ||
        it.unit?.toLowerCase().includes(q) || (it.observation || '').toLowerCase().includes(q);
    });
  }, [items, search, statusFilter]);
  const stats = useMemo(() => ({
    total: items.length,
    disp: items.filter(i => i.material_status === 'Disponível').length,
    baixo: items.filter(i => i.material_status === 'Baixo').length,
    indisp: items.filter(i => i.material_status === 'Indisponível').length,
    prep: items.filter(i => i.situation === 'Preparado').length,
  }), [items]);
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; };
  const handleDelete = (id: string) => Alert.alert('Remover item', 'Confirmar?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Remover', style: 'destructive', onPress: async () => { try { await api.delete('/items/' + id); fetchItems(); } catch { Alert.alert('Erro', 'Falha ao remover'); } } },
  ]);
  const STATUS_FILTERS = ['Todos', 'Disponível', 'Baixo', 'Indisponível'];
  const renderItem = ({ item }: { item: ProductionItem }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => { setEditing(item); setFormVisible(true); }} activeOpacity={0.75}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardProduct, { color: colors.textPrimary }]} numberOfLines={1}>{item.product}</Text>
          <Text style={[styles.cardMeta, { color: colors.textTertiary }]}>{item.unit} · {item.sc} · {item.batch}</Text>
        </View>
        <StatusPill label={item.material_status} />
      </View>
      <View style={styles.cardBottom}>
        <StatusPill label={item.situation} />
        {item.quantity != null && <Text style={[styles.cardQty, { color: colors.textSecondary }]}>{item.quantity} {item.quantity_unit}</Text>}
        {item.observation ? <Text style={[styles.cardObs, { color: colors.textTertiary }]} numberOfLines={1}>{item.observation}</Text> : null}
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.deleteBtn, { backgroundColor: colors.dangerBg }]}>
          <Ionicons name="trash-outline" size={14} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerInner}>
          <View style={styles.bayerBadge}><BayerLogo size={22} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting()}, {user?.name?.split(" ")[0] || "Operador"}</Text>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Planilha de Produção</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggle} style={[styles.iconBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name={mode === "dark" ? "sunny-outline" : "moon-outline"} size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            {!isDemo && (
              <TouchableOpacity onPress={() => { setEditing(null); setFormVisible(true); }} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addBtnTxt}>Novo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {!isDemo && items.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          {([
            ['Total', stats.total, colors.primary, colors.primary + '22'],
            ['Disponível', stats.disp, colors.success, colors.successBg],
            ['Baixo', stats.baixo, colors.warning, colors.warningBg],
            ['Indisponível', stats.indisp, colors.danger, colors.dangerBg],
            ['Preparados', stats.prep, colors.info, colors.infoBg],
          ] as [string, number, string, string][]).map(([label, value, color, bg]) => (
            <View key={label} style={[styles.statPill, { backgroundColor: bg }]}>
              <Text style={[styles.statValue, { color }]}>{value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      {isDemo && (
        <View style={[styles.demoBanner, { backgroundColor: colors.warningBg, borderColor: colors.warning + '44' }]}>
          <Ionicons name="warning-outline" size={16} color={colors.warning} />
          <Text style={[styles.demoBannerText, { color: colors.warning }]}>Modo demo - configure o backend para dados reais</Text>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
        {dates.map(d => {
          const active = d === date;
          const parts = d.split('-');
          const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          const isToday = d === todayISO();
          return (
            <TouchableOpacity key={d} onPress={() => setDate(d)}
              style={[styles.dateChip, { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : isToday ? colors.primary + '55' : colors.border }]}>
              <Text style={{ color: active ? '#fff' : colors.textTertiary, fontSize: 10, fontWeight: '600' }}>{dt.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3).toUpperCase()}</Text>
              <Text style={{ color: active ? '#fff' : colors.textPrimary, fontSize: 17, fontWeight: '800' }}>{parts[2]}</Text>
              {isToday && !active && <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={{ paddingHorizontal: 12, gap: 8, marginBottom: 4 }}>
        <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={16} color={colors.textTertiary} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Buscar produto, lote, SC..." placeholderTextColor={colors.textTertiary} style={[styles.searchInput, { color: colors.textPrimary }]} />
          {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color={colors.textTertiary} /></TouchableOpacity>}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {STATUS_FILTERS.map(f => {
            const active = statusFilter === f;
            return (<TouchableOpacity key={f} onPress={() => setStatusFilter(f)} style={[styles.filterChip, { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border }]}><Text style={{ color: active ? '#fff' : colors.textSecondary, fontSize: 12, fontWeight: '600' }}>{f}</Text></TouchableOpacity>);
          })}
        </ScrollView>
      </View>
      <Text style={[styles.dateLabel, { color: colors.textSecondary, paddingHorizontal: 14, marginBottom: 4 }]}>{formatDateLabel(date)} · {filtered.length} {filtered.length === 1 ? 'item' : 'itens'}</Text>
      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} size="large" /></View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="clipboard-outline" size={48} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>{isDemo ? 'Modo demonstração' : 'Nenhum item encontrado'}</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>{isDemo ? 'Configure o backend e use conta real para ver dados.' : search || statusFilter !== 'Todos' ? 'Ajuste os filtros' : 'Toque em Novo para adicionar o primeiro item'}</Text>
        </View>
      ) : (
        <FlatList data={filtered} keyExtractor={it => it.id} renderItem={renderItem}
          contentContainerStyle={{ padding: 12, gap: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          showsVerticalScrollIndicator={false} initialNumToRender={10} maxToRenderPerBatch={10} windowSize={5} />
      )}
      <ItemFormModal visible={formVisible} initial={editing} date={date} onClose={() => { setFormVisible(false); setEditing(null); }} onSaved={fetchItems} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14, borderBottomWidth: 1 },
  bayerBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 4 },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting: { fontSize: 12, fontWeight: '500' },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  iconBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 38, borderRadius: 10 },
  addBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statsScroll: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  statPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, alignItems: 'center', minWidth: 72 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '600', marginTop: 1 },
  demoBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  demoBannerText: { flex: 1, fontSize: 12, fontWeight: '500' },
  dateChip: { width: 48, paddingVertical: 8, borderRadius: 12, alignItems: 'center', borderWidth: 1, gap: 2 },
  todayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 40, borderRadius: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  dateLabel: { fontSize: 13 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10, elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardProduct: { fontSize: 15, fontWeight: '700' },
  cardMeta: { fontSize: 12, marginTop: 2 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardQty: { fontSize: 12, fontWeight: '500' },
  cardObs: { fontSize: 12, flex: 1 },
  deleteBtn: { marginLeft: 'auto', padding: 6, borderRadius: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  emptySubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
