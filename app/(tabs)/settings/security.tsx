import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../src/theme';
import { useResponsive } from '../../../src/useResponsive';

export default function SecurityScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const responsive = useResponsive();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    Alert.alert('Sucesso', 'Senha alterada com sucesso');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Segurança</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: responsive.padding,
          gap: responsive.gap,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Password Section */}
        <View style={{ gap: responsive.gap }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Senha
          </Text>

          <TouchableOpacity
            onPress={() => setShowChangePassword(!showChangePassword)}
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '700',
                  fontSize: 15,
                }}
              >
                Alterar Senha
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                Atualize sua senha regularmente
              </Text>
            </View>
            <Ionicons
              name={showChangePassword ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          {showChangePassword && (
            <View style={{ gap: responsive.gap }}>
              <View style={{ gap: 4 }}>
                <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                  Senha Atual
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={true}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
              </View>

              <View style={{ gap: 4 }}>
                <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                  Nova Senha
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="Digite a nova senha"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <View style={{ gap: 4 }}>
                <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                  Confirmar Senha
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="Confirme a nova senha"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={true}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <View style={{ gap: 8, flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowChangePassword(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      flex: 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: '700',
                      fontSize: 14,
                    }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePasswordChange}
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.primary,
                      flex: 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: 14,
                    }}
                  >
                    Alterar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View
            style={[
              styles.passwordStrength,
              { backgroundColor: colors.infoBg, borderColor: colors.info + '55' },
            ]}
          >
            <Ionicons name="information-circle-outline" size={16} color={colors.info} />
            <Text style={[{ color: colors.info, fontSize: 12 }, styles.flexText]}>
              Use uma combinação de maiúsculas, minúsculas, números e símbolos
            </Text>
          </View>
        </View>

        {/* Two-Factor Authentication */}
        <View style={{ gap: responsive.gap }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Autenticação Dupla
          </Text>

          <View
            style={[
              styles.optionsList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View
              style={[styles.optionRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Autenticação em Duas Etapas
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Adiciona camada extra de segurança
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '55' }}
                thumbColor={twoFactorEnabled ? colors.primary : colors.textTertiary}
                style={{ marginLeft: 12 }}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Autenticação Biométrica
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Impressão digital ou reconhecimento facial
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '55' }}
                thumbColor={biometricEnabled ? colors.primary : colors.textTertiary}
                style={{ marginLeft: 12 }}
              />
            </View>
          </View>
        </View>

        {/* Active Sessions */}
        <View style={{ gap: responsive.gap }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Sessões Ativas
          </Text>

          <View
            style={[
              styles.sessionList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {[
              {
                device: 'iPhone 12',
                location: 'São Paulo, Brasil',
                lastActive: 'Agora',
                current: true,
              },
              {
                device: 'MacBook Pro',
                location: 'São Paulo, Brasil',
                lastActive: '2 horas atrás',
                current: false,
              },
              {
                device: 'Chrome',
                location: 'São Paulo, Brasil',
                lastActive: '1 dia atrás',
                current: false,
              },
            ].map((session, index, arr) => (
              <View
                key={index}
                style={[
                  styles.sessionRow,
                  index < arr.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.deviceIcon,
                    {
                      backgroundColor:
                        session.device === 'iPhone 12'
                          ? colors.primary + '15'
                          : colors.success + '15',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      session.device === 'iPhone 12' ? 'phone-portrait-outline' : 'laptop-outline'
                    }
                    size={18}
                    color={session.device === 'iPhone 12' ? colors.primary : colors.success}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontWeight: '700',
                        fontSize: 14,
                      }}
                    >
                      {session.device}
                    </Text>
                    {session.current && (
                      <View style={[styles.currentBadge, { backgroundColor: colors.successBg }]}>
                        <Text
                          style={{
                            color: colors.success,
                            fontWeight: '600',
                            fontSize: 10,
                          }}
                        >
                          ATUAL
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {session.location}
                  </Text>
                  <Text
                    style={{
                      color: colors.textTertiary,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {session.lastActive}
                  </Text>
                </View>
                {!session.current && (
                  <TouchableOpacity
                    style={[styles.logoutBtn, { backgroundColor: colors.dangerBg }]}
                  >
                    <Ionicons name="close" size={16} color={colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Login Activity */}
        <View style={{ gap: responsive.gap }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Histórico de Login
          </Text>

          <TouchableOpacity
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: '700',
                  fontSize: 15,
                }}
              >
                Ver Histórico
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Últimos 30 dias de atividade
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
    flex: 1,
    textAlign: 'center',
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  flexText: {
    flex: 1,
  },
  optionsList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  sessionList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  logoutBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
