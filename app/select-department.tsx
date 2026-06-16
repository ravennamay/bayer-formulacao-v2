import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/auth';
import { useTheme } from '../src/theme';

type Department = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  color: string;
  disabled?: boolean;
};

const DEPARTMENTS: Department[] = [
  {
    id: 'buffer-preparacao',
    label: 'Buffer – Preparação',
    icon: 'cube-outline',
    description: 'Preparação e armazenamento temporário',
    color: '#1565C0',
  },
  {
    id: 'formulacao',
    label: 'Formulação',
    icon: 'flask-outline',
    description: 'Mistura e formulação de defensivos',
    color: '#0D7A3E',
    disabled: true,
  },
  {
    id: 'herbicidas',
    label: 'Herbicidas',
    icon: 'leaf-outline',
    description: 'Produção e envase de herbicidas',
    color: '#6A1B9A',
    disabled: true,
  },
];

export default function SelectDepartment() {
  const { updateDepartment, user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    if (!selected) {
      Alert.alert('Atenção', 'Escolha seu setor para continuar.');
      return;
    }
    setLoading(true);
    try {
      await updateDepartment(selected);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o setor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const skip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: '#0D7A3E20' }]}>
            <Ionicons name="business-outline" size={32} color="#0D7A3E" />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Qual é o seu setor?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {user?.name ? `Olá, ${user.name.split(' ')[0]}! ` : ''}Escolha onde você trabalha para personalizar sua experiência.
          </Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {DEPARTMENTS.map(dept => {
            const isSelected = selected === dept.id;
            const isDisabled = !!dept.disabled;
            return (
              <TouchableOpacity
                key={dept.id}
                onPress={() => !isDisabled && setSelected(dept.id)}
                activeOpacity={isDisabled ? 1 : 0.82}
                disabled={isDisabled}
                style={[
                  styles.option,
                  {
                    backgroundColor: isDisabled
                      ? colors.surface
                      : isSelected ? dept.color + '15' : colors.surface,
                    borderColor: isDisabled
                      ? colors.border
                      : isSelected ? dept.color : colors.border,
                    borderWidth: isSelected && !isDisabled ? 2 : 1,
                    shadowColor: isSelected && !isDisabled ? dept.color : '#000',
                    opacity: isDisabled ? 0.45 : 1,
                  },
                ]}
              >
                <View style={[styles.optionIcon, { backgroundColor: isDisabled ? colors.border + '40' : dept.color + '20' }]}>
                  <Ionicons name={dept.icon} size={28} color={isDisabled ? colors.textTertiary : dept.color} />
                </View>
                <View style={styles.optionText}>
                  <View style={styles.optionLabelRow}>
                    <Text style={[styles.optionLabel, { color: isDisabled ? colors.textTertiary : isSelected ? dept.color : colors.textPrimary }]}>
                      {dept.label}
                    </Text>
                    {isDisabled && (
                      <View style={styles.soonBadge}>
                        <Text style={styles.soonText}>Em breve</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                    {dept.description}
                  </Text>
                </View>
                {!isDisabled && (
                  <View style={[
                    styles.checkCircle,
                    {
                      borderColor: isSelected ? dept.color : colors.border,
                      backgroundColor: isSelected ? dept.color : 'transparent',
                    },
                  ]}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={confirm}
            disabled={loading || !selected}
            activeOpacity={0.88}
            style={[
              styles.confirmBtn,
              {
                backgroundColor: selected
                  ? (DEPARTMENTS.find(d => d.id === selected)?.color ?? '#0D7A3E')
                  : colors.border,
                opacity: loading ? 0.7 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.confirmText}>Confirmar setor</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={skip} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.textTertiary }]}>
              Pular por enquanto
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },

  options: {
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
    gap: 3,
  },
  optionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  optionDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  soonBadge: {
    backgroundColor: '#9E9E9E22',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  soonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 0.3,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actions: {
    gap: 8,
    paddingTop: 8,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
