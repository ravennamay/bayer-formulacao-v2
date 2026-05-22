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

import { useTheme } from '../../src/theme';
import { api } from '../../src/auth';

export default function ForgotPassword() {
  const { colors, mode } = useTheme();
  const router = useRouter();

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const requestReset = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });

      Alert.alert('Solicitação enviada', 'Se o e-mail existir, o token foi gerado no servidor.');

      setStep('reset');
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.detail || 'Falha na solicitação');
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    if (!token.trim() || !newPwd.trim()) {
      Alert.alert('Atenção', 'Informe token e nova senha.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token: token.trim(),
        new_password: newPwd,
      });

      Alert.alert('Sucesso', 'Senha redefinida com sucesso.', [
        { text: 'OK', onPress: () => router.replace('/login') },
      ]);
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.detail || 'Falha ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.textPrimary }]}>Recuperar senha</Text>

          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <View style={[styles.iconBox, { backgroundColor: colors.primary + '22' }]}>
            <Ionicons name="key-outline" size={32} color={colors.primary} />
          </View>

          <Text style={[styles.hero, { color: colors.textPrimary }]}>
            {step === 'request' ? 'Esqueceu sua senha?' : 'Redefinir senha'}
          </Text>

          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            {step === 'request'
              ? 'Informe seu e-mail para gerar um token.'
              : 'Use o token para criar nova senha.'}
          </Text>

          {/* EMAIL STEP */}
          {step === 'request' && (
            <>
              <Text style={[styles.label, { color: colors.textSecondary }]}>E-mail</Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@bayer.com"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                  },
                ]}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TouchableOpacity
                disabled={loading}
                onPress={requestReset}
                style={[
                  styles.button,
                  { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Enviar</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* RESET STEP */}
          {step === 'reset' && (
            <>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Token</Text>

              <TextInput
                value={token}
                onChangeText={setToken}
                placeholder="Digite o token"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                  },
                ]}
              />

              <Text style={[styles.label, { color: colors.textSecondary }]}>Nova senha</Text>

              <TextInput
                value={newPwd}
                onChangeText={setNewPwd}
                placeholder="Nova senha"
                secureTextEntry
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                  },
                ]}
              />

              <TouchableOpacity
                disabled={loading}
                onPress={reset}
                style={[
                  styles.button,
                  { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Redefinir</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep('request')}>
                <Text style={{ color: colors.secondary, marginTop: 12 }}>Voltar</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },

  title: { fontSize: 16, fontWeight: '700' },

  body: {
    padding: 20,
    alignItems: 'center',
  },

  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  hero: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  sub: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },

  label: {
    alignSelf: 'flex-start',
    fontSize: 11,
    marginBottom: 6,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  button: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
