import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
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
import { ProductionItem, SCS, SITUATIONS, UNITS } from './types';

type BatchMode = 'single' | 'multi';

type Props = {
  visible: boolean;
  initial?: ProductionItem | null;
  date: string;
  onClose: () => void;
  onSaved: () => void;
};

const parseBatchEntries = (input: string): string[] => {
  const s = input.trim();
  if (!s) return [];
  if (s.includes(',')) {
    return s
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);
  }
  const m = s.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (m) {
    const start = parseInt(m[1], 10);
    const end = parseInt(m[2], 10);
    if (start <= end && end - start <= 50) {
      const len = Math.max(m[1].length, m[2].length);
      return Array.from({ length: end - start + 1 }, (_, i) =>
        String(start + i).padStart(len, '0')
      );
    }
  }
  return [s];
};

export default function ItemFormModal({ visible, initial, date, onClose, onSaved }: Props) {
  const { colors } = useTheme();

  const [unit, setUnit] = useState<string>(UNITS[0]);
  const [sc, setSc] = useState<string>(SCS[0]);
  const [product, setProduct] = useState('');
  const [batch, setBatch] = useState('');
  const [batchMode, setBatchMode] = useState<BatchMode>('single');
  const [batchRange, setBatchRange] = useState('');
  const [quantity, setQuantity] = useState('');
  const [situation, setSituation] = useState<string>(SITUATIONS[0]);
  const [observation, setObservation] = useState('');
  const [products, setProducts] = useState<{ name: string; abbr: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionTop, setSuggestionTop] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const productFieldRef = useRef<View>(null);
  const sheetRef = useRef<View>(null);

  useEffect(() => {
    let mounted = true;
    if (visible) {
      api
        .get('/products')
        .then(r => {
          if (mounted) setProducts(r.data || []);
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
      setSituation(initial.situation);
      setObservation(initial.observation || '');
    } else {
      setUnit(UNITS[0]);
      setSc(SCS[0]);
      setProduct('');
      setBatch('');
      setBatchMode('single');
      setBatchRange('');
      setQuantity('');
      setSituation(SITUATIONS[0]);
      setObservation('');
    }
    setSaveProgress(0);
  }, [visible, initial]);

  const parsedBatches = batchMode === 'multi' ? parseBatchEntries(batchRange) : [];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(product.toLowerCase())
  );

  const buildPayload = (batchNum: string) => ({
    date,
    unit,
    sc,
    product: product.trim(),
    batch: batchNum.trim(),
    quantity: Number(String(quantity).replace(',', '.')),
    quantity_unit: 'bag',
    material_status: 'Disponível',
    situation,
    observation: observation.trim(),
  });

  const save = async () => {
    if (!product.trim()) {
      Alert.alert('Atenção', 'Produto é obrigatório.');
      return;
    }
    const parsedQty = Number(String(quantity).replace(',', '.'));
    if (isNaN(parsedQty) || parsedQty <= 0) {
      Alert.alert('Erro', 'Quantidade deve ser um número maior que zero.');
      return;
    }

    if (batchMode === 'single') {
      if (!batch.trim()) {
        Alert.alert('Atenção', 'Lote é obrigatório.');
        return;
      }
      setSaving(true);
      try {
        if (initial) {
          await api.put(`/items/${initial.id}`, buildPayload(batch));
        } else {
          await api.post('/items', buildPayload(batch));
        }
        onSaved();
        onClose();
      } catch (err: unknown) {
        const msg =
          typeof err === 'object' && err && (err as any)?.response?.data?.detail
            ? (err as any).response.data.detail
            : 'Falha ao salvar';
        Alert.alert('Erro', String(msg));
      } finally {
        setSaving(false);
      }
    } else {
      if (parsedBatches.length === 0) {
        Alert.alert('Atenção', 'Informe os lotes (ex: 038-040 ou 038,039,040).');
        return;
      }
      setSaving(true);
      setSaveProgress(0);
      let errors = 0;
      for (let i = 0; i < parsedBatches.length; i++) {
        try {
          await api.post('/items', buildPayload(parsedBatches[i]));
          setSaveProgress(i + 1);
        } catch {
          errors++;
        }
      }
      setSaving(false);
      if (errors > 0) {
        Alert.alert('Atenção', `${parsedBatches.length - errors} de ${parsedBatches.length} lotes criados. ${errors} falharam.`);
      }
      onSaved();
      onClose();
    }
  };

  const isEditing = !!initial;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View ref={sheetRef} style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {isEditing ? 'Editar item' : 'Novo item'}
              </Text>
              {!isEditing && (
                <Text style={[styles.titleSub, { color: colors.textSecondary }]}>
                  {batchMode === 'multi'
                    ? `${parsedBatches.length} lote${parsedBatches.length !== 1 ? 's' : ''} ${parsedBatches.length > 0 ? '· ' + parsedBatches.join(', ') : ''}`
                    : 'Preencha os campos abaixo'}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <Field label="Unidade" colors={colors}>
              <Chips options={[...UNITS]} value={unit} onChange={setUnit} colors={colors} />
            </Field>

            <Field label="SC" colors={colors}>
              <Chips options={[...SCS]} value={sc} onChange={setSc} colors={colors} />
            </Field>

            {/* Produto */}
            <Field label="Produto" colors={colors}>
              <View
                ref={productFieldRef}
                onLayout={() => {
                  if (productFieldRef.current && sheetRef.current) {
                    productFieldRef.current.measureLayout(
                      sheetRef.current as any,
                      (_x, y) => {
                        setSuggestionTop(y + 52 + 6);
                      },
                      () => {},
                    );
                  }
                }}
              >
                <TextInput
                  value={product}
                  onChangeText={p => {
                    setProduct(p);
                    if (p.length > 0 && productFieldRef.current && sheetRef.current) {
                      productFieldRef.current.measureLayout(
                        sheetRef.current as any,
                        (_x, y) => {
                          setSuggestionTop(y + 52 + 6);
                          setShowSuggestions(true);
                        },
                        () => {},
                      );
                    } else {
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="Digite o nome do produto"
                  placeholderTextColor={colors.textTertiary}
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceElevated, borderColor: colors.border, color: colors.textPrimary },
                  ]}
                />
              </View>
            </Field>

            {/* Lote — single ou multi */}
            {!isEditing && (
              <View style={[styles.modeToggleRow, { borderColor: colors.border }]}>
                {(['single', 'multi'] as BatchMode[]).map(mode => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setBatchMode(mode)}
                    style={[
                      styles.modeBtn,
                      {
                        backgroundColor: batchMode === mode ? colors.primary : 'transparent',
                        borderColor: batchMode === mode ? colors.primary : 'transparent',
                      },
                    ]}
                  >
                    <Ionicons
                      name={mode === 'single' ? 'cube-outline' : 'layers-outline'}
                      size={14}
                      color={batchMode === mode ? '#000' : colors.textSecondary}
                    />
                    <Text
                      style={{
                        color: batchMode === mode ? '#000' : colors.textSecondary,
                        fontSize: 12,
                        fontWeight: batchMode === mode ? '700' : '500',
                        marginLeft: 4,
                      }}
                    >
                      {mode === 'single' ? 'Lote único' : 'Lotes em série'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {batchMode === 'single' || isEditing ? (
              <Field label="Lote" colors={colors}>
                <TextInput
                  value={batch}
                  onChangeText={setBatch}
                  placeholder="Ex: 038"
                  placeholderTextColor={colors.textTertiary}
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceElevated, borderColor: colors.border, color: colors.textPrimary },
                  ]}
                />
              </Field>
            ) : (
              <Field label="Lotes em série" colors={colors}>
                <TextInput
                  value={batchRange}
                  onChangeText={setBatchRange}
                  placeholder="Ex: 038-040 ou 038,039,041"
                  placeholderTextColor={colors.textTertiary}
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceElevated, borderColor: colors.border, color: colors.textPrimary },
                  ]}
                />
                {parsedBatches.length > 0 && (
                  <View
                    style={[
                      styles.batchPreview,
                      { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' },
                    ]}
                  >
                    <Ionicons name="layers" size={14} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600', flex: 1 }}>
                      {parsedBatches.length} lote{parsedBatches.length > 1 ? 's' : ''}: {parsedBatches.slice(0, 6).join(', ')}
                      {parsedBatches.length > 6 ? ` +${parsedBatches.length - 6}` : ''}
                    </Text>
                  </View>
                )}
                <Text style={{ color: colors.textTertiary, fontSize: 11, marginTop: 4 }}>
                  Use traço para sequência (038-040) ou vírgula para avulsos (038,040,042)
                </Text>
              </Field>
            )}

            {/* Quantidade */}
            <Field label="Quantidade (Bags)" colors={colors}>
              <View style={styles.quantityRow}>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                />
                <Text style={[styles.quantityUnit, { color: colors.textSecondary }]}>
                  bag{quantity !== '1' ? 's' : ''}
                </Text>
              </View>
            </Field>

            {/* Situação */}
            <Field label="Situação" colors={colors}>
              <Chips options={[...SITUATIONS]} value={situation} onChange={setSituation} colors={colors} />
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
                    height: 80,
                    textAlignVertical: 'top',
                    paddingTop: 12,
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
              />
            </Field>

            {/* Botão Salvar */}
            <TouchableOpacity
              onPress={save}
              disabled={saving}
              style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.8 : 1 }]}
            >
              {saving ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ActivityIndicator color="#000" size="small" />
                  {batchMode === 'multi' && parsedBatches.length > 1 && (
                    <Text style={[styles.saveBtnText, { color: '#000' }]}>
                      {saveProgress}/{parsedBatches.length} lotes...
                    </Text>
                  )}
                </View>
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#000" />
                  <Text style={[styles.saveBtnText, { color: '#000' }]}>
                    {isEditing
                      ? 'Atualizar'
                      : batchMode === 'multi' && parsedBatches.length > 0
                      ? `Criar ${parsedBatches.length} ite${parsedBatches.length > 1 ? 'ns' : 'm'}`
                      : 'Criar item'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* Dropdown de sugestões — fora do ScrollView para não ser cortado */}
          {showSuggestions && filteredProducts.length > 0 && (
            <View
              style={[
                styles.suggestions,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  top: suggestionTop,
                },
              ]}
              pointerEvents="box-none"
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
                  <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{p.name}</Text>
                  <Text style={{ color: colors.textTertiary, fontSize: 12 }}>{p.abbr}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, children, colors, style }: { label: string; children: React.ReactNode; colors: ThemeColors; style?: object }) {
  return (
    <View style={[{ gap: 6 }, style]}>
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
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: active ? '#000' : colors.textSecondary,
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '92%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  titleSub: {
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
    height: 46,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityUnit: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 50,
  },
  modeToggleRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 3,
    gap: 3,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 9,
    gap: 4,
  },
  batchPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  suggestions: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 220,
    zIndex: 9999,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  suggestion: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
  },
  saveBtnText: {
    fontWeight: '800',
    fontSize: 16,
  },
});
