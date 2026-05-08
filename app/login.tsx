import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/auth';
import BayerLogo from '../src/BayerLogo';

export default function Login() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const emailRef = useRef<TextInput>(null);
  const pwdRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);

  const clearErr = (f: string) => setErrors(p => { const n = { ...p }; delete n[f]; return n; });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'E-mail obrigatorio';
    else if (!email.includes('@')) e.email = 'E-mail invalido';
    if (!password) e.password = 'Senha obrigatoria';
    else if (password.length < 4) e.password = 'Minimo 4 caracteres';
    if (tab === 'register' && !name.trim()) e.name = 'Nome obrigatorio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (loading || !validate()) return;
    setLoading(true);
    try {
      if (tab === 'login') await login(email.trim().toLowerCase(), password, rememberMe);
      else await register(email.trim().toLowerCase(), password, name.trim());
      router.replace('/(tabs)');
    } catch (err: unknown) {
      let msg = 'Falha ao autenticar';
      if (typeof err === 'object' && err !== null) {
        const e = err as any;
        const d = e?.response?.data?.detail;
        if (typeof d === 'string') msg = d;
        else if (Array.isArray(d)) msg = d.map((x: any) => x?.msg || JSON.stringify(x)).join(' ');
        else if (e.message) msg = e.message;
      }
      Alert.alert('Erro', msg);
    } finally { setLoading(false); }
  };

  return (
    <View style={S.root}>
      <LinearGradient
        colors={['#12C2C2', '#0A9396', '#006070', '#003344']}
        locations={[0, 0.3, 0.65, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={S.gradient}
      />
      <SafeAreaView style={S.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={S.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={S.scroll}
            keyboardShouldPersistTaps={Platform.OS === 'web' ? 'always' : 'handled'}
            showsVerticalScrollIndicator={false}
          >
            <View style={S.logoSection}>
              <View style={S.logoRing}>
                <View style={S.logoInnerRing}>
                  <View style={S.logoBg}>
                    <BayerLogo size={66} />
                  </View>
                </View>
              </View>
              <Text style={S.appTitle}>Formulação</Text>
              <Text style={S.appSubtitle}>Sistema de Controle Industrial</Text>
            </View>

            <View style={S.tabRow}>
              <TouchableOpacity
                onPress={() => { setTab('login'); setErrors({}); }}
                style={tab === 'login' ? [S.tabBtn, S.tabBtnActive] : S.tabBtn}
                activeOpacity={0.8}
              >
                <Text style={tab === 'login' ? [S.tabTxt, S.tabTxtActive] : S.tabTxt}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setTab('register'); setErrors({}); }}
                style={tab === 'register' ? [S.tabBtn, S.tabBtnActive] : S.tabBtn}
                activeOpacity={0.8}
              >
                <Text style={tab === 'register' ? [S.tabTxt, S.tabTxtActive] : S.tabTxt}>Criar conta</Text>
              </TouchableOpacity>
            </View>

            <View style={S.form}>
              {tab === 'register' && (
                <View>
                  <View style={errors.name ? [S.field, S.fieldError] : S.field}>
                    <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.65)" />
                    <TextInput
                      ref={nameRef}
                      value={name}
                      onChangeText={v => { setName(v); clearErr('name'); }}
                      placeholder="Nome completo"
                      placeholderTextColor="rgba(255,255,255,0.45)"
                      style={S.fieldInput}
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                  </View>
                  {errors.name ? <Text style={S.errTxt}>{errors.name}</Text> : null}
                </View>
              )}

              <View>
                <View style={errors.email ? [S.field, S.fieldError] : S.field}>
                  <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.65)" />
                  <TextInput
                    ref={emailRef}
                    value={email}
                    onChangeText={v => { setEmail(v); clearErr('email'); }}
                    placeholder="E-mail"
                    placeholderTextColor="rgba(255,255,255,0.45)"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    style={S.fieldInput}
                    returnKeyType="next"
                    onSubmitEditing={() => pwdRef.current?.focus()}
                  />
                </View>
                {errors.email ? <Text style={S.errTxt}>{errors.email}</Text> : null}
              </View>

              <View>
                <View style={errors.password ? [S.field, S.fieldError] : S.field}>
                  <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.65)" />
                  <TextInput
                    ref={pwdRef}
                    value={password}
                    onChangeText={v => { setPassword(v); clearErr('password'); }}
                    placeholder="Senha"
                    placeholderTextColor="rgba(255,255,255,0.45)"
                    secureTextEntry={!showPwd}
                    style={S.fieldInput}
                    returnKeyType="done"
                    onSubmitEditing={submit}
                  />
                  <TouchableOpacity onPress={() => setShowPwd(s => !s)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={18} color="rgba(255,255,255,0.65)" />
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={S.errTxt}>{errors.password}</Text> : null}
              </View>

              {tab === 'login' && (
                <View style={S.remRow}>
                  <Switch
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    thumbColor={rememberMe ? '#fff' : 'rgba(255,255,255,0.5)'}
                    trackColor={{ false: 'rgba(0,0,0,0.3)', true: 'rgba(255,255,255,0.35)' }}
                  />
                  <TouchableOpacity onPress={() => setRememberMe(r => !r)} style={S.remLabel}>
                    <Text style={S.remTxt}>Lembrar de mim</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={S.forgotBtn}
                    onPress={() => Alert.alert('Recuperacao de Senha', 'Entre em contato com o administrador do sistema.')}
                  >
                    <Text style={S.forgotTxt}>Esqueceu?</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                onPress={submit}
                disabled={loading}
                style={loading ? [S.submitBtn, S.submitBtnDisabled] : S.submitBtn}
                activeOpacity={0.88}
              >
                {loading
                  ? <ActivityIndicator color="#0A9396" />
                  : <Text style={S.submitTxt}>{tab === 'login' ? 'Entrar' : 'Criar conta'}</Text>
                }
              </TouchableOpacity>

              {tab === 'login' && (
                <View style={S.hintRow}>
                  <Ionicons name="information-circle-outline" size={14} color="rgba(255,255,255,0.5)" />
                  <Text style={S.hintTxt}>Demo: admin@bayer.com / admin123</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const S = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#003344',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safe: {
    flex: 1,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 36,
    gap: 14,
  },
  logoRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  logoInnerRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  logoBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
  appTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.8,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 16,
    padding: 5,
    marginBottom: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  tabTxt: {
    fontWeight: '600',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  tabTxtActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  form: {
    gap: 12,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  fieldError: {
    borderColor: 'rgba(255,100,100,0.7)',
  },
  fieldInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
  },
  errTxt: {
    fontSize: 12,
    color: 'rgba(255,160,160,0.9)',
    marginTop: 5,
    marginLeft: 6,
  },
  remRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  remLabel: {
    flex: 1,
  },
  remTxt: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '500',
  },
  forgotBtn: {
    paddingVertical: 4,
  },
  forgotTxt: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A9396',
    letterSpacing: 0.3,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  hintTxt: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
  },
});
