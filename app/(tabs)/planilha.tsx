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
      {/* Card Header with Badge and Icons */}
      <View style={styles.cardHeader}>
        <View style={styles.badgeAndTitle}>
          <View style={[styles.unitBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{item.unit.slice(0, 3).toUpperCase()}</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={[styles.productTitle, { color: colors.textPrimary }]}>
              {item.product.toUpperCase()}
            </Text>
            <Text style={[styles.scInfo, { color: colors.textSecondary }]}>
              {item.sc}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Ionicons name="pencil" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Info */}
      <Text style={[styles.batchInfo, { color: colors.textSecondary }]}>
        Lote {item.batch} • {formatBags(item.quantity)}
      </Text>

      {/* Card Footer with Status Pills */}
      <View style={styles.cardFooter}>
        <StatusPill label={item.situation} />
        <StatusPill label={item.material_status} />
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Date Selector */}
      <View style={[styles.dateContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.dateNavButton}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.dateSelector, { borderColor: colors.primary }]}>
          <Ionicons name="calendar" size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>
            {formatDateLabel(date)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateNavButton}>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.statsHeader}>
          <View style={styles.statsTitleBlock}>
            <View style={[styles.statusBadge, { backgroundColor: colors.primary }]}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                {String(stats.total).padStart(2, '0')}
              </Text>
            </View>
            <Text style={[styles.statsTitle, { color: colors.textPrimary }]}>
              Total
            </Text>
          </View>
          <TouchableOpacity style={[styles.exportButton, { backgroundColor: colors.primary }]}>
            <Ionicons name="download" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              A Preparar
            </Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {String(stats.aPreparar).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Preparado
            </Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {String(stats.preparado).padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.headerContent}>
        <TextInput
          style={[styles.search, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Buscar produto..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
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
            ListHeaderComponent={renderHeader}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            scrollIndicatorInsets={{ right: 1 }}
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

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },

  dateNavButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
  },

  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },

  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  statsTitleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },

  headerContent: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  search: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },

  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  badgeAndTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },

  unitBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  titleBlock: {
    flex: 1,
    justifyContent: 'center',
  },

  productTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },

  scInfo: {
    fontSize: 12,
    fontWeight: '500',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },

  batchInfo: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
  },

  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
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
