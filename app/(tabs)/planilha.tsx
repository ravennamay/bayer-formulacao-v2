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
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import ViewShot from 'react-native-view-shot';

import { useTheme } from '../../src/theme';
import { useAuth, api } from '../../src/auth';
import StatusPill from '../../src/StatusPill';
import ItemFormModal from '../../src/ItemFormModal';

import { ProductionItem, todayISO, formatDateLabel, formatBags } from '../../src/types';

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
  const { colors } = useTheme();
  const { token } = useAuth();

  const [date, setDate] = useState(todayISO());
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [sitFilter, setSitFilter] = useState('Todos');
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<ProductionItem | null>(null);

  const viewShotRef = useRef<ViewShot>(null);

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
      aPreparar: count('A preparar'),
      preparado: count('Preparado'),
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
      {/* Activity Tag */}
      <View style={[styles.activityTag, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Ionicons name="document-outline" size={14} color={colors.textSecondary} />
        <Text style={[styles.activityTagText, { color: colors.textSecondary }]}>
          {item.unit} • {item.sc}
        </Text>
      </View>

      {/* Header: Badge + Title + Actions */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.unitBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{item.unit.slice(0, 3).toUpperCase()}</Text>
          </View>
          <View style={styles.titleSection}>
            <Text style={[styles.productTitle, { color: colors.textPrimary }]}>
              {item.product.toUpperCase()}
            </Text>
            <Text style={[styles.scLabel, { color: colors.textSecondary }]}>
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

      {/* Batch Info */}
      <Text style={[styles.batchText, { color: colors.textSecondary }]}>
        Lote {item.batch} • {formatBags(item.quantity)}
      </Text>

      {/* Status Pills */}
      <View style={styles.footer}>
        <StatusPill label={item.situation} />
        <StatusPill label={item.material_status} />
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Date Navigation */}
      <View style={[styles.dateNav, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.dateBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.dateDisplay, { borderColor: colors.primary }]}>
          <Ionicons name="calendar" size={18} color={colors.primary} />
          <Text style={[styles.dateLabel, { color: colors.textPrimary }]}>
            {formatDateLabel(date)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateBtn}>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Statistics Card */}
      <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.statsTop}>
          <View style={styles.totalBox}>
            <View style={[styles.totalBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.totalNum}>{String(stats.total).padStart(2, '0')}</Text>
            </View>
            <Text style={[styles.totalText, { color: colors.textPrimary }]}>Total</Text>
          </View>
          <TouchableOpacity style={[styles.exportBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="download" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsBottom}>
          <View style={styles.statCount}>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>A Preparar</Text>
            <Text style={[styles.countNum, { color: colors.textPrimary }]}>
              {String(stats.aPreparar).padStart(2, '0')}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.statCount}>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>Preparado</Text>
            <Text style={[styles.countNum, { color: colors.textPrimary }]}>
              {String(stats.preparado).padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
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
          <View style={styles.centerLoader}>
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

  centerLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Date Navigation */
  dateNav: {
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

  dateBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 8,
  },

  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
  },

  /* Statistics Card */
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  statsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  totalBox: {
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

  totalNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  totalText: {
    fontSize: 16,
    fontWeight: '700',
  },

  exportBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  statCount: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  countLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  countNum: {
    fontSize: 18,
    fontWeight: '700',
  },

  divider: {
    width: 1,
    height: 30,
    marginHorizontal: 8,
  },

  /* Search */
  searchWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  searchInput: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },

  /* Card Item */
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  activityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },

  activityTagText: {
    fontSize: 12,
    fontWeight: '500',
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

  scLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
  },

  batchText: {
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
