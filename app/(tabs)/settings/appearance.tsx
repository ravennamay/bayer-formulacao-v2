import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../src/theme';
import { useResponsive } from '../../../src/useResponsive';

export default function AppearanceScreen() {
  const { colors, mode, toggle } = useTheme();
  const router = useRouter();
  const responsive = useResponsive();

  const [compactView, setCompactView] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const themeOptions = [
    {
      id: 'light',
      label: 'Claro',
      description: 'Interface clara e brilhante',
      icon: 'sunny-outline',
      color: colors.warning,
    },
    {
      id: 'dark',
      label: 'Escuro',
      description: 'Interface escura para noite',
      icon: 'moon-outline',
      color: colors.primary,
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Aparência</Text>
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
        {/* Theme Selection */}
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
            Tema
          </Text>

          <View style={{ gap: responsive.gap }}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={toggle}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: mode === option.id ? colors.primary : colors.border,
                    borderWidth: mode === option.id ? 2 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.themeIcon,
                    { backgroundColor: option.color + '15' },
                  ]}
                >
                  <Ionicons name={option.icon as any} size={24} color={option.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: '700',
                      fontSize: 15,
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    {option.description}
                  </Text>
                </View>
                {mode === option.id && (
                  <View
                    style={[
                      styles.checkmark,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* View Options */}
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
            Visualização
          </Text>

          <View
            style={[
              styles.optionsList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.optionRow,
                { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Visualização Compacta
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Reduz espaçamento dos elementos
                </Text>
              </View>
              <Switch
                value={compactView}
                onValueChange={setCompactView}
                trackColor={{ false: colors.border, true: colors.primary + '55' }}
                thumbColor={compactView ? colors.primary : colors.textTertiary}
                style={{ marginLeft: 12 }}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Animações
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Transições e movimentos suaves
                </Text>
              </View>
              <Switch
                value={animationsEnabled}
                onValueChange={setAnimationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '55' }}
                thumbColor={animationsEnabled ? colors.primary : colors.textTertiary}
                style={{ marginLeft: 12 }}
              />
            </View>
          </View>
        </View>

        {/* Color Accents */}
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
            Cores de Destaque
          </Text>

          <View
            style={[
              styles.colorGrid,
              {
                gap: responsive.gap,
              },
            ]}
          >
            {[
              { name: 'Azul', color: '#3B82F6' },
              { name: 'Verde', color: '#10B981' },
              { name: 'Roxo', color: '#8B5CF6' },
              { name: 'Rosa', color: '#EC4899' },
              { name: 'Laranja', color: '#F97316' },
              { name: 'Vermelho', color: '#EF4444' },
            ].map((item) => (
              <TouchableOpacity
                key={item.color}
                style={[
                  styles.colorOption,
                  { backgroundColor: item.color },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="checkmark"
                  size={20}
                  color="#fff"
                  style={{ opacity: 0.8 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              marginTop: -8,
            }}
          >
            Personalize a cor principal da interface
          </Text>
        </View>

        {/* Display Info */}
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
            Informações de Exibição
          </Text>

          <View
            style={[
              styles.infoGrid,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.infoItem}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Tema Atual</Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '700',
                  fontSize: 15,
                  marginTop: 4,
                }}
              >
                {mode === 'dark' ? '🌙 Escuro' : '☀️ Claro'}
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border }} />
            <View style={styles.infoItem}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Resolução</Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '700',
                  fontSize: 15,
                  marginTop: 4,
                }}
              >
                {responsive.isMobile ? '📱 Mobile' : responsive.isTablet ? '📊 Tablet' : '💻 Desktop'}
              </Text>
            </View>
          </View>
        </View>

        {/* Accessibility */}
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
            Acessibilidade
          </Text>

          <TouchableOpacity
            style={[
              styles.row,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="text-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '600',
                  fontSize: 15,
                }}
              >
                Tamanho da Fonte
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Tamanho padrão
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.row,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="eye-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '600',
                  fontSize: 15,
                }}
              >
                Contraste
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Padrão
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
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
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
  },
  themeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    flex: 1,
    minWidth: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoItem: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
});
