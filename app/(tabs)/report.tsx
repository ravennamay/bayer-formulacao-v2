import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../src/auth';
import { useTheme } from '../../src/theme';
import { formatDateLabel, todayISO } from '../../src/types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const buildLast14Days = (): string[] => {
  const out: string[] = [];
  const base = new Date();

  for (let i = 13; i >= 0; i--) {
    const dt = new Date(base);
    dt.setDate(base.getDate() - i);

    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');

    out.push(`${yyyy}-${mm}-${dd}`);
  }

  return out;
};

export default function ReportScreen() {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [date, setDate] = useState(todayISO());
  const [text, setText] = useState('');
  const [greeting, setGreeting] = useState('');
  const [count, setCount] = useState(0);
  const [extraObs, setExtraObs] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportFormat, setReportFormat] = useState<'whatsapp' | 'text'>('text');

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.post('/reports/whatsapp', {
        date,
        extra_observations: extraObs,
      });

      setText(r.data.text || '');
      setGreeting(r.data.greeting || '');
      setCount(r.data.count || 0);
    } catch {
      Alert.alert('Erro', 'Falha ao gerar relatório');
    } finally {
      setLoading(false);
    }
  }, [date, extraObs]);

  useFocusEffect(
    useCallback(() => {
      generate();
    }, [generate])
  );

  const copy = async () => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado', 'Relatório copiado para a área de transferência.');
  };

  const shareWhats = async () => {
    if (!text) return;

    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    }
  };

  const exportAsText = async () => {
    if (!text) return;

    try {
      const filename = `relatorio_${date}.txt`;
      const target = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(target, text, { encoding: 'utf8' });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(target, {
          mimeType: 'text/plain',
          dialogTitle: 'Exportar relatório',
        });
      } else {
        Alert.alert('Arquivo salvo', `Relatório em: ${target}`);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Falha ao exportar relatório');
    }
  };

  const dates = buildLast14Days();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Relatórios
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {formatDateLabel(date)} · {count} {count === 1 ? 'material' : 'materiais'} · {greeting}
            </Text>
          </View>

          <TouchableOpacity
            testID="refresh-report"
            onPress={generate}
            style={[
              styles.iconBtn,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            ]}
          >
            {loading ? (
              <ActivityIndicator size={18} color={colors.primary} />
            ) : (
              <Ionicons name="refresh" size={18} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
        >
          {dates.map(d => {
            const active = d === date;
            const [y, m, dd] = d.split('-');
            const dt = new Date(Number(y), Number(m) - 1, Number(dd));

            return (
              <TouchableOpacity
                key={d}
                testID={`rdate-${d}`}
                onPress={() => setDate(d)}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? '#fff' : colors.textTertiary,
                    fontSize: 10,
                    fontWeight: '600',
                  }}
                >
                  {dt.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3).toUpperCase()}
                </Text>
                <Text
                  style={{
                    color: active ? '#fff' : colors.textPrimary,
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  {dd}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Observations Input */}
        <View
          style={[
            styles.obsRow,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="create-outline" size={16} color={colors.textTertiary} />
          <TextInput
            testID="extra-obs"
            value={extraObs}
            onChangeText={setExtraObs}
            placeholder="Observações extras (opcional)"
            placeholderTextColor={colors.textTertiary}
            onBlur={generate}
            style={[styles.obsInput, { color: colors.textPrimary }]}
          />
        </View>

        {/* Format Tabs */}
        <View style={styles.formatTabs}>
          <TouchableOpacity
            onPress={() => setReportFormat('text')}
            style={[
              styles.formatTab,
              {
                backgroundColor: reportFormat === 'text' ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={14}
              color={reportFormat === 'text' ? '#fff' : colors.textSecondary}
            />
            <Text
              style={{
                color: reportFormat === 'text' ? '#fff' : colors.textSecondary,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              Texto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setReportFormat('whatsapp')}
            style={[
              styles.formatTab,
              {
                backgroundColor: reportFormat === 'whatsapp' ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="logo-whatsapp"
              size={14}
              color={reportFormat === 'whatsapp' ? '#fff' : colors.textSecondary}
            />
            <Text
              style={{
                color: reportFormat === 'whatsapp' ? '#fff' : colors.textSecondary,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              WhatsApp
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Preview */}
        <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
          <View
            style={[
              styles.preview,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.previewHeader, { borderBottomColor: colors.border }]}>
              <Ionicons
                name={reportFormat === 'whatsapp' ? 'logo-whatsapp' : 'document-text-outline'}
                size={14}
                color={reportFormat === 'whatsapp' ? '#25D366' : colors.primary}
              />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 11,
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                {reportFormat === 'whatsapp' ? 'Prévia' : 'Relatório'}
              </Text>
            </View>

            {loading ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : text ? (
              <Text
                testID="report-text"
                style={[styles.previewText, { color: colors.textPrimary }]}
              >
                {text}
              </Text>
            ) : (
              <Text
                style={{
                  color: colors.textTertiary,
                  padding: 16,
                  fontStyle: 'italic',
                }}
              >
                Nenhum material para esta data.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View
          style={[
            styles.actions,
            { backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity
            testID="copy-report"
            onPress={copy}
            disabled={!text}
            style={[
              styles.btn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: text ? 1 : 0.5,
              },
            ]}
          >
            <Ionicons name="copy-outline" size={16} color={colors.primary} />
            <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 14 }}>
              Copiar
            </Text>
          </TouchableOpacity>

          {reportFormat === 'whatsapp' && (
            <TouchableOpacity
              testID="share-whatsapp"
              onPress={shareWhats}
              disabled={!text}
              style={[
                styles.btn,
                {
                  backgroundColor: '#25D366',
                  opacity: text ? 1 : 0.5,
                  flex: 1,
                },
              ]}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                Enviar
              </Text>
            </TouchableOpacity>
          )}

          {reportFormat === 'text' && (
            <TouchableOpacity
              onPress={exportAsText}
              disabled={!text}
              style={[
                styles.btn,
                {
                  backgroundColor: colors.primary,
                  opacity: text ? 1 : 0.5,
                  flex: 1,
                },
              ]}
            >
              <Ionicons name="download-outline" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                Exportar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },

  title: { fontSize: 20, fontWeight: '800', marginBottom: 4 },

  subtitle: { fontSize: 12, fontWeight: '500' },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  dateStrip: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },

  dateChip: {
    width: 50,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    gap: 2,
  },

  obsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 12,
    marginBottom: 10,
  },

  obsInput: { flex: 1, fontSize: 14 },

  formatTabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 12,
  },

  formatTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },

  scrollBody: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },

  preview: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
  },

  previewText: {
    padding: 14,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
});
