import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';

export default function ProductionScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Status de Produção</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Status dos Materiais
          </Text>

          <View
            style={[
              styles.statusGrid,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
              },
            ]}
          >
            {[
              {
                label: 'Recebido',
                color: colors.info,
                bg: colors.infoBg,
                icon: 'download-outline',
              },
              {
                label: 'A preparar',
                color: colors.warning,
                bg: colors.warningBg,
                icon: 'time-outline',
              },
              {
                label: 'Preparado',
                color: colors.success,
                bg: colors.successBg,
                icon: 'checkmark-done-circle',
              },
              { label: 'Em fábrica', color: colors.info, bg: colors.infoBg, icon: 'sync-circle' },
            ].map((s, i, arr) => (
              <View
                key={s.label}
                style={[
                  styles.statusItem,
                  i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View style={[styles.statusDot, { backgroundColor: s.bg }]}>
                  <Ionicons name={s.icon as any} size={16} color={s.color} />
                </View>
                <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '500' }}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
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
              styles.weightList,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {[
              { name: 'Verango', weight: '400 kg/bag' },
              { name: 'Ureia', weight: '700 kg/bag' },
              { name: 'Demais', weight: 'Ver NF' },
            ].map((item, i, arr) => (
              <View
                key={item.name}
                style={[
                  styles.weightRow,
                  i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 14, flex: 1 }}>
                  {item.name}
                </Text>
                <View style={[styles.weightChip, { backgroundColor: colors.infoBg }]}>
                  <Text style={{ color: colors.info, fontWeight: '700', fontSize: 12 }}>
                    {item.weight}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
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
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusGrid: { overflow: 'hidden' },
  statusItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  statusDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightList: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  weightRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  weightChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});
