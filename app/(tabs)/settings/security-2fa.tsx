import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { SectionHeader } from '../../../src/components/Premium/SectionHeader';
import { PremiumInput } from '../../../src/components/Premium/PremiumInput';

export default function TwoFactorScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnable2FA = () => {
    setShowSetup(true);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Erro', 'Digite um código de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIs2FAEnabled(true);
      setShowSetup(false);
      setVerificationCode('');
      Alert.alert('Sucesso', '2FA foi ativado com segurança');
    } catch (error) {
      Alert.alert('Erro', 'Código inválido. Tente novamente');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = () => {
    Alert.alert(
      'Desativar 2FA',
      'Desativar autenticação de dois fatores reduz a segurança da sua conta. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: () => {
            setIs2FAEnabled(false);
            Alert.alert('Sucesso', '2FA foi desativado');
          },
        },
      ]
    );
  };

  if (showSetup && !is2FAEnabled) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => setShowSetup(false)}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Configurar 2FA
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Setup Instructions */}
          <SectionHeader
            title="Etapa 1: Escanear QR Code"
            colors={colors}
          />

          <PremiumCard colors={colors} variant="filled" padding={20} gap={16}>
            <Text
              style={[
                styles.instructionText,
                { color: colors.textSecondary },
              ]}
            >
              Abra um aplicativo authenticador (Google Authenticator, Authy, Microsoft Authenticator) e escaneie o código QR abaixo:
            </Text>

            {/* Simulated QR Code */}
            <View
              style={[
                styles.qrCodePlaceholder,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="qr-code"
                size={64}
                color={colors.primary}
              />
              <Text
                style={[
                  styles.qrText,
                  { color: colors.textSecondary },
                ]}
              >
                QR Code
              </Text>
            </View>

            <View
              style={[
                styles.copyableCode,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.codeText,
                  { color: colors.textPrimary },
                ]}
              >
                XVKQ-7J3K-M9NL-2PQR-5STU
              </Text>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons
                  name="copy"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </PremiumCard>

          {/* Verification */}
          <SectionHeader
            title="Etapa 2: Verificar Código"
            colors={colors}
          />

          <PremiumCard colors={colors} variant="outlined" padding={0}>
            <View style={{ padding: 14, gap: 12 }}>
              <Text
                style={[
                  styles.instructionText,
                  { color: colors.textSecondary },
                ]}
              >
                Digite o código de 6 dígitos do seu aplicativo authenticador:
              </Text>

              <PremiumInput
                colors={colors}
                placeholder="000000"
                value={verificationCode}
                onChangeText={(text) =>
                  setVerificationCode(text.replace(/[^0-9]/g, '').slice(0, 6))
                }
                maxLength={6}
                keyboardType="number-pad"
              />
            </View>
          </PremiumCard>

          {/* Backup Codes Warning */}
          <PremiumCard colors={colors} variant="outlined" padding={12} gap={10}>
            <View style={styles.warningRow}>
              <Ionicons
                name="alert"
                size={16}
                color={colors.warning}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.warningTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  Guarde seus códigos de backup
                </Text>
                <Text
                  style={[
                    styles.warningText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Salve em um local seguro para recuperar sua conta
                </Text>
              </View>
            </View>
          </PremiumCard>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading || verificationCode.length !== 6}
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  loading || verificationCode.length !== 6
                    ? colors.textTertiary + '40'
                    : colors.success,
              },
            ]}
          >
            <Text
              style={[
                styles.submitText,
                {
                  color:
                    loading || verificationCode.length !== 6
                      ? colors.textTertiary
                      : '#fff',
                },
              ]}
            >
              {loading ? 'Verificando...' : 'Ativar 2FA'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          Autenticação de Dois Fatores
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <PremiumCard colors={colors} variant="filled" padding={14} gap={12}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusIcon,
                {
                  backgroundColor: is2FAEnabled
                    ? colors.success + '20'
                    : colors.warning + '20',
                },
              ]}
            >
              <Ionicons
                name={is2FAEnabled ? 'shield-checkmark' : 'warning'}
                size={20}
                color={is2FAEnabled ? colors.success : colors.warning}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.statusTitle,
                  { color: colors.textPrimary },
                ]}
              >
                {is2FAEnabled ? '2FA Ativado' : '2FA Desativado'}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  { color: colors.textSecondary },
                ]}
              >
                {is2FAEnabled
                  ? 'Sua conta está protegida com autenticação de dois fatores'
                  : 'Adicione uma camada extra de segurança'}
              </Text>
            </View>
          </View>
        </PremiumCard>

        {/* What is 2FA */}
        <SectionHeader
          title="Sobre 2FA"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={14} gap={12}>
          {[
            {
              title: 'Proteção Extra',
              description:
                'Além da sua senha, você precisará de um código do seu telefone',
              icon: 'phone-portrait',
            },
            {
              title: 'Aplicativos Suportados',
              description:
                'Google Authenticator, Authy, Microsoft Authenticator e outros',
              icon: 'apps',
            },
            {
              title: 'Códigos de Backup',
              description:
                'Guarde códigos de emergência para acessar sua conta se perder o telefone',
              icon: 'save',
            },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.primary + '20' },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.featureTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.featureText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </PremiumCard>

        {/* Action Button */}
        {!is2FAEnabled ? (
          <TouchableOpacity
            onPress={handleEnable2FA}
            style={[
              styles.actionButton,
              { backgroundColor: colors.success },
            ]}
          >
            <Ionicons name="lock" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Ativar 2FA</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleDisable2FA}
            style={[
              styles.actionButton,
              { backgroundColor: colors.danger },
            ]}
          >
            <Ionicons name="trash" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Desativar 2FA</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          2FA adiciona segurança máxima à sua conta
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
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    marginTop: 2,
  },
  instructionText: {
    fontSize: 13,
  },
  qrCodePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrText: {
    fontSize: 12,
  },
  copyableCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  codeText: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  copyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 11,
    marginTop: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  featureText: {
    fontSize: 11,
    marginTop: 2,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  actionButtonText: {
    color: '#fff',
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
