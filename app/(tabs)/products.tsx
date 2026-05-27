import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api, useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';
import { useResponsive } from '../../../src/useResponsive';

type Product = { name: string; abbr: string };

export default function ProductsScreen() {
  const { colors } = useTheme();
  const { isDemo } = useAuth();
  const router = useRouter();
  const responsive = useResponsive();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const loadProducts = useCallback(async () => {
    if (isDemo) return;
    try {
      const r = await api.get('/products');
      setProducts(Array.isArray(r.data) ? r.data : []);
    } catch {}
  }, [isDemo]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  const productList = isDemo ? defaultProducts : products.length > 0 ? products : defaultProducts;

  const filteredProducts = productList.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abbr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProductSelection = (abbr: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(abbr)) {
      newSelected.delete(abbr);
    } else {
      newSelected.add(abbr);
    }
    setSelectedProducts(newSelected);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Catálogo de Produtos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: responsive.padding,
          gap: responsive.gap,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Buscar produtos..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={[styles.statsGrid, { gap: responsive.gap }]}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="cube-outline" size={20} color={colors.primary} />
            </View>
            <Text
              style={{
                color: colors.textTertiary,
                fontSize: 12,
                marginTop: 8,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: '700',
                fontSize: 18,
                marginTop: 4,
              }}
            >
              {productList.length}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
            </View>
            <Text
              style={{
                color: colors.textTertiary,
                fontSize: 12,
                marginTop: 8,
              }}
            >
              Selecionados
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: '700',
                fontSize: 18,
                marginTop: 4,
              }}
            >
              {selectedProducts.size}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.statIcon, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="filter-outline" size={20} color={colors.warning} />
            </View>
            <Text
              style={{
                color: colors.textTertiary,
                fontSize: 12,
                marginTop: 8,
              }}
            >
              Filtrados
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: '700',
                fontSize: 18,
                marginTop: 4,
              }}
            >
              {filteredProducts.length}
            </Text>
          </View>
        </View>

        {/* All Products */}
        <View style={{ gap: responsive.gap }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Todos os Produtos
          </Text>

          <View style={[styles.productGrid, { gap: responsive.gap }]}>
            {filteredProducts.map(product => (
              <TouchableOpacity
                key={product.abbr}
                onPress={() => toggleProductSelection(product.abbr)}
                style={[
                  styles.productCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: selectedProducts.has(product.abbr)
                      ? colors.primary
                      : colors.border,
                    borderWidth: selectedProducts.has(product.abbr) ? 2 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.checkBox,
                    {
                      backgroundColor: selectedProducts.has(product.abbr)
                        ? colors.primary
                        : 'transparent',
                      borderColor: selectedProducts.has(product.abbr)
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                >
                  {selectedProducts.has(product.abbr) && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <View style={{ flex: 1, marginTop: 8 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: '700',
                      fontSize: 14,
                    }}
                  >
                    {product.name}
                  </Text>
                  <View style={[styles.abbrChip, { backgroundColor: colors.primary + '22' }]}>
                    <Text
                      style={{
                        color: colors.primary,
                        fontWeight: '700',
                        fontSize: 11,
                      }}
                    >
                      {product.abbr}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {filteredProducts.length === 0 && (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons name="search-outline" size={40} color={colors.textTertiary} />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '600',
                  fontSize: 15,
                  marginTop: 12,
                }}
              >
                Nenhum produto encontrado
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  marginTop: 4,
                  textAlign: 'center',
                }}
              >
                Tente outro termo de busca
              </Text>
            </View>
          )}
        </View>

        {/* Reference Weights */}
        <View style={{ gap: responsive.gap }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Pesos de Referência (Bags)
          </Text>

          <View
            style={[
              styles.productList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {[
              ['Verango', '400 kg/bag'],
              ['Ureia', '700 kg/bag'],
              ['Demais', 'Ver NF'],
            ].map(([name, weight], i, arr) => (
              <View
                key={name}
                style={[
                  styles.productRow,
                  i < arr.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="leaf-outline"
                  size={16}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: 14,
                    flex: 1,
                    fontWeight: '500',
                  }}
                >
                  {name}
                </Text>
                <View style={[styles.weightChip, { backgroundColor: colors.infoBg }]}>
                  <Text
                    style={{
                      color: colors.info,
                      fontWeight: '700',
                      fontSize: 12,
                    }}
                  >
                    {weight}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        {selectedProducts.size > 0 && (
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark-done" size={18} color="#fff" />
            <Text
              style={{
                color: '#fff',
                fontWeight: '700',
                fontSize: 15,
                flex: 1,
                textAlign: 'center',
              }}
            >
              Salvar Seleção ({selectedProducts.size})
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flex: 1,
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productCard: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 12,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abbrChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
  },
  productList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  weightChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
});
