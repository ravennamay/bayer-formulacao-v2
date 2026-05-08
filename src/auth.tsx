import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const getBaseURL = (): string => {
  const envURL = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (envURL && envURL.length > 0) return envURL;
  return 'http://127.0.0.1:8000';
};

const BASE = getBaseURL();
const TOKEN_KEY = 'bayer_auth_token';
const USER_KEY = 'bayer_auth_user';
const REMEMBER_KEY = 'bayer_remember_me';

const DEMO_USERS: Record<string, { password: string; name: string; role: string; id: string }> = {
  'admin@bayer.com': { password: 'admin123', name: 'Administrador', role: 'admin', id: 'demo-admin-001' },
  'operador@bayer.com': { password: 'op123', name: 'Operador Linha', role: 'user', id: 'demo-op-001' },
};

const safeGet = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return await SecureStore.getItemAsync(key);
  } catch {
    try { return await AsyncStorage.getItem(key); } catch { return null; }
  }
};

const safeSet = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value);
  } catch {
    try { await AsyncStorage.setItem(key, value); } catch {}
  }
};

const safeDelete = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  } catch {
    try { await AsyncStorage.removeItem(key); } catch {}
  }
};

export type User = { id: string; email: string; name: string; role: string; isDemo?: boolean; };

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isDemo: boolean;
  api: AxiosInstance;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const api: AxiosInstance = axios.create({ baseURL: BASE + '/api', timeout: 10000 });

const demoLogin = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const demo = DEMO_USERS[email.toLowerCase()];
  if (!demo || demo.password !== password) throw new Error('E-mail ou senha incorretos');
  return {
    token: 'demo-token-' + demo.id + '-' + String(Date.now()),
    user: { id: demo.id, email: email.toLowerCase(), name: demo.name, role: demo.role, isDemo: true },
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const setAuthHeader = useCallback((tk: string | null) => {
    if (tk) { api.defaults.headers.common['Authorization'] = 'Bearer ' + tk; }
    else { delete api.defaults.headers.common['Authorization']; }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tk = await safeGet(TOKEN_KEY);
        const userRaw = await safeGet(USER_KEY);
        if (tk && userRaw) {
          const savedUser: User = JSON.parse(userRaw);
          setAuthHeader(tk); setToken(tk); setUser(savedUser); setIsDemo(!!savedUser.isDemo);
        }
      } catch {
        await safeDelete(TOKEN_KEY); await safeDelete(USER_KEY);
      } finally { setLoading(false); }
    };
    initAuth();
  }, [setAuthHeader]);

  const login = async (email: string, password: string, remember = false) => {
    const cleanEmail = email.trim().toLowerCase();
    let tk: string; let loggedUser: User; let demo = false;
    try {
      const response = await api.post('/auth/login', { email: cleanEmail, password });
      tk = response.data.access_token;
      loggedUser = { ...response.data.user, isDemo: false };
    } catch (err: unknown) {
      const e = err as any;
      const isNetworkError = !e?.response || e.code === 'ERR_NETWORK' || e.message === 'Network Error';
      if (isNetworkError) {
        const result = await demoLogin(cleanEmail, password);
        tk = result.token; loggedUser = result.user; demo = true;
      } else { throw err; }
    }
    setAuthHeader(tk); setToken(tk); setUser(loggedUser); setIsDemo(demo);
    await safeSet(TOKEN_KEY, tk);
    await safeSet(USER_KEY, JSON.stringify(loggedUser));
    if (remember) { await safeSet(REMEMBER_KEY, '1'); } else { await safeDelete(REMEMBER_KEY); }
  };

  const register = async (email: string, password: string, name: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const response = await api.post('/auth/register', { email: cleanEmail, password, name });
      const tk: string = response.data.access_token;
      const newUser: User = { ...response.data.user, isDemo: false };
      setAuthHeader(tk); setToken(tk); setUser(newUser); setIsDemo(false);
      await safeSet(TOKEN_KEY, tk); await safeSet(USER_KEY, JSON.stringify(newUser));
    } catch (err: unknown) {
      const e = err as any;
      const isNetworkError = !e?.response || e.code === 'ERR_NETWORK' || e.message === 'Network Error';
      if (isNetworkError) throw new Error('Servidor nao disponivel. Use: admin@bayer.com / admin123');
      throw err;
    }
  };

  const logout = async () => {
    await safeDelete(TOKEN_KEY); await safeDelete(USER_KEY); await safeDelete(REMEMBER_KEY);
    setAuthHeader(null); setToken(null); setUser(null); setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isDemo, api, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
