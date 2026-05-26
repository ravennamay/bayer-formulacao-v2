import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';

export default function ProductsSettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Produtos</Text>
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
            Catálogo de Produtos
          </Text>

          <View
            style={[
              styles.placeholder,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="cube-outline" size={48} color={colors.textTertiary} />
            <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>
              Seus produtos aparecerão aqui
            </Text>
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
  placeholder: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
