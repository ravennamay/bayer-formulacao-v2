import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ── Platform-aware token storage ──────────────────────────────────────────────
// expo-secure-store silently fails on web. On web we use localStorage (persistent)
// or sessionStorage (session-only) depending on the "remember me" flag.
const webTokenStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? null;
    } catch { return null; }
  },
  set(key: string, value: string, persistent: boolean): void {
    try {
      if (persistent) {
        localStorage.setItem(key, value);
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    } catch {}
  },
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch {}
    try { sessionStorage.removeItem(key); } catch {}
  },
};

function resolveBase(): string {
  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    return process.env.EXPO_PUBLIC_BACKEND_URL;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://bayer-formulacao.onrender.com';
}

const BASE = resolveBase();

console.log('BASE:', BASE);
const TOKEN_KEY = 'bayer_auth_token';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  matricula?: string;
  department?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  api: AxiosInstance;
  isDemo: boolean;
  login: (identifier: string, password: string, remember?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string, matricula?: string) => Promise<void>;
  updateDepartment: (department: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const api = axios.create({
  baseURL: `${BASE.replace(/\/$/, '')}/api`,
  timeout: 20000,
});

/**
 * Wrapper seguro para evitar crash em versões quebradas do SecureStore
 */
const safeSecureStore = {
  get: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  set: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // fallback silencioso
    }
  },
  remove: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // fallback silencioso (evita crash do app)
    }
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const setAuthHeader = (tk: string | null) => {
    if (tk) {
      api.defaults.headers.common['Authorization'] = `Bearer ${tk}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // ── Helpers: platform-aware read/write/remove ─────────────────────────────
  const readToken = async (): Promise<string | null> => {
    if (Platform.OS === 'web') return webTokenStorage.get(TOKEN_KEY);
    return safeSecureStore.get(TOKEN_KEY);
  };

  const writeToken = async (tk: string, persistent = true): Promise<void> => {
    if (Platform.OS === 'web') { webTokenStorage.set(TOKEN_KEY, tk, persistent); return; }
    await safeSecureStore.set(TOKEN_KEY, tk);
  };

  const clearToken = async (): Promise<void> => {
    if (Platform.OS === 'web') { webTokenStorage.remove(TOKEN_KEY); return; }
    await safeSecureStore.remove(TOKEN_KEY);
  };

  useEffect(() => {
    (async () => {
      try {
        const tk = await readToken();

        if (tk) {
          setAuthHeader(tk);
          setToken(tk);

          const r = await api.get('/auth/me');
          setUser(r.data);
        }
      } catch {
        setAuthHeader(null);
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (identifier: string, password: string, remember = true) => {
    const r = await api.post('/auth/login', { identifier, password });

    const tk = r.data.access_token as string;

    await writeToken(tk, remember);

    setAuthHeader(tk);
    setToken(tk);
    setUser(r.data.user);
  };

  const register = async (email: string, password: string, name: string, matricula?: string) => {
    const r = await api.post('/auth/register', {
      email,
      password,
      name,
      ...(matricula ? { matricula } : {}),
    });

    const tk = r.data.access_token as string;

    await writeToken(tk, true);

    setAuthHeader(tk);
    setToken(tk);
    setUser(r.data.user);
  };

  const updateDepartment = async (department: string) => {
    const r = await api.patch('/auth/me', { department });
    setUser(prev => prev ? { ...prev, department: r.data.department } : prev);
  };

  const logout = async () => {
    await clearToken();

    setAuthHeader(null);
    setToken(null);
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, api, isDemo, login, register, updateDepartment, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
