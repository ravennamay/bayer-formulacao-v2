import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VisualCardProps {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  isOpen: boolean;
  onPress: () => void;
  colors: any;
  children: React.ReactNode;
}

export function VisualCard({
  id,
  icon,
  title,
  subtitle,
  color,
  isOpen,
  onPress,
  colors,
  children,
}: VisualCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={[
          styles.visualCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {/* HEADER COM GRADIENT */}
        <View style={[styles.cardHeader, { backgroundColor: color }]}>
          <View style={styles.cardIconContainer}>
            <Ionicons name={icon} size={24} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
          </View>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#FFFFFF"
          />
        </View>

        {/* CONTENT */}
        {isOpen && (
          <View style={[styles.cardContent, { borderTopColor: colors.border }]}>
            {children}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = require("./theme");
  const { useTheme } = require("./theme");
  const theme = useTheme();
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

export function EmptyState({ icon, title, colors }: any) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={48} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
    </View>
  );
}

export function Badge({ text, color }: { text: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  visualCard: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },

  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },

  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },

  cardContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
  },

  detailRow: {
    marginBottom: 10,
  },

  detailLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 13,
    lineHeight: 18,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
