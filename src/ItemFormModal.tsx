import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { api } from './auth';
import type { ThemeColors } from './theme';
import { useTheme } from './theme';
import { MATERIAL_STATUS, ProductionItem, SCS, SITUATIONS, UNITS } from './types';

type Props = {
  visible: boolean;
  initial?: ProductionItem | null;
  date: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function ItemFormModal({ visible, initial, date, onClose, onSaved }: Props) {
  const { colors } = useTheme();

  const [unit, setUnit] = useState<string>(UNITS[0]);
  const [sc, setSc] = useState<string>(SCS[0]);
  const [product, setProduct] = useState('');
  const [batch, setBatch] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('bag');
  const [materialStatus, setMaterialStatus] = useState<string>(MATERIAL_STATUS[0]);
  const [situation, setSituation] = useState<string>(SITUATIONS[1]);
  const [observation, setObservation] = useState('');
  const [products, setProducts] = useState<{ name: string; abbr: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (visible) {
      api
        .get('/products')
        .then(r => {
          if (mounted) setProducts(r.data);
        })
        .catch(() => {});
    }

    return () => {
      mounted = false;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    if (initial) {
      setUnit(initial.unit);
      setSc(initial.sc);
      setProduct(initial.product);
      setBatch(initial.batch);
      setQuantity(initial.quantity != null ? String(initial.quantity) : '');
      setQuantityUnit(initial.quantity_unit || 'bag');
      setMaterialStatus(initial.material_status);
      setSituation(initial.situation);
      setObservation(initial.observation || '');
    } else {
      setUnit(UNITS[0]);
      setSc(SCS[0]);
      setProduct('');
      setBatch('');
      setQuantity('');
      setQuantityUnit('bag');
      setMaterialStatus(MATERIAL_STATUS[0]);
      setSituation(SITUATIONS[1]);
      setObservation('');
    }
  }, [visible, initial]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(product.toLowerCase())
  );

  const save = async () => {
    if (!product.trim() || !batch.trim()) {
      Alert.alert('Atenção', 'Produto e lote são obrigatórios.');
      return;
    }

    const parsedQty = quantity ? Number(quantity.replace(',', '.')) : null;

    if (parsedQty !== null && isNaN(parsedQty)) {
      Alert.alert('Erro', 'Quantidade inválida');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        date,
        unit,
        sc,
        product: product.trim(),
        batch: batch.trim(),
        quantity: parsedQty,
        quantity_unit: quantityUnit,
        material_status: materialStatus,
        situation,
        observation: observation.trim(),
      };

      if (initial) {
        await api.put(`/items/${initial.id}`, payload);
      } else {
        await api.post('/items', payload);
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err && (err as any)?.response?.data?.detail
          ? (err as any).response.data.detail
          : 'Falha ao salvar';

      Alert.alert('Erro', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {initial ? 'Editar item' : 'Novo item'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
            {/* Unidade */}
            <Field label="Unidade" colors={colors}>
              <Chips options={[...UNITS]} value={unit} onChange={setUnit} colors={colors} />
            </Field>

            {/* SC */}
            <Field label="SC" colors={colors}>
              <Chips options={[...SCS]} value={sc} onChange={setSc} colors={colors} />
            </Field>

            {/* Produto */}
            <Field label="Produto" colors={colors}>
              <View>
                <TextInput
                  value={product}
                  onChangeText={p => {
                    setProduct(p);
                    setShowSuggestions(p.length > 0);
                  }}
                  placeholder="Digite o nome do produto"
                  placeholderTextColor={colors.textTertiary}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                />

                {showSuggestions && filteredProducts.length > 0 && (
                  <View
                    style={[
                      styles.suggestions,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {filteredProducts.slice(0, 5).map(p => (
                      <TouchableOpacity
                        key={p.name}
                        onPress={() => {
                          setProduct(p.name);
                          setShowSuggestions(false);
                        }}
                        style={[styles.suggestion, { borderBottomColor: colors.border }]}
                      >
                        <Text style={{ color: colors.textPrimary, fontWeight: '500' }}>
                          {p.name}
                        </Text>
                        <Text style={{ color: colors.textTertiary, fontSize: 12 }}>
                          {p.abbr}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </Field>

            {/* Lote */}
            <Field label="Lote" colors={colors}>
              <TextInput
                value={batch}
                onChangeText={setBatch}
                placeholder="Ex: 038, 042, etc"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
              />
            </Field>

            {/* Quantidade */}
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 2 }}>
                  <Field label="Quantidade" colors={colors}>
                    <TextInput
                      value={quantity}
                      onChangeText={setQuantity}
                      placeholder="0"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="decimal-pad"
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.surfaceElevated,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        },
                      ]}
                    />
                  </Field>
                </View>

                <View style={{ flex: 1 }}>
                  <Field label="Unidade" colors={colors}>
                    <Chips
                      options={['bag', 'kg', 'L']}
                      value={quantityUnit}
                      onChange={setQuantityUnit}
                      colors={colors}
                    />
                  </Field>
                </View>
              </View>
            </View>

            {/* Status do Material */}
            <Field label="Status do Material" colors={colors}>
              <Chips
                options={[...MATERIAL_STATUS]}
                value={materialStatus}
                onChange={setMaterialStatus}
                colors={colors}
              />
            </Field>

            {/* Situação */}
            <Field label="Situação" colors={colors}>
              <Chips
                options={[...SITUATIONS]}
                value={situation}
                onChange={setSituation}
                colors={colors}
              />
            </Field>

            {/* Observação */}
            <Field label="Observação (opcional)" colors={colors}>
              <TextInput
                value={observation}
                onChangeText={setObservation}
                placeholder="Adicionar anotação..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
              />
            </Field>

            {/* Save Button */}
            <TouchableOpacity
              onPress={save}
              disabled={saving}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: saving ? 0.7 : 1,
                },
              ]}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                    {initial ? 'Atualizar' : 'Criar item'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ThemeColors;
}) {
  return (
    <View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      {children}
    </View>
  );
}

function Chips({
  options,
  value,
  onChange,
  colors,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  colors: ThemeColors;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
      {options.map(opt => {
        const active = value === opt;

        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: active ? '#fff' : colors.textSecondary,
                fontWeight: active ? '700' : '500',
                fontSize: 12,
              }}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },

  sheet: {
    height: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    height: 44,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
  },

  suggestions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    borderRadius: 10,
    borderWidth: 1,
    maxHeight: 200,
    zIndex: 1000,
  },

  suggestion: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },

  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
});
