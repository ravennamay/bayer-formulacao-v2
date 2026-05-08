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
            <Field label="Unidade" colors={colors}>
              <Chips options={[...UNITS]} value={unit} onChange={setUnit} colors={colors} />
            </Field>

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
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  label: { fontSize: 12, marginBottom: 8 },
  chip: { padding: 10, borderRadius: 10, marginRight: 8 },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    gap: 8,
  },
});
