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

export default function Planilha2Screen() {
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

  const handleEdit = (item: ProductionItem) => {
    setEditing(item);
    setFormVisible(true);
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

  const renderItem = ({ item }: { item: ProductionItem }) => {
    const unitInitials = item.unit.slice(0, 3).toUpperCase();

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Card Header: Badge + Title + Actions */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.unitBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{unitInitials}</Text>
            </View>
            <View style={styles.titleSection}>
              <Text style={[styles.productTitle, { color: colors.textPrimary }]}>
                {item.product.toUpperCase()}
              </Text>
              <Text style={[styles.scBadge, { color: colors.textSecondary }]}>
                {item.sc}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Ionicons name="pencil" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Body: Batch Info */}
        <Text style={[styles.batchLine, { color: colors.textSecondary }]}>
          Lote {item.batch} • {formatBags(item.quantity)}
        </Text>

        {/* Card Footer: Status Pills */}
        <View style={styles.footer}>
          <StatusPill label={item.situation} />
          <StatusPill label={item.material_status} />
        </View>
      </View>
    );
  };

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
          <View style={styles.totalSection}>
            <View style={[styles.totalBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.totalNumber}>{String(stats.total).padStart(2, '0')}</Text>
            </View>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total</Text>
          </View>
          <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="download" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCounts}>
          <View style={styles.countBox}>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>A Preparar</Text>
            <Text style={[styles.countValue, { color: colors.textPrimary }]}>
              {String(stats.aPreparar).padStart(2, '0')}
            </Text>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <View style={styles.countBox}>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>Preparado</Text>
            <Text style={[styles.countValue, { color: colors.textPrimary }]}>
              {String(stats.preparado).padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <TextInput
          style={[styles.searchBox, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Buscar produto..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
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
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Date Selector */
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
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

  /* Stats Card */
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

  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  totalBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },

  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  countBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  countLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  countValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  separator: {
    width: 1,
    height: 30,
    marginHorizontal: 8,
  },

  /* Search */
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  searchBox: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },

  /* Card */
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  headerLeft: {
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
    flexShrink: 0,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  titleSection: {
    flex: 1,
    justifyContent: 'center',
  },

  productTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },

  scBadge: {
    fontSize: 12,
    fontWeight: '500',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
  },

  batchLine: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
  },

  footer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  /* FAB */
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});
