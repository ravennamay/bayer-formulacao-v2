import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';
import { PremiumCard } from '../../../src/components/Premium/PremiumCard';
import { PremiumInput } from '../../../src/components/Premium/PremiumInput';
import { SectionHeader } from '../../../src/components/Premium/SectionHeader';

function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password || password.length < 8) return 'weak';
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strengthScore = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (strengthScore < 2) return 'weak';
  if (strengthScore < 3) return 'medium';
  return 'strong';
}

export default function PasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = useMemo(
    () => getPasswordStrength(newPassword),
    [newPassword]
  );

  const validatePasswords = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Digite sua senha atual';
    }

    if (!newPassword) {
      newErrors.newPassword = 'Digite uma nova senha';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua nova senha';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não correspondem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      // Simulação de requisição
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Alterar Senha
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Password */}
        <SectionHeader
          title="Senha Atual"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <View style={{ padding: 14 }}>
            <PremiumInput
              colors={colors}
              icon="lock-closed"
              isPassword
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              error={errors.currentPassword}
            />
          </View>
        </PremiumCard>

        {/* New Password */}
        <SectionHeader
          title="Nova Senha"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <View style={{ padding: 14, gap: 12 }}>
            <PremiumInput
              colors={colors}
              icon="lock-closed"
              isPassword
              placeholder="Digite sua nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              strength={newPassword ? passwordStrength : undefined}
              error={errors.newPassword}
            />

            {/* Password Requirements */}
            {newPassword && (
              <View style={{ gap: 8 }}>
                <Text
                  style={[
                    styles.requirementsTitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Requisitos de Senha:
                </Text>

                <View style={{ gap: 6 }}>
                  {[
                    {
                      text: 'Mínimo 8 caracteres',
                      met: newPassword.length >= 8,
                    },
                    {
                      text: 'Letras maiúsculas e minúsculas',
                      met: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
                    },
                    {
                      text: 'Números',
                      met: /[0-9]/.test(newPassword),
                    },
                    {
                      text: 'Caracteres especiais',
                      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                        newPassword
                      ),
                    },
                  ].map((req, i) => (
                    <View key={i} style={styles.requirementRow}>
                      <Ionicons
                        name={req.met ? 'checkmark-circle' : 'ellipse'}
                        size={14}
                        color={
                          req.met ? colors.success : colors.textTertiary
                        }
                      />
                      <Text
                        style={[
                          styles.requirementText,
                          {
                            color: req.met
                              ? colors.textPrimary
                              : colors.textSecondary,
                          },
                        ]}
                      >
                        {req.text}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </PremiumCard>

        {/* Confirm Password */}
        <SectionHeader
          title="Confirmar Senha"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <View style={{ padding: 14 }}>
            <PremiumInput
              colors={colors}
              icon="lock-closed"
              isPassword
              placeholder="Digite sua senha novamente"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
            />
          </View>
        </PremiumCard>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={loading || !currentPassword || !newPassword || !confirmPassword}
          style={[
            styles.submitButton,
            {
              backgroundColor:
                loading || !currentPassword || !newPassword || !confirmPassword
                  ? colors.textTertiary + '40'
                  : colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.submitText,
              {
                color:
                  loading || !currentPassword || !newPassword || !confirmPassword
                    ? colors.textTertiary
                    : '#fff',
              },
            ]}
          >
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </Text>
          {!loading && (
            <Ionicons
              name="arrow-forward"
              size={18}
              color={
                !currentPassword || !newPassword || !confirmPassword
                  ? colors.textTertiary
                  : '#fff'
              }
            />
          )}
        </TouchableOpacity>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Sua senha será alterada imediatamente
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
});
