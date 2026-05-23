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
  Modal,
  Platform,
  ScrollView,
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

import { ProductionItem, todayISO, formatDateLabel, SITUATIONS } from '../../src/types';

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
  const [datePickerVisible, setDatePickerVisible] = useState(false);

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
    const count = (s: string) => filtered.filter(i => i.situation === s).length;

    return {
      total: filtered.length,
      recebido: count('Recebido'),
      aPreparar: count('A preparar'),
      preparado: count('Preparado'),
      fabrica: count('Em fábrica'),
    };
  }, [filtered]);

  const handleEdit = (item: ProductionItem) => {
    setEditing(item);
    setFormVisible(true);
  };

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
      {/* Header: Unit + SC */}
      <View style={styles.cardHeader}>
        <Text style={[styles.unitScLabel, { color: colors.textSecondary }]}>
          {item.unit} • {item.sc}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.cardMainContent}>
        {/* Left: Product Badge + Info */}
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.productBadge,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text style={styles.productBadgeText}>
              {item.product_abbr.slice(0, 3).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.productTitle, { color: colors.textPrimary }]}>
              {item.product}
            </Text>
            <Text style={[styles.productMeta, { color: colors.textSecondary }]}>
              Lote {item.batch}
              {item.quantity ? ` • ${item.quantity} ${item.quantity_unit}` : ''}
            </Text>
          </View>
        </View>

        {/* Right: Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            hitSlop={8}
            style={[
              styles.smallIconButton,
              {
                backgroundColor: colors.primary + '22',
              },
            ]}
          >
            <Ionicons name="pencil-outline" size={16} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            hitSlop={8}
            style={[
              styles.smallIconButton,
              {
                backgroundColor: '#FF4B4B22',
              },
            ]}
          >
            <Ionicons name="trash-outline" size={16} color="#FF4B4B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Pills */}
      <View
        style={[
          styles.cardStatusRow,
          {
            borderTopColor: colors.border,
          },
        ]}
      >
        <StatusPill label={item.situation} small />
        <StatusPill label={item.material_status} small />
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
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.primary,
              paddingBottom: 20,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: '#fff' }]}>
              📋 Planilha Operacional
            </Text>

            <TouchableOpacity
              onPress={() => setDatePickerVisible(true)}
              style={styles.dateButton}
            >
              <Text style={[styles.headerSub, { color: '#ffffffCC' }]}>
                {formatDateLabel(date)} · {filtered.length} {filtered.length === 1 ? 'material' : 'materiais'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={toggle}
            style={[
              styles.themeButton,
              {
                backgroundColor: '#ffffff22',
                borderColor: '#ffffff44',
              },
            ]}
          >
            <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search & Filters */}
        <View
          style={[
            styles.filterSection,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={16} color={colors.textTertiary} />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar produto, lote, SC..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.searchInput, { color: colors.textPrimary }]}
            />

            {search && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {['Todos', ...SITUATIONS].map(situation => (
              <TouchableOpacity
                key={situation}
                onPress={() => setSitFilter(situation)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      sitFilter === situation
                        ? colors.primary
                        : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: sitFilter === situation ? '#fff' : colors.textSecondary,
                    fontWeight: '600',
                    fontSize: 12,
                  }}
                >
                  {situation}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <StatCard label="Total" value={stats.total} color={colors.primary} />
          <StatCard label="A preparar" value={stats.aPreparar} color="#FFA500" />
          <StatCard label="Preparado" value={stats.preparado} color="#22C55E" />
          <StatCard label="Em fábrica" value={stats.fabrica} color="#3B82F6" />
        </View>

        {/* Export Buttons */}
        <View style={styles.exportRow}>
          <TouchableOpacity
            onPress={exportExcel}
            style={[
              styles.exportButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="document-outline" size={16} color={colors.primary} />
            <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>
              Excel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={exportPNG}
            style={[
              styles.exportButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="image-outline" size={16} color={colors.primary} />
            <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>
              PNG
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.exportButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => router.push('/(tabs)/report')}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
              Relatório
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.empty}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="inbox-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum material para este dia
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
              paddingBottom: 80,
            }}
          />
        )}
      </ViewShot>

      {/* FAB - Repositioned */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onPress={() => {
          setEditing(null);
          setFormVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <Modal visible={datePickerVisible} transparent animationType="slide">
        <View style={[styles.datePickerModal, { backgroundColor: colors.background }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={[
                styles.datePickerHeader,
                {
                  backgroundColor: colors.surface,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.datePickerTitle, { color: colors.textPrimary }]}>
                Selecionar data
              </Text>

              <TouchableOpacity onPress={() => setDatePickerVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{
                padding: 16,
                paddingBottom: 40,
              }}
            >
              {dates.map(d => (
                <TouchableOpacity
                  key={d}
                  onPress={() => {
                    setDate(d);
                    setDatePickerVisible(false);
                  }}
                  style={[
                    styles.dateOption,
                    {
                      backgroundColor: date === d ? colors.primary + '22' : colors.surface,
                      borderColor: date === d ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: date === d ? colors.primary : colors.textPrimary,
                      fontWeight: date === d ? '700' : '500',
                    }}
                  >
                    {formatDateLabel(d)}
                  </Text>

                  <Text
                    style={{
                      color: colors.textTertiary,
                      fontSize: 12,
                    }}
                  >
                    {new Date(d).toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

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

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: color + '22',
          borderColor: color + '44',
        },
      ]}
    >
      <Text
        style={{
          color: color,
          fontSize: 20,
          fontWeight: '800',
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 11,
          fontWeight: '600',
        }}
      >
        {label}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },

  headerSub: {
    fontSize: 12,
    fontWeight: '500',
  },

  dateButton: {
    paddingVertical: 4,
  },

  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterSection: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },

  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },

  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  exportRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },

  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },

  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
  },

  cardHeader: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },

  unitScLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  cardMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },

  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  productBadge: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  productTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },

  productMeta: {
    fontSize: 12,
  },

  cardActions: {
    flexDirection: 'row',
    gap: 6,
  },

  smallIconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },

  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },

  unitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  productName: {
    fontSize: 15,
    fontWeight: '800',
  },

  productFull: {
    fontSize: 13,
  },

  batch: {
    fontSize: 11,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },

  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusColumn: {
    gap: 8,
  },

  observationBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },

  observationText: {
    fontSize: 12,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  datePickerModal: {
    flex: 1,
  },

  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  datePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  dateOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 4,
  },
});
