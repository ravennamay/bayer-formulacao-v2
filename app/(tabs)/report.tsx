import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../src/auth';
import BayerLogo from '../../src/BayerLogo';
import { useTheme } from '../../src/theme';
import { ProductionItem, todayISO } from '../../src/types';

const SEP = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500';
const BULLET = '\u2022';

const DEMO_ITEMS = [
  { id:'d1', date:'', unit:'Everest' as any, sc:'SC1', product:'Verango', product_abbr:'VER', batch:'000/26', quantity:400, quantity_unit:'kg', material_status:'Disponível' as any, situation:'Preparado', observation:'parte A', created_at:'', updated_at:'' },
  { id:'d2', date:'', unit:'Everest' as any, sc:'SC1', product:'Verango', product_abbr:'VER', batch:'000/26', quantity:400, quantity_unit:'kg', material_status:'Disponível' as any, situation:'A preparar', observation:'', created_at:'', updated_at:'' },
  { id:'d3', date:'', unit:'Everest' as any, sc:'SC5', product:'Fox Xpro', product_abbr:'FXX', batch:'143/26', quantity:2400, quantity_unit:'kg', material_status:'Disponível' as any, situation:'A preparar', observation:'', created_at:'', updated_at:'' },
  { id:'d4', date:'', unit:'Everest' as any, sc:'SC5', product:'Fox Xpro', product_abbr:'FXX', batch:'144/26', quantity:2400, quantity_unit:'kg', material_status:'Disponível' as any, situation:'A preparar', observation:'', created_at:'', updated_at:'' },
  { id:'d5', date:'', unit:'Fênix' as any, sc:'SC3', product:'Nativo', product_abbr:'NAT', batch:'113/26', quantity:1200, quantity_unit:'kg', material_status:'Disponível' as any, situation:'Preparado', observation:'', created_at:'', updated_at:'' },
  { id:'d6', date:'', unit:'Fênix' as any, sc:'SC3', product:'Nativo', product_abbr:'NAT', batch:'114/26', quantity:1200, quantity_unit:'kg', material_status:'Disponível' as any, situation:'A preparar', observation:'', created_at:'', updated_at:'' },
  { id:'d7', date:'', unit:'Fênix' as any, sc:'SC3', product:'Nativo', product_abbr:'NAT', batch:'115/26', quantity:1200, quantity_unit:'kg', material_status:'Disponível' as any, situation:'A preparar', observation:'', created_at:'', updated_at:'' },
  { id:'d8', date:'', unit:'Fênix' as any, sc:'SC3', product:'Nativo', product_abbr:'NAT', batch:'116/26', quantity:1200, quantity_unit:'kg', material_status:'Disponível' as any, situation:'A preparar', observation:'', created_at:'', updated_at:'' },
  { id:'d9', date:'', unit:'Fênix' as any, sc:'SC2', product:'Belt', product_abbr:'BEL', batch:'019/26', quantity:1000, quantity_unit:'kg', material_status:'Disponível' as any, situation:'Em fábrica' as any, observation:'', created_at:'', updated_at:'' },
  { id:'d10', date:'', unit:'Fênix' as any, sc:'SC2', product:'Belt', product_abbr:'BEL', batch:'020/26', quantity:1000, quantity_unit:'kg', material_status:'Disponível' as any, situation:'Em fábrica' as any, observation:'', created_at:'', updated_at:'' },
] as ProductionItem[];

type Grouped = Record<string, Record<string, { sc: string; product: string; items: ProductionItem[] }>>;

function buildText(grouped: Grouped): string {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  const units = Object.keys(grouped);
  let txt = '*' + greet + ', segue a situação dos materiais para o próximo turno:*\n';
  units.forEach((unit) => {
    txt += '\n> *' + unit.toUpperCase() + '*\n';
    const groups = Object.values(grouped[unit]);
    groups.forEach(({ sc, product, items: its }, gi) => {
      txt += '\n*' + sc + ' – ' + product.toUpperCase() + '*\n';
      its.forEach(it => {
        const obs = it.observation ? ' (' + it.observation + ')' : '';
        txt += BULLET + ' Lote ' + it.batch + ' – ' + it.situation + obs + '\n';
      });
      if (gi < groups.length - 1) txt += '\n' + SEP + '\n';
    });
  });
  return txt.trimEnd();
}

export default function ReportScreen() {
  const { colors } = useTheme();
  const { isDemo } = useAuth();
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [reportText, setReportText] = useState('');
  const [obs, setObs] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const obsRef = useRef<TextInput>(null);

  const grouped = useMemo<Grouped>(() => {
    return items.reduce((acc, item) => {
      const unit = item.unit || 'Outros';
      if (!acc[unit]) acc[unit] = {};
      const key = item.sc + '|' + item.product;
      if (!acc[unit][key]) acc[unit][key] = { sc: item.sc, product: item.product, items: [] };
      acc[unit][key].items.push(item);
      return acc;
    }, {} as Grouped);
  }, [items]);

  const fetchItems = useCallback(async () => {
    if (isDemo) { setItems(DEMO_ITEMS); return; }
    setLoading(true);
    try {
      const r = await api.get('/production', { params: { date: todayISO() } });
      setItems(Array.isArray(r.data) ? r.data : []);
    } catch { Alert.alert('Erro', 'Falha ao carregar dados'); }
    finally { setLoading(false); }
  }, [isDemo]);

  useFocusEffect(useCallback(() => { fetchItems(); }, [fetchItems]));

  useMemo(() => {
    if (Object.keys(grouped).length > 0) {
      setReportText(buildText(grouped));
    }
  }, [grouped]);

  const fullText = useMemo(() => {
    let full = reportText;
    const trimmedObs = obs.trim();
    full += '\n\n' + SEP + '\n*Observações:*\n';
    if (trimmedObs) {
      trimmedObs.split('\n').forEach(line => {
        if (line.trim()) full += BULLET + ' ' + line.trim() + '\n';
      });
    } else {
      full += BULLET + ' (Coloque aqui algo importante, ex: falta matéria-prima, limpeza pendente, etc.)';
    }
    return full;
  }, [reportText, obs]);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      Alert.alert('Erro', 'Não foi possível copiar');
    }
  };

  const handleRegen = () => {
    if (Object.keys(grouped).length > 0) setReportText(buildText(grouped));
  };

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const stats = useMemo(() => ({
    total: items.length,
    prep: items.filter(i => i.situation === 'Preparado').length,
    aprepara: items.filter(i => i.situation === 'A preparar').length,
    fab: items.filter(i => i.situation === 'Em fábrica' || i.situation === 'Em fabrica').length,
  }), [items]);

  return (
    <SafeAreaView style={[S.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[S.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={S.headerRow}>
          <View style={S.bayerBadge}><BayerLogo size={22} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[S.hTitle, { color: colors.textPrimary }]}>Relatório de Turno</Text>
            <Text style={[S.hSub, { color: colors.textSecondary }]} numberOfLines={1}>{today}</Text>
          </View>
          <TouchableOpacity onPress={handleRegen} style={[S.regenBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Ionicons name='refresh-outline' size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCopy} style={[S.copyBtn, { backgroundColor: copied ? colors.success : colors.primary }]}>
            <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color='#fff' />
            <Text style={S.copyTxt}>{copied ? 'Copiado!' : 'Copiar'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[S.statsBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {([['Total', stats.total, colors.textPrimary], ['Preparados', stats.prep, colors.success], ['A preparar', stats.aprepara, colors.warning], ['Em fábrica', stats.fab, colors.info]] as [string,number,string][]).map(([l,v,c]) => (
          <View key={l} style={S.statItem}>
            <Text style={[S.statNum, { color: c }]}>{v}</Text>
            <Text style={[S.statLbl, { color: colors.textSecondary }]}>{l}</Text>
          </View>
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
          <View style={S.sectionHead}>
            <Ionicons name='document-text-outline' size={15} color={colors.primary} />
            <Text style={[S.sectionLabel, { color: colors.textTertiary }]}>TEXTO DO RELATÓRIO</Text>
            <Text style={[S.editHint, { color: colors.textTertiary }]}>editável</Text>
          </View>
          <View style={[S.msgBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              value={reportText}
              onChangeText={setReportText}
              multiline
              style={[S.reportInput, { color: colors.textPrimary }]}
              placeholderTextColor={colors.textTertiary}
              placeholder='Nenhum item encontrado. Adicione itens na Planilha.'
              textAlignVertical='top'
              scrollEnabled={false}
            />
            <View style={[S.bubbleTail, { backgroundColor: colors.surface, borderColor: colors.border }]} />
          </View>

          <View style={S.sepRow}>
            <View style={[S.sepLine, { backgroundColor: colors.border }]} />
            <Text style={[S.sepTxt, { color: colors.textTertiary }]}>{SEP}</Text>
            <View style={[S.sepLine, { backgroundColor: colors.border }]} />
          </View>
          <View style={S.sectionHead}>
            <Ionicons name='create-outline' size={15} color={colors.warning} />
            <Text style={[S.sectionLabel, { color: colors.textTertiary }]}>OBSERVAÇÕES</Text>
            <Text style={[S.editHint, { color: colors.textTertiary }]}>opcional</Text>
          </View>
          <View style={[S.obsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[S.obsLabelRow, { borderBottomColor: colors.border }]}>
              <Text style={[S.obsLabel, { color: colors.textPrimary }]}>Observações:</Text>
            </View>
            <TextInput
              ref={obsRef}
              value={obs}
              onChangeText={setObs}
              multiline
              style={[S.obsInput, { color: colors.textPrimary }]}
              placeholderTextColor={colors.textTertiary}
              placeholder='Coloque aqui algo importante, ex: falta matéria-prima, limpeza pendente, etc.'
              textAlignVertical='top'
              scrollEnabled={false}
            />
          </View>

          <View style={[S.previewCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
            <View style={S.previewHeader}>
              <Ionicons name='eye-outline' size={14} color={colors.primary} />
              <Text style={[S.previewLabel, { color: colors.primary }]}>PRÉVIA — o que será copiado</Text>
            </View>
            <Text style={[S.previewText, { color: colors.textSecondary }]}>{fullText}</Text>
          </View>

          <TouchableOpacity onPress={handleCopy} style={[S.copyBtnLarge, { backgroundColor: copied ? colors.success : colors.primary }]}>
            <Ionicons name={copied ? 'checkmark-circle' : 'copy-outline'} size={22} color='#fff' />
            <Text style={S.copyBtnLargeTxt}>{copied ? 'Texto copiado com sucesso!' : 'Copiar relatório completo'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bayerBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  hTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4 },
  hSub: { fontSize: 12, marginTop: 1, textTransform: 'capitalize' },
  regenBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  copyTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderBottomWidth: 1 },
  statItem: { alignItems: 'center', gap: 2 },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLbl: { fontSize: 10, fontWeight: '600' },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 48 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, flex: 1 },
  editHint: { fontSize: 10, fontStyle: 'italic' },
  msgBubble: { borderRadius: 16, borderWidth: 1, padding: 14, position: 'relative' },
  reportInput: { fontSize: 13.5, lineHeight: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', minHeight: 200 },
  bubbleTail: { position: 'absolute', bottom: -1, left: 20, width: 14, height: 14, borderBottomLeftRadius: 14, borderRightWidth: 1, borderBottomWidth: 1 },
  sepRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  sepLine: { flex: 1, height: 1 },
  sepTxt: { fontSize: 11, letterSpacing: 1 },
  obsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  obsLabelRow: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  obsLabel: { fontSize: 14, fontWeight: '700' },
  obsInput: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, lineHeight: 22, minHeight: 80 },
  previewCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  previewLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  previewText: { fontSize: 12, lineHeight: 19, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  copyBtnLarge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16 },
  copyBtnLargeTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

