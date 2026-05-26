import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';

export default function AccountScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View
          style={[
            styles.userBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 20 }}>
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 16 }}>
              {user?.name || 'Usuario'}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{user?.email}</Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text
            style={{
              color: colors.textTertiary,
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Informações do Usuário
          </Text>

          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Função</Text>
              <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                {(user?.role || 'user').toUpperCase()}
              </Text>
            </View>
            <View
              style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: colors.border }]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>E-mail</Text>
              <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13 }}>
                {user?.email}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutButton,
            { backgroundColor: colors.dangerBg, borderColor: colors.danger + '55' },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15 }}>
            Sair da conta
          </Text>
        </TouchableOpacity>
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
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
});
