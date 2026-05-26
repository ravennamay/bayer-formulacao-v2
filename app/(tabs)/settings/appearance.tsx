import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';

export default function AppearanceScreen() {
  const { colors, mode, toggle } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Aparência</Text>
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
            Tema
          </Text>

          <TouchableOpacity
            onPress={toggle}
            style={[styles.themeButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.themeIconWrap}>
              <Ionicons
                name={mode === 'dark' ? 'moon' : 'sunny'}
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 15 }}>
                Modo {mode === 'dark' ? 'Escuro' : 'Claro'}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Toque para alternar o tema
              </Text>
            </View>

            <View
              style={[
                styles.themeIndicator,
                { backgroundColor: mode === 'dark' ? colors.primary : colors.textTertiary },
              ]}
            />
          </TouchableOpacity>
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
            Informações do Tema
          </Text>

          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Tema Atual</Text>
              <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                {mode === 'dark' ? '🌙 Escuro' : '☀️ Claro'}
              </Text>
            </View>
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
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
});
