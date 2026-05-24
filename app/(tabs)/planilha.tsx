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
  Dimensions,
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

const { width } = Dimensions.get('window');

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

  const getProductColor = (product: string): string => {
    const productColors: { [key: string]: string } = {
      'FOX XPRO': '#00BCFF',
      'NATIVO': '#89D329',
      'FOX PRO': '#00BCFF',
      'CURBIX': '#EC4899',
      'CONNECT': '#F59E0B',
      'BULLDOCK': '#8B5CF6',
      'ALSYSTIN': '#10B981',
      'OBERON': '#06B6D4',
      'PREMIER PLUS': '#F97316',
      'PROVADO': '#EF4444',
      'SPHERE MAX': '#6366F1',
      'FINISH': '#A78BFA',
      'SOBERAN': '#14B8A6',
    };
    return productColors[product] || colors.primary;
  };

  const renderItem = ({ item }: { item: ProductionItem }) => {
    const productColor = getProductColor(item.product);

    return (
      <TouchableOpacity
        onPress={() => {
          setEditing(item);
          setFormVisible(true);
        }}
        activeOpacity={0.6}
      >
        <View
          style={[
            styles.modernCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* BADGE COLOR HEADER */}
          <View
            style={[
              styles.cardHeaderBar,
              { backgroundColor: productColor },
            ]}
          />

          {/* MAIN CONTENT */}
          <View style={styles.cardMainContent}>
            {/* PRODUCT NAME WITH COLOR INDICATOR */}
            <View style={styles.productHeader}>
              <View
                style={[
                  styles.productBadge,
                  { backgroundColor: productColor + '20', borderColor: productColor },
                ]}
              >
                <Text style={[styles.productAbbr, { color: productColor }]}>
                  {item.product_abbr || item.product.substring(0, 3).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.productName, { color: colors.textPrimary }]}>
                  {item.product}
                </Text>
                <Text style={[styles.batchInfo, { color: colors.textSecondary }]}>
                  Lote {item.batch}
                </Text>
              </View>
            </View>

            {/* SECONDARY INFO */}
            <View style={styles.infoRow}>
              <View style={styles.infoPair}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>SC</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {item.sc}
                </Text>
              </View>
              <View style={styles.infoPair}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Unidade</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {item.unit}
                </Text>
              </View>
            </View>

            {/* STATUS ROW */}
            <View style={styles.statusRow}>
              <StatusPill label={item.situation} />
              {item.material_status && <StatusPill label={item.material_status} />}
            </View>

            {/* OBSERVATION IF EXISTS */}
            {item.observation && (
              <Text style={[styles.observation, { color: colors.textSecondary }]}>
                💬 {item.observation}
              </Text>
            )}
          </View>

          {/* ACTION BUTTON */}
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={[styles.deleteBtn, { backgroundColor: colors.danger + '15' }]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const situationOptions = ['Todos', ...SITUATIONS];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            📊 Planilha
          </Text>
          <Text style={[styles.headerDate, { color: colors.textSecondary }]}>
            {formatDateLabel(date)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={exportExcel}
          style={[styles.exportBtn, { backgroundColor: colors.success }]}
        >
          <Ionicons name="document-text" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
      >
        <StatCard
          label="Total"
          value={String(stats.total)}
          icon="cube"
          color="#00BCFF"
          colors={colors}
        />
        <StatCard
          label="Recebido"
          value={String(stats.recebido)}
          icon="checkmark-circle"
          color="#10B981"
          colors={colors}
        />
        <StatCard
          label="A Preparar"
          value={String(stats.aPreparar)}
          icon="time"
          color="#F59E0B"
          colors={colors}
        />
        <StatCard
          label="Preparado"
          value={String(stats.preparado)}
          icon="checkmark-done"
          color="#8B5CF6"
          colors={colors}
        />
        <StatCard
          label="Fábrica"
          value={String(stats.fabrica)}
          icon="factory"
          color="#EC4899"
          colors={colors}
        />
      </ScrollView>

      {/* SEARCH AND FILTER */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar produto, lote..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {search && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* SITUATION FILTER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {situationOptions.map((sit) => (
            <TouchableOpacity
              key={sit}
              onPress={() => setSitFilter(sit)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: sitFilter === sit ? colors.primary : colors.surface,
                  borderColor: sitFilter === sit ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: sitFilter === sit ? '#000' : colors.textSecondary,
                    fontWeight: sitFilter === sit ? '700' : '600',
                  },
                ]}
              >
                {sit}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LIST */}
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
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="inbox" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum material encontrado
            </Text>
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
              padding: 12,
              paddingBottom: 120,
            }}
          />
        )}
      </ViewShot>

      {/* FAB */}
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

function StatCard({ label, value, icon, color, colors }: any) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.statValue, { color: color }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },

  headerDate: {
    fontSize: 12,
  },

  exportBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  statCard: {
    width: 100,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    gap: 8,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  filterScroll: {
    gap: 6,
  },

  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
  },

  filterText: {
    fontSize: 12,
  },

  modernCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },

  cardHeaderBar: {
    height: 4,
  },

  cardMainContent: {
    padding: 14,
    gap: 12,
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  productBadge: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productAbbr: {
    fontSize: 13,
    fontWeight: '700',
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },

  batchInfo: {
    fontSize: 12,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },

  infoPair: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  statusRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  observation: {
    fontSize: 12,
    lineHeight: 16,
  },

  deleteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: '600',
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
