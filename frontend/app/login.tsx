import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../src/auth';
import { useTheme } from '../../src/theme';

export default function Login() {
  const { login, register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [focus, setFocus] = useState<'email' | 'password' | 'name' | null>(null);

  const submit = async () => {
    if (loading) return;

    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      Alert.alert('Atenção', 'Informe seu nome.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (mode === 'login') {
        await login(cleanEmail, password);
      } else {
        await register(cleanEmail, password, name.trim());
      }

      router.replace('/(tabs)');
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || 'Falha ao autenticar';

      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  const Input = ({
    icon,
    value,
    setValue,
    placeholder,
    secure = false,
    field,
    keyboardType,
    onSubmit,
  }: any) => (
    <View
      style={[
        styles.input,
        {
          backgroundColor: colors.surface,
          borderColor: focus === field ? colors.primary : colors.border,
          borderWidth: focus === field ? 2 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.textTertiary} />

      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secure}
        autoCapitalize="none"
        keyboardType={keyboardType}
        style={[styles.inputText, { color: colors.textPrimary }]}
        onFocus={() => setFocus(field)}
        onBlur={() => setFocus(null)}
        returnKeyType="next"
        onSubmitEditing={onSubmit}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}
          <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
            <Ionicons name="leaf" size={36} color="#fff" />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>Bayer Produção</Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Controle operacional industrial
          </Text>

          {/* TABS */}
          <View
            style={[styles.tabs, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <TouchableOpacity
              onPress={() => setMode('login')}
              style={[styles.tab, mode === 'login' && { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: mode === 'login' ? '#fff' : colors.textSecondary }}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('register')}
              style={[styles.tab, mode === 'register' && { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: mode === 'register' ? '#fff' : colors.textSecondary }}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>

          {/* NAME */}
          {mode === 'register' && (
            <Input
              icon="person-outline"
              value={name}
              setValue={setName}
              placeholder="Nome"
              field="name"
            />
          )}

          {/* EMAIL */}
          <Input
            icon="mail-outline"
            value={email}
            setValue={setEmail}
            placeholder="E-mail"
            field="email"
            keyboardType="email-address"
          />

          {/* PASSWORD */}
          <View
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: focus === 'password' ? colors.primary : colors.border,
                borderWidth: focus === 'password' ? 2 : 1,
              },
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!showPwd}
              style={[styles.inputText, { color: colors.textPrimary }]}
              onFocus={() => setFocus('password')}
              onBlur={() => setFocus(null)}
              returnKeyType="done"
              onSubmitEditing={submit}
            />

            <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
              <Ionicons
                name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            onPress={submit}
            disabled={loading}
            style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.hint, { color: colors.textTertiary }]}>
            Admin padrão: admin@bayer.com / admin123
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  safe: { flex: 1 },

  scroll: {
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
    paddingTop: 60,
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 6, marginBottom: 24 },

  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    width: '100%',
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    height: 54,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  inputText: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    width: '100%',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  hint: {
    marginTop: 24,
    fontSize: 12,
    textAlign: 'center',
  },
});
