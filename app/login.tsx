import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import safeAsyncStorage from '../src/utils/safeAsyncStorage';
import { useAuth } from '../src/auth';
import { BAYER_LOGO_URL, useTheme } from '../src/theme';

const REMEMBER_KEY = 'bayer_remember';
const REMEMBER_ID_KEY = 'bayer_remember_id';

type AuthMode = 'login' | 'register';

export default function Login() {
  const { login, register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    loadRememberData();
  }, []);

  const loadRememberData = async () => {
    try {
      const rememberValue = await safeAsyncStorage.getItem(REMEMBER_KEY);
      const savedId = await safeAsyncStorage.getItem(REMEMBER_ID_KEY);
      const shouldRemember = rememberValue !== '0';
      setRemember(shouldRemember);
      if (shouldRemember && savedId) {
        setIdentifier(savedId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submit = async () => {
    if (!identifier || !password) {
      Alert.alert('Atenção', 'Preencha o identificador e senha.');
      return;
    }
    if (authMode === 'register' && !name.trim()) {
      Alert.alert('Atenção', 'Informe seu nome.');
      return;
    }
    setLoading(true);
    try {
      if (authMode === 'login') {
        await login(identifier.trim(), password);
        await safeAsyncStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
        if (remember) {
          await safeAsyncStorage.setItem(REMEMBER_ID_KEY, identifier.trim());
        } else {
          await safeAsyncStorage.removeItem(REMEMBER_ID_KEY);
        }
        router.replace('/(tabs)');
      } else {
        const emailVal = identifier.trim().toLowerCase();
        await register(
          emailVal,
          password,
          name.trim(),
          matricula.trim() || undefined,
        );
        await safeAsyncStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
        if (remember) {
          await safeAsyncStorage.setItem(REMEMBER_ID_KEY, emailVal);
        }
        router.replace('/select-department');
      }
    } catch (e: any) {
      console.log(e);
      const detail = e?.response?.data?.detail;
      const msg =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((d: any) => d?.msg || JSON.stringify(d)).join(' ')
            : e?.message?.includes('Network')
              ? 'Sem conexão com o servidor.'
              : 'Falha ao autenticar';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── GRADIENT HERO ────────────────────────────────────── */}
          <LinearGradient
            colors={['#6BAD1C', colors.primary, colors.primaryActive]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* subtle dark veil so white text pops without shadow */}
            <View style={styles.heroVeil} pointerEvents="none" />

            {/* thematic science / agro icons scattered */}
            <View style={styles.patternOverlay} pointerEvents="none">
              <Ionicons name="flask-outline"       size={28} color="#fff" style={{ position:'absolute', top: 14,  left: 18,  opacity: 0.13, transform:[{rotate:'-15deg'}] }} />
              <Ionicons name="leaf-outline"        size={22} color="#fff" style={{ position:'absolute', top: 52,  right: 24, opacity: 0.12, transform:[{rotate:'20deg'}] }} />
              <Ionicons name="cellular-outline"    size={32} color="#fff" style={{ position:'absolute', top: 10,  right: 60, opacity: 0.10 }} />
              <Ionicons name="aperture-outline"    size={20} color="#fff" style={{ position:'absolute', top: 80,  left: 46,  opacity: 0.10, transform:[{rotate:'30deg'}] }} />
              <Ionicons name="pulse-outline"       size={26} color="#fff" style={{ position:'absolute', bottom:30, left:14,  opacity: 0.11 }} />
              <Ionicons name="git-network-outline" size={24} color="#fff" style={{ position:'absolute', bottom:18, right:30, opacity: 0.12, transform:[{rotate:'-10deg'}] }} />
              <Ionicons name="planet-outline"      size={18} color="#fff" style={{ position:'absolute', bottom:50, left:80,  opacity: 0.09 }} />
              <Ionicons name="flask-outline"       size={16} color="#fff" style={{ position:'absolute', top: 30,  left:140,  opacity: 0.08, transform:[{rotate:'40deg'}] }} />
            </View>

            <View style={styles.heroContent}>
              <View style={styles.logoWrap}>
                <Image
                  source={{ uri: BAYER_LOGO_URL }}
                  style={styles.logoImg}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.heroTitle}>Preparação</Text>
              <Text style={styles.heroSub}>Bayer · Controle Operacional</Text>

              <View style={styles.heroBadgeRow}>
                <Ionicons name="flask-outline" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.heroBadgeText}>PRODUÇÃO INDUSTRIAL</Text>
              </View>
            </View>
          </LinearGradient>

          {/* ── FORM CARD ─────────────────────────────────────────── */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: '#0B5E30',
              },
            ]}
          >
            {/* Auth mode tabs */}
            <View
              style={[
                styles.tabs,
                { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
              ]}
            >
              {(['login', 'register'] as AuthMode[]).map(m => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setAuthMode(m)}
                  style={[
                    styles.tab,
                    authMode === m && { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons
                    name={m === 'login' ? 'log-in-outline' : 'person-add-outline'}
                    size={14}
                    color={authMode === m ? '#fff' : colors.textSecondary}
                  />
                  <Text style={{ color: authMode === m ? '#fff' : colors.textSecondary, fontWeight: '700', fontSize: 13 }}>
                    {m === 'login' ? 'Entrar' : 'Criar conta'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              {authMode === 'login' ? 'Bem-vindo de volta' : 'Criar nova conta'}
            </Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
              {authMode === 'login'
                ? 'Acesse sua planilha operacional'
                : 'Cadastre-se para colaborar com o turno'}
            </Text>

            {/* Fields */}
            {authMode === 'register' && (
              <Field label="Nome completo" colors={colors}>
                <Input
                  icon="person-outline"
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                  colors={colors}
                />
              </Field>
            )}

            <Field label={authMode === 'login' ? 'E-mail ou Matrícula' : 'E-mail'} colors={colors}>
              <Input
                icon={authMode === 'login' ? 'person-outline' : 'mail-outline'}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder={authMode === 'login' ? 'seu@bayer.com ou matrícula' : 'seu@bayer.com'}
                autoCapitalize="none"
                keyboardType="email-address"
                colors={colors}
              />
            </Field>

            {authMode === 'register' && (
              <Field label="Matrícula (opcional)" colors={colors}>
                <Input
                  icon="id-card-outline"
                  value={matricula}
                  onChangeText={setMatricula}
                  placeholder="Ex: 16071"
                  autoCapitalize="none"
                  keyboardType="default"
                  colors={colors}
                />
              </Field>
            )}

            <Field label="Senha" colors={colors}>
              <Input
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPwd}
                colors={colors}
                rightIcon={showPwd ? 'eye-off-outline' : 'eye-outline'}
                onRightPress={() => setShowPwd(s => !s)}
              />
            </Field>

            {/* Remember + Forgot */}
            <View style={styles.rowBetween}>
              <View style={styles.rememberRow}>
                <Switch
                  value={remember}
                  onValueChange={setRemember}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Lembrar de mim</Text>
              </View>
              {authMode === 'login' && (
                <Link href="/forgot-password" asChild>
                  <TouchableOpacity>
                    <Text style={{ color: colors.secondary, fontWeight: '600', fontSize: 13 }}>
                      Esqueci a senha
                    </Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>

            {/* CTA button */}
            <TouchableOpacity
              onPress={submit}
              disabled={loading}
              activeOpacity={0.88}
              style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name={authMode === 'login' ? 'log-in-outline' : 'person-add-outline'}
                    size={18}
                    color="#fff"
                  />
                  <Text style={[styles.buttonText, { color: '#fff' }]}>
                    {authMode === 'login' ? 'Entrar' : 'Criar conta'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Footer info */}
            <View style={[styles.footerInfo, { borderTopColor: colors.border }]}>
              <Ionicons name="shield-checkmark-outline" size={13} color={colors.textTertiary} />
              <Text style={{ color: colors.textTertiary, fontSize: 11, flex: 1 }}>
                Acesso restrito a colaboradores Bayer autorizados
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = { label: string; children: React.ReactNode; colors: any };

function Field({ label, children, colors }: FieldProps) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      {children}
    </View>
  );
}

type InputProps = TextInputProps & {
  icon: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  colors: any;
};

function Input({ icon, rightIcon, onRightPress, colors, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        styles.input,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: focused ? colors.primary : colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={focused ? colors.primary : colors.textTertiary} />
      <TextInput
        {...props}
        placeholderTextColor={colors.textTertiary}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={[styles.inputText, { color: colors.textPrimary }]}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightPress} hitSlop={10}>
          <Ionicons name={rightIcon} size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },

  heroGradient: {
    paddingTop: 44,
    paddingBottom: 52,
    paddingHorizontal: 24,
    overflow: 'hidden',
    position: 'relative',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroVeil: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,30,0,0.14)',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  heroContent: {
    alignItems: 'center',
    gap: 6,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
    padding: 10,
  },
  logoImg: { width: '100%', height: '100%' },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.90)',
    fontWeight: '600',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 6,
  },
  heroBadgeText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '800',
    letterSpacing: 1,
  },

  card: {
    marginHorizontal: 16,
    marginTop: -24,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },

  tabs: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 14,
    marginTop: 16,
  },
  buttonText: {
    fontWeight: '800',
    fontSize: 16,
    textAlignVertical: 'center',
  },

  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
});
