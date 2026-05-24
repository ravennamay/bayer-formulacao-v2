import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * StatCard Component
 * Exibe uma estatística com ícone, label e valor
 * Ideal para KPIs como Total, Recebido, Preparado, etc
 */
export function StatCard({ label, value, icon, color, colors }: any) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.statValue, { color: color }]}>
        {value}
      </Text>
    </View>
  );
}

/**
 * ProductBadge Component
 * Mostra abreviação do produto com cor
 */
export function ProductBadge({ abbreviation, color }: { abbreviation: string; color: string }) {
  return (
    <View
      style={[
        styles.productBadge,
        { backgroundColor: color + '20', borderColor: color },
      ]}
    >
      <Text style={[styles.productAbbr, { color }]}>
        {abbreviation}
      </Text>
    </View>
  );
}

/**
 * InfoPair Component
 * Mostra um par label-valor organizado
 */
export function InfoPair({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.infoPair}>
      <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

/**
 * FilterButton Component
 * Botão estilizado para filtros
 */
export function FilterButton({
  text,
  isActive,
  onPress,
  colors,
}: {
  text: string;
  isActive: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterBtn,
        {
          backgroundColor: isActive ? colors.primary : colors.surface,
          borderColor: isActive ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.filterText,
          {
            color: isActive ? '#000' : colors.textSecondary,
            fontWeight: isActive ? '700' : '600',
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * DeleteButton Component
 * Botão de deletar posicionado no canto
 */
export function DeleteButton({
  onPress,
  colors,
}: {
  onPress: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.deleteBtn, { backgroundColor: colors.danger + '15' }]}
    >
      <Ionicons name="trash-outline" size={18} color={colors.danger} />
    </TouchableOpacity>
  );
}

/**
 * ProductCardHeader Component
 * Header do card com badge + nome + lote
 */
export function ProductCardHeader({
  product,
  abbreviation,
  batch,
  color,
  colors,
}: {
  product: string;
  abbreviation: string;
  batch: string;
  color: string;
  colors: any;
}) {
  return (
    <View style={styles.productHeader}>
      <ProductBadge abbreviation={abbreviation} color={color} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.productName, { color: colors.textPrimary }]}>
          {product}
        </Text>
        <Text style={[styles.batchInfo, { color: colors.textSecondary }]}>
          Lote {batch}
        </Text>
      </View>
    </View>
  );
}

/**
 * ModernCard Component
 * Card estilizado moderno com barra colorida no topo
 */
export function ModernCard({
  color,
  colors,
  children,
  onDeletePress,
}: {
  color: string;
  colors: any;
  children: React.ReactNode;
  onDeletePress?: () => void;
}) {
  return (
    <View
      style={[
        styles.modernCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.cardHeaderBar, { backgroundColor: color }]} />

      <View style={styles.cardMainContent}>
        {children}
      </View>

      {onDeletePress && <DeleteButton onPress={onDeletePress} colors={colors} />}
    </View>
  );
}

/* ========== STYLES ========== */

const styles = StyleSheet.create({
  statCard: {
    width: 100,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    gap: 8,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  productBadge: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productAbbr: {
    fontSize: 13,
    fontWeight: '700',
  },

  infoPair: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
  },

  filterText: {
    fontSize: 12,
  },

  deleteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modernCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },

  cardHeaderBar: {
    height: 4,
  },

  cardMainContent: {
    padding: 14,
    gap: 12,
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },

  batchInfo: {
    fontSize: 12,
  },
});
