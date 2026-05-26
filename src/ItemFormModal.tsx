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
  const [quantityUnit, setQuantityUnit] = useState('kg');
  const [materialStatus, setMaterialStatus] = useState<string>(MATERIAL_STATUS[0]);
  const [situation, setSituation] = useState<string>(SITUATIONS[1]);
  const [observation, setObservation] = useState('');
  const [products, setProducts] = useState<{ name: string; abbr: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------- Load ----------
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

  // ---------- Fill / Reset ----------
  useEffect(() => {
    if (!visible) return;

    if (initial) {
      setUnit(initial.unit);
      setSc(initial.sc);
      setProduct(initial.product);
      setBatch(initial.batch);
      setQuantity(initial.quantity != null ? String(initial.quantity) : '');
      setQuantityUnit(initial.quantity_unit || 'kg');
      setMaterialStatus(initial.material_status);
      setSituation(initial.situation);
      setObservation(initial.observation || '');
    } else {
      setUnit(UNITS[0]);
      setSc(SCS[0]);
      setProduct('');
      setBatch('');
      setQuantity('');
      setQuantityUnit('kg');
      setMaterialStatus(MATERIAL_STATUS[0]);
      setSituation(SITUATIONS[1]);
      setObservation('');
    }
  }, [visible, initial]);

  // ---------- Filter ----------
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(product.toLowerCase())
  );

  // ---------- Save ----------
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
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
            {/* UNIDADE */}
            <Field label="Unidade" colors={colors}>
              <Chips options={[...UNITS]} value={unit} onChange={setUnit} colors={colors} />
            </Field>

            {/* SC */}
            <Field label="SC" colors={colors}>
              <Chips options={[...SCS]} value={sc} onChange={setSc} colors={colors} />
            </Field>

            {/* PRODUTO */}
            <Field label="Produto" colors={colors}>
              <View
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="flask-outline" size={16} color={colors.textSecondary} />
                <TextInput
                  placeholder="Digite ou selecione"
                  value={product}
                  onChangeText={setProduct}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  style={[styles.inputText, { color: colors.textPrimary }]}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              {showSuggestions && product && filteredProducts.length > 0 && (
                <View style={[styles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  {filteredProducts.slice(0, 5).map(p => (
                    <TouchableOpacity
                      key={p.name}
                      onPress={() => {
                        setProduct(p.name);
                        setShowSuggestions(false);
                      }}
                      style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                    >
                      <Text style={{ color: colors.textPrimary, fontSize: 14 }}>{p.name}</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{p.abbr}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Field>

            {/* LOTE */}
            <Field label="Lote" colors={colors}>
              <View
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="barcode-outline" size={16} color={colors.textSecondary} />
                <TextInput
                  placeholder="Ex: 001/26"
                  value={batch}
                  onChangeText={setBatch}
                  style={[styles.inputText, { color: colors.textPrimary }]}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </Field>

            {/* QUANTIDADE */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field label="Quantidade" colors={colors}>
                  <View
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons name="cube-outline" size={16} color={colors.textSecondary} />
                    <TextInput
                      placeholder="0"
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="decimal-pad"
                      style={[styles.inputText, { color: colors.textPrimary }]}
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>
                </Field>
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Field label="Unidade" colors={colors}>
                  <Chips
                    options={['kg', 'bag', 'l', 'un']}
                    value={quantityUnit}
                    onChange={setQuantityUnit}
                    colors={colors}
                  />
                </Field>
              </View>
            </View>

            {/* STATUS MATERIAL */}
            <Field label="Status do Material" colors={colors}>
              <Chips
                options={MATERIAL_STATUS}
                value={materialStatus}
                onChange={setMaterialStatus}
                colors={colors}
              />
            </Field>

            {/* SITUAÇÃO */}
            <Field label="Situação" colors={colors}>
              <Chips
                options={SITUATIONS}
                value={situation}
                onChange={setSituation}
                colors={colors}
              />
            </Field>

            {/* OBSERVAÇÃO */}
            <Field label="Observação (Opcional)" colors={colors}>
              <View
                style={[
                  styles.input,
                  styles.inputLarge,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} />
                <TextInput
                  placeholder="Adicione notas..."
                  value={observation}
                  onChangeText={setObservation}
                  multiline
                  numberOfLines={3}
                  style={[styles.inputText, styles.inputTextLarge, { color: colors.textPrimary }]}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </Field>

            {/* BOTÃO SALVAR */}
            <TouchableOpacity
              onPress={save}
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Salvar</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ---------- Subcomponents ----------
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
              },
            ]}
          >
            <Text style={{ color: active ? '#fff' : colors.textSecondary }}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { height: '90%', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: '700' },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  chip: { padding: 10, borderRadius: 10, marginRight: 8 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  inputLarge: {
    height: 100,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  inputTextLarge: {
    flex: 1,
    textAlignVertical: 'top',
  },
  suggestions: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
});
