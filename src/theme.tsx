import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

export type ThemeColors = {
  background: string; surface: string; surfaceElevated: string;
  surfaceCard: string; border: string; borderLight: string;
  textPrimary: string; textSecondary: string; textTertiary: string; textInverse: string;
  primary: string; primaryDark: string; primaryLight: string; primaryActive: string;
  secondary: string; accent: string;
  danger: string; dangerBg: string; warning: string; warningBg: string;
  success: string; successBg: string; info: string; infoBg: string;
  whatsapp: string; overlay: string;
  cardShadow: string;
};

const DARK: ThemeColors = {
  background: '#07131C',
  surface: '#0D1E2B',
  surfaceElevated: '#122434',
  surfaceCard: '#16293A',
  border: '#1E3A4A',
  borderLight: '#162F3D',
  textPrimary: '#EEF4F8',
  textSecondary: '#7FA8BE',
  textTertiary: '#4A7A8F',
  textInverse: '#07131C',
  primary: '#0FA4AF',
  primaryDark: '#005F73',
  primaryLight: '#94D2BD',
  primaryActive: '#17C3CF',
  secondary: '#009A44',
  accent: '#E9D8A6',
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.15)',
  warning: '#F59E0B',
  warningBg: 'rgba(245,158,11,0.15)',
  success: '#22C55E',
  successBg: 'rgba(34,197,94,0.15)',
  info: '#38BDF8',
  infoBg: 'rgba(56,189,248,0.15)',
  whatsapp: '#25D366',
  overlay: 'rgba(7,19,28,0.8)',
  cardShadow: '#000',
};

const LIGHT: ThemeColors = {
  background: '#F4F8FA',
  surface: '#FFFFFF',
  surfaceElevated: '#EBF4F8',
  surfaceCard: '#FFFFFF',
  border: '#D4E8EF',
  borderLight: '#E8F4F8',
  textPrimary: '#0A2733',
  textSecondary: '#3D7A8A',
  textTertiary: '#7AAABB',
  textInverse: '#FFFFFF',
  primary: '#0A9396',
  primaryDark: '#005F73',
  primaryLight: '#94D2BD',
  primaryActive: '#007B82',
  secondary: '#009A44',
  accent: '#EE9B00',
  danger: '#DC2626',
  dangerBg: 'rgba(220,38,38,0.08)',
  warning: '#D97706',
  warningBg: 'rgba(217,119,6,0.08)',
  success: '#16A34A',
  successBg: 'rgba(22,163,74,0.08)',
  info: '#0284C7',
  infoBg: 'rgba(2,132,199,0.08)',
  whatsapp: '#25D366',
  overlay: 'rgba(10,39,51,0.7)',
  cardShadow: '#8BB4C0',
};

type ThemeContextType = { mode: ThemeMode; colors: ThemeColors; toggle: () => Promise<void>; };
const ThemeContext = createContext<ThemeContextType | null>(null);
const KEY = 'bayer_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  useEffect(() => {
    let m = true;
    AsyncStorage.getItem(KEY).then(v => { if (m && (v === 'dark' || v === 'light')) setMode(v); }).catch(() => {});
    return () => { m = false; };
  }, []);
  const toggle = useCallback(async () => {
    setMode(cur => { const n = cur === 'dark' ? 'light' : 'dark'; AsyncStorage.setItem(KEY, n).catch(() => {}); return n; });
  }, []);
  const colors = useMemo(() => (mode === 'dark' ? DARK : LIGHT), [mode]);
  return <ThemeContext.Provider value={{ mode, colors, toggle }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const c = useContext(ThemeContext);
  if (!c) throw new Error('useTheme must be inside ThemeProvider');
  return c;
};
