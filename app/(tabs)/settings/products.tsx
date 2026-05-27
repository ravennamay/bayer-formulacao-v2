import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';

type Product = { name: string; abbr: string };

export default function ProductsScreen() {
  const { colors } = useTheme();
  const { isDemo } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultProducts = [
    { name: 'Nativo', abbr: 'NAT' },
    { name: 'Verango', abbr: 'VER' },
    { name: 'Oberon', abbr: 'OBE' },
    { name: 'Fox Xpro', abbr: 'FXX' },
    { name: 'Belt', abbr: 'BEL' },
    { name: 'Sphere Max', abbr: 'SPH' },
    { name: 'Connect', abbr: 'CON' },
    { name: 'Movento', abbr: 'MOV' },
    { name: 'Decis', abbr: 'DEC' },
    { name: 'Alsystim', abbr: 'ALS' },
    { name: 'Hybstem', abbr: 'HYB' },
    { name: 'Ureia', abbr: 'URE' },
  ];

  const loadProducts = useCallback(async () => {
    try {
      if (isDemo) {
        setProducts(defaultProducts);
      } else {
        const response = await api.get('/products');
        setProducts(
          Array.isArray(response.data) ? response.data : defaultProducts
        );
      }
    } catch {
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const productList = products.length > 0 ? products : defaultProducts;

  const renderProduct = ({ item }: { item: Product }) => (
    <View
      style={[
        styles.productCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.productIcon,
          { backgroundColor: colors.primary + '12' },
        ]}
      >
        <Ionicons
          name="flask"
          size={20}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.productName,
          { color: colors.textPrimary },
        ]}
        numberOfLines={1}
      >
        {item.name}
      </Text>

      <View
        style={[
          styles.abbr,
          { backgroundColor: colors.primary + '20' },
        ]}
      >
        <Text
          style={[
            styles.abbrText,
            { color: colors.primary },
          ]}
        >
          {item.abbr}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Produtos
          </Text>
          <Text
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            {productList.length} produtos disponíveis
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.textSecondary }}>Carregando...</Text>
        </View>
      ) : productList.length > 0 ? (
        <FlatList
          data={productList}
          renderItem={renderProduct}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="cube-outline"
            size={48}
            color={colors.textTertiary}
          />
          <Text
            style={[
              styles.emptyText,
              { color: colors.textSecondary },
            ]}
          >
            Nenhum produto disponível
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  row: {
    gap: 12,
    marginBottom: 0,
  },
  productCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  abbr: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  abbrText: {
    fontSize: 10,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});
