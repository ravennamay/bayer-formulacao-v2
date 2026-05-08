import * as FileSystem from 'expo-file-system/legacy';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ViewShot as ViewShotType } from 'react-native-view-shot';

import { api, useAuth } from '../../../src/auth';
import StatusPill from '../../../src/StatusPill';
import { useTheme } from '../../../src/theme';
import { formatDateLabel, ProductionItem, todayISO } from '../../../src/types';

// ---------- Utils ----------
const buildLast14Days = (): string[] => {
  const out: string[] = [];
  const d = new Date();

  for (let i = 7; i >= -6; i--) {
    const dt = new Date(d);
    dt.setDate(d.getDate() - i);

    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');

    out.push(`${yyyy}-${mm}-${dd}`);
  }

  return out;
};

// ---------- Component ----------
export default function PlanilhaScreen() {
  const { colors, mode, toggle } = useTheme();
  const { token } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState(todayISO());
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<ProductionItem | null>(null);

  const viewShotRef = useRef<ViewShotType | null>(null);
  const dates = useMemo(buildLast14Days, []);

  // ---------- Fetch ----------
  const fetchItems = useCallback(async () => {
    setLoading(true);

    try {
      const r = await api.get('/items', { params: { date } });
      setItems(r.data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems])
  );

  // ---------- Refresh ----------
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  // ---------- Filters ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter(it => {
      if (statusFilter !== 'Todos' && it.material_status !== statusFilter) return false;

      if (!q) return true;

      return (
        it.product?.toLowerCase().includes(q) ||
        it.product_abbr?.toLowerCase().includes(q) ||
        it.batch?.toLowerCase().includes(q) ||
        it.sc?.toLowerCase().includes(q) ||
        it.unit?.toLowerCase().includes(q) ||
        (it.observation || '').toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  // ---------- Stats ----------
  const stats = useMemo(() => {
    return {
      total: items.length,
      disp: items.filter(i => i.material_status === 'Disponível').length,
      baixo: items.filter(i => i.material_status === 'Baixo').length,
      indisp: items.filter(i => i.material_status === 'Indisponível').length,
    };
  }, [items]);

  // ---------- Actions ----------
  const handleDelete = (id: string) => {
    Alert.alert('Remover item', 'Confirma?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/items/${id}`);
            fetchItems();
          } catch {
            Alert.alert('Erro', 'Falha ao remover');
          }
        },
      },
    ]);
  };

  const exportExcel = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/export/excel?date=${date}`;
      const target = `${FileSystem.cacheDirectory}planilha_${date}.xlsx`;

      const dl = await FileSystem.downloadAsync(url, target, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Sharing.shareAsync(dl.uri);
    } catch {
      Alert.alert('Erro', 'Falha ao exportar Excel');
    }
  };

  // ---------- Render ----------
  const renderItem = ({ item }: { item: ProductionItem }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={{ color: colors.textPrimary }}>{item.product}</Text>
      <StatusPill label={item.material_status} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.textPrimary }}>{formatDateLabel(date)}</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={it => it.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  safe: { flex: 1 },
  card: {
    padding: 12,
    margin: 8,
    borderRadius: 10,
  },
});
