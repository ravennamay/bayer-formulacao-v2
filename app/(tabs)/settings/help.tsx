import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';
import { PremiumCard } from '../../../src/components/Premium/PremiumCard';
import { SectionHeader } from '../../../src/components/Premium/SectionHeader';

interface FAQItem {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export default function HelpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      title: 'Como faço para alterar minha senha?',
      content: 'Vá para Segurança > Alterar Senha e siga as instruções.',
      icon: 'lock-closed',
    },
    {
      id: '2',
      title: 'O que é autenticação de dois fatores?',
      content:
        '2FA adiciona uma camada extra de segurança exigindo um código do seu telefone.',
      icon: 'shield-checkmark',
    },
    {
      id: '3',
      title: 'Como faço backup dos meus dados?',
      content:
        'Vá para Sistema > Fazer Backup para baixar todos os seus dados.',
      icon: 'download',
    },
    {
      id: '4',
      title: 'Qual é a política de privacidade?',
      content:
        'Seus dados são criptografados e nunca compartilhados com terceiros.',
      icon: 'lock',
    },
  ];

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
          Ajuda & Suporte
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Options */}
        <SectionHeader
          title="Precisa de Ajuda?"
          colors={colors}
        />

        <View style={styles.supportGrid}>
          <TouchableOpacity
            style={[
              styles.supportCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              Alert.alert(
                'Centro de Ajuda',
                'Abrir centro de ajuda completo em seu navegador?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Abrir', onPress: () => {} },
                ]
              )
            }
          >
            <View
              style={[
                styles.supportIcon,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Ionicons
                name="help-circle"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.supportTitle, { color: colors.textPrimary }]}>
              Central de Ajuda
            </Text>
            <Text style={[styles.supportText, { color: colors.textSecondary }]}>
              Documentação e tutoriais
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.supportCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              Alert.alert(
                'Contato',
                'Abrir e-mail de suporte?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Enviar E-mail', onPress: () => {} },
                ]
              )
            }
          >
            <View
              style={[
                styles.supportIcon,
                { backgroundColor: colors.info + '20' },
              ]}
            >
              <Ionicons
                name="mail"
                size={24}
                color={colors.info}
              />
            </View>
            <Text style={[styles.supportTitle, { color: colors.textPrimary }]}>
              Entrar em Contato
            </Text>
            <Text style={[styles.supportText, { color: colors.textSecondary }]}>
              Suporte direto por e-mail
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <SectionHeader
          title="Perguntas Frequentes"
          colors={colors}
        />

        <View style={{ gap: 10 }}>
          {faqItems.map((item) => (
            <PremiumCard
              key={item.id}
              colors={colors}
              variant="outlined"
              padding={0}
            >
              <TouchableOpacity
                onPress={() =>
                  setExpandedFAQ(
                    expandedFAQ === item.id ? null : item.id
                  )
                }
                style={styles.faqHeader}
              >
                <View
                  style={[
                    styles.faqIcon,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={16}
                    color={colors.primary}
                  />
                </View>

                <Text
                  style={[
                    styles.faqTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  {item.title}
                </Text>

                <Ionicons
                  name={
                    expandedFAQ === item.id
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>

              {expandedFAQ === item.id && (
                <View
                  style={[
                    styles.faqContent,
                    { borderTopColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.faqAnswer,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.content}
                  </Text>
                </View>
              )}
            </PremiumCard>
          ))}
        </View>

        {/* Feedback */}
        <SectionHeader
          title="Feedback"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={14} gap={12}>
          <Text style={[styles.feedbackText, { color: colors.textSecondary }]}>
            Sua opinião é importante para melhorar o aplicativo. Compartilhe suas sugestões e relatórios de bugs.
          </Text>

          <TouchableOpacity
            style={[
              styles.feedbackButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() =>
              Alert.alert(
                'Enviar Feedback',
                'Abrir formulário de feedback?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Enviar', onPress: () => {} },
                ]
              )
            }
          >
            <Ionicons name="star" size={18} color="#fff" />
            <Text style={styles.feedbackButtonText}>
              Enviar Feedback
            </Text>
          </TouchableOpacity>
        </PremiumCard>

        {/* Legal */}
        <SectionHeader
          title="Legal"
          colors={colors}
        />

        <PremiumCard colors={colors} variant="outlined" padding={0}>
          <TouchableOpacity
            style={styles.legalRow}
            onPress={() =>
              Alert.alert(
                'Termos de Serviço',
                'Abrir termos em seu navegador?'
              )
            }
          >
            <Text style={[styles.legalText, { color: colors.textPrimary }]}>
              Termos de Serviço
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.legalRow,
              { borderTopColor: colors.border, borderTopWidth: 1 },
            ]}
            onPress={() =>
              Alert.alert(
                'Política de Privacidade',
                'Abrir política em seu navegador?'
              )
            }
          >
            <Text style={[styles.legalText, { color: colors.textPrimary }]}>
              Política de Privacidade
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </PremiumCard>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Obrigado por usar Bayer Preparação
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
  supportGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  supportCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  supportText: {
    fontSize: 11,
    textAlign: 'center',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  faqIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  faqContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  legalText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
});
