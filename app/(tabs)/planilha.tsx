import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import ViewShot from 'react-native-view-shot';

import { useTheme } from '../../src/theme';
import { useAuth, api } from '../../src/auth';
import StatusPill from '../../src/StatusPill';
import ItemFormModal from '../../src/ItemFormModal';

import { ProductionItem, todayISO, formatDateLabel, formatBags, SITUATIONS } from '../../src/types';

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

export default function PlanilhaScreen() {
  const { colors, mode, toggle } = useTheme();
  const { token } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState(todayISO());
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [sitFilter, setSitFilter] = useState('Todos');
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<ProductionItem | null>(null);

  const viewShotRef = useRef<ViewShot>(null);

  const dates = useMemo(buildLast14Days, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);

    try {
      const r = await api.get('/items', {
        params: { date },
      });

      setItems(r.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Falha ao carregar materiais');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems])
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchItems();

    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter(it => {
      if (sitFilter !== 'Todos' && it.situation !== sitFilter) {
        return false;
      }

      if (!q) return true;

      return (
        it.product.toLowerCase().includes(q) ||
        it.product_abbr.toLowerCase().includes(q) ||
        it.batch.toLowerCase().includes(q) ||
        it.sc.toLowerCase().includes(q) ||
        it.unit.toLowerCase().includes(q) ||
        (it.observation || '').toLowerCase().includes(q)
      );
    });
  }, [items, search, sitFilter]);

  const stats = useMemo(() => {
    const count = (s: string) => items.filter(i => i.situation === s).length;

    return {
      total: items.length,
      recebido: count('Recebido'),
      aPreparar: count('A preparar'),
      preparado: count('Preparado'),
      fabrica: count('Em fábrica'),
    };
  }, [items]);

  const handleDelete = (id: string) => {
    Alert.alert('Remover material', 'Confirma a remoção deste material?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/items/${id}`);
            await fetchItems();
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

      const target = `${FileSystem.cacheDirectory}bayer_planilha_${date}.xlsx`;

      const dl = await FileSystem.downloadAsync(url, target, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dl.uri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Exportar planilha',
        });
      } else {
        Alert.alert('Excel salvo', `Arquivo em: ${dl.uri}`);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Falha ao exportar Excel');
    }
  };

  const exportPNG = async () => {
    try {
      if (!viewShotRef.current) return;

      const uri = await viewShotRef.current.capture?.();

      if (!uri) return;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Compartilhar imagem',
        });
      } else {
        Alert.alert('PNG gerado', `Arquivo em: ${uri}`);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Falha ao exportar PNG');
    }
  };

  const renderItem = ({ item }: { item: ProductionItem }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.cardHeader, { backgroundColor: colors.surfaceElevated, borderBottomColor: colors.border }]}>
        <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
        <Text style={[styles.headerText, { color: colors.textSecondary }]}>{item.unit} • </Text>
        <Text style={[styles.headerText, { color: colors.success, fontWeight: '700' }]}>{item.sc}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.productRow}>
          <View style={[styles.productBadge, { backgroundColor: colors.success }]}>
            <Text style={[styles.productAbbr, { color: '#000' }]}>
              {item.product_abbr?.slice(0, 3).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.productName, { color: colors.textPrimary }]}>{item.product}</Text>
            <Text style={[styles.batchInfo, { color: colors.textSecondary }]}>
              Lote {item.batch} • {item.quantity ? `${item.quantity} ${item.quantity_unit}` : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <StatusPill label={item.situation} />
        <StatusPill label={item.material_status} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 0.9,
          result: 'tmpfile',
        }}
        style={{ flex: 1 }}
      >
        {loading ? (
          <View style={styles.empty}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 120,
            }}
          />
        )}
      </ViewShot>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => {
          setEditing(null);
          setFormVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color="#0B1620" />
      </TouchableOpacity>

      <ItemFormModal
        visible={formVisible}
        initial={editing}
        date={date}
        onClose={() => setFormVisible(false)}
        onSaved={fetchItems}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },

  headerText: {
    fontSize: 11,
    fontWeight: '500',
  },

  cardContent: {
    padding: 14,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  productBadge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productAbbr: {
    fontSize: 14,
    fontWeight: '800',
  },

  productName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },

  batchInfo: {
    fontSize: 13,
    fontWeight: '400',
  },

  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
