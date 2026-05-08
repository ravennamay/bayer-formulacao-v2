import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ThemeColors } from './theme';
import { useTheme } from './theme';

// ---------- Types ----------
type ColorKey = keyof ThemeColors;

type StatusConfig = {
  color: ColorKey;
  bg: ColorKey;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

// ---------- Map ----------
const MAP: Record<string, StatusConfig> = {
  Disponível: { color: 'success', bg: 'successBg', icon: 'checkmark-circle' },
  Baixo: { color: 'warning', bg: 'warningBg', icon: 'alert-circle' },
  Indisponível: { color: 'danger', bg: 'dangerBg', icon: 'close-circle' },
  Preparado: { color: 'success', bg: 'successBg', icon: 'checkmark-done-circle' },
  'A preparar': { color: 'warning', bg: 'warningBg', icon: 'time-outline' },
  'Em fábrica': { color: 'info', bg: 'infoBg', icon: 'sync-circle' },
};

// ---------- Component ----------
type Props = {
  label: string;
  testID?: string;
};

export default function StatusPill({ label, testID }: Props) {
  const { colors } = useTheme();

  const cfg: StatusConfig = MAP[label] ?? {
    color: 'textSecondary',
    bg: 'border',
    icon: 'ellipse-outline',
  };

  const fg = colors[cfg.color];
  const bg = colors[cfg.bg];

  return (
    <View testID={testID} style={[styles.pill, { backgroundColor: bg }]}>
      <Ionicons name={cfg.icon} size={13} color={fg} />
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
