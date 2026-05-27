import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';
import { useResponsive } from '../../../src/useResponsive';

export default function AccountScreen() {
  const { colors } = useTheme();
  const { user, isDemo } = useAuth();
  const router = useRouter();
  const responsive = useResponsive();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Minha Conta</Text>
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
        {isDemo && (
          <View
            style={[
              styles.demoAlert,
              { backgroundColor: colors.warningBg, borderColor: colors.warning + '44' },
            ]}
          >
            <Ionicons name="warning-outline" size={16} color={colors.warning} />
            <Text style={[{ color: colors.warning, fontSize: 13 }, styles.flexText]}>
              Modo demonstração. Edições não serão salvas.
            </Text>
          </View>
        )}

        {/* Profile Section */}
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
            Perfil
          </Text>
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                padding: responsive.padding,
              },
            ]}
          >
            <View style={{ alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <View style={[styles.largeAvatar, { backgroundColor: colors.primary }]}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 32 }}>
                  {(name || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 17 }}>
                  {name || 'Usuário'}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                  {email}
                </Text>
              </View>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: colors.successBg },
                ]}
              >
                <Text
                  style={{
                    color: colors.success,
                    fontWeight: '700',
                    fontSize: 12,
                  }}
                >
                  {(user?.role || 'USER').toUpperCase()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={[
                styles.button,
                { backgroundColor: isEditing ? colors.dangerBg : colors.primary },
              ]}
            >
              <Ionicons
                name={isEditing ? 'close' : 'pencil-outline'}
                size={18}
                color={isEditing ? colors.danger : '#fff'}
              />
              <Text
                style={{
                  color: isEditing ? colors.danger : '#fff',
                  fontWeight: '700',
                  fontSize: 15,
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isEditing && (
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
              Editar Informações
            </Text>

            <View style={{ gap: 12 }}>
              <View style={{ gap: 4 }}>
                <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                  Nome
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
                  placeholder="Seu nome"
                  placeholderTextColor={colors.textTertiary}
                  value={name}
                  onChangeText={isDemo ? () => {} : setName}
                />
              </View>

              <View style={{ gap: 4 }}>
                <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                  Email
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.textSecondary,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="Email"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  pointerEvents="none"
                  contextMenuHidden
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.button,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="checkmark-done" size={18} color="#fff" />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: 15,
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                Salvar Mudanças
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Account Info */}
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
            Informações da Conta
          </Text>

          <View
            style={[
              styles.infoList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {[
              { label: 'ID do Usuário', value: user?.id?.slice(0, 12) + '...' || '-' },
              { label: 'Tipo de Conta', value: isDemo ? 'Demonstração' : 'Padrão' },
              { label: 'Status', value: 'Ativo' },
            ].map((item, i, arr) => (
              <View
                key={item.label}
                style={[
                  styles.infoRow,
                  i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  {item.label}
                </Text>
                <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 14 }}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
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
            Ações da Conta
          </Text>

          <TouchableOpacity
            disabled={isDemo}
            style={[
              styles.button,
              {
                backgroundColor: colors.dangerBg,
                opacity: isDemo ? 0.5 : 1,
              },
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text
              style={{
                color: colors.danger,
                fontWeight: '700',
                fontSize: 15,
                flex: 1,
                textAlign: 'center',
              }}
            >
              Deletar Conta
            </Text>
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
  demoAlert: {
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
  profileCard: {
    borderRadius: 14,
    borderWidth: 1,
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  infoList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
});
