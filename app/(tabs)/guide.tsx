import { Ionicons } from '@expo/vector-icons';
import BayerLogo from '../../src/BayerLogo';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';

type ChemicalInfo = { scientific: string; chemClass: string; action: string; target: string; precautions: string; };
type Recipe = { id: string; name: string; chemical: ChemicalInfo; massageable: boolean; stackingNote: string; handlingNote: string; };
type Product = { id: string; name: string; abbr: string; category: string; recipes: string[]; description: string; bagWeight?: string; handlingTip?: string; };
type OpItem = { text: string; type?: 'warning' | 'info' | 'success' | 'normal'; };
type OpSection = { id: string; title: string; icon: string; items: OpItem[]; };

const RECIPES: Recipe[] = [
  {
    id: 'trifloxy', name: 'Trifloxy',
    chemical: { scientific: 'Trifloxystrobin', chemClass: 'Estrobilurina', action: 'Fungicida sistemico e de contato', target: 'Doencas fungicas: ferrugem, oidio, manchas. Inibe respiracao mitocondrial (Complexo III).', precautions: 'EPI completo obrigatorio. Lavar maos apos manuseio. Armazenar em local seco e arejado.' },
    massageable: true, stackingNote: 'Empilhar SOMENTE com Trifloxy. Nao misturar com outras receitas na pilha.', handlingNote: 'Massagear bem antes de usar para homogeneizar. Max 2 bags empilhados.',
  },
  {
    id: 'tebuconazole', name: 'Tebuconazole',
    chemical: { scientific: 'Tebuconazole', chemClass: 'Triazol', action: 'Fungicida sistemico', target: 'Ferrugem, oidio, manchas foliares. Inibe sintese de ergosterol.', precautions: 'EPI completo. Nao misturar sem recomendacao tecnica. Respeitar carencia.' },
    massageable: false, stackingNote: 'NAO massagear. Empilhar com Tebuconazole ou Bixafem (fila separada no FOX XPRO).', handlingNote: 'FOX XPRO: separar em fila propria com Bixafem. NAO misturar com fila do Trifloxy.',
  },
  {
    id: 'bixafem', name: 'Bixafem',
    chemical: { scientific: 'Bixafen', chemClass: 'Pyrazole carboxamide (SDHI)', action: 'Fungicida sistemico — inibe succinato desidrogenase', target: 'Ferrugem asiatica, oidio, manchas. Alta acao protetora e curativa.', precautions: 'EPI obrigatorio. Evitar contato com pele e olhos. Nao aplicar próximo a rios.' },
    massageable: false, stackingNote: 'NAO massagear. Empilhar com Bixafem ou Tebuconazole (fila separada no FOX XPRO).', handlingNote: 'FOX XPRO: fila propria com Tebuconazole. Separar fisicamente do Trifloxy.',
  },
  {
    id: 'spirotetramat', name: 'Spirotetramat',
    chemical: { scientific: 'Spirotetramat', chemClass: 'Acido tetramico', action: 'Inseticida sistemico bidirecional', target: 'Pulgoes, mosca branca, cochonilhas, acaros sugadores.', precautions: 'EPI completo. Aplicar no periodo recomendado. Evitar contato com olhos.' },
    massageable: true, stackingNote: 'Massagear antes do uso. Empilhar somente com Spirotetramat.', handlingNote: 'Agitar/massagear bem o bag antes de usar para garantir homogeneidade.',
  },
  {
    id: 'fluopyram', name: 'Fluopyram',
    chemical: { scientific: 'Fluopyram', chemClass: 'Pyridinylethylbenzamide (SDHI)', action: 'Fungicida e nematicida sistemico', target: 'Doencas fungicas, nematoides de solo e foliar.', precautions: 'EPI obrigatorio. Armazenar longe de calor. Descartar embalagem conforme legislacao.' },
    massageable: true, stackingNote: 'Massagear antes do uso. Empilhar somente com Fluopyram.', handlingNote: 'Verificar integridade do bag antes de movimentar. Nao arrastar pelo chao.',
  },
  {
    id: 'bifenazate', name: 'Bifenazate',
    chemical: { scientific: 'Bifenazate', chemClass: 'Carbazato', action: 'Acaricida seletivo de contato', target: 'Acaros fitofagos. Age em ovos, larvas e adultos.', precautions: 'EPI. Nao aplicar com vento forte. Respeitar intervalo de seguranca.' },
    massageable: false, stackingNote: 'NAO massagear. Empilhar somente com Bifenazate.', handlingNote: 'Manter em temperatura ambiente. Verificar validade antes do uso.',
  },
  {
    id: 'imidacloprid', name: 'Imidacloprid',
    chemical: { scientific: 'Imidacloprid', chemClass: 'Neonicotinoide', action: 'Inseticida sistemico — age no SNC dos insetos', target: 'Afideos, cigarrinhas, mosca branca, percevejo.', precautions: 'EPI. Toxico para abelhas — nao aplicar em floracao. Nao contaminar cursos de agua.' },
    massageable: true, stackingNote: 'Massagear antes do uso. Empilhar somente com Imidacloprid.', handlingNote: 'Atencao: alta toxicidade para polinizadores. Usar em horarios recomendados.',
  },
];

const PRODUCTS: Product[] = [
  { id: 'nativo', name: 'Nativo', abbr: 'NAT', category: 'Fungicida', recipes: ['trifloxy', 'tebuconazole'], bagWeight: 'Consultar NF', description: 'Fungicida dupla acao: Trifloxystrobin + Tebuconazole. Trifloxy massageia, Tebuconazole nao.', handlingTip: 'Separar receitas em filas distintas. Trifloxy massageia antes de usar.' },
  { id: 'verango', name: 'Verango', abbr: 'VER', category: 'Fungicida', recipes: ['fluopyram'], bagWeight: '400 kg/bag', description: 'Fungicida de nova geracao com Fluopyram. Inibe Complexo II da cadeia respiratoria.', handlingTip: 'Massagear antes do uso. Bag padrão: 400 kg. Empilhar somente com Fluopyram.' },
  { id: 'oberon', name: 'Oberon', abbr: 'OBE', category: 'Acaricida', recipes: ['bifenazate'], bagWeight: 'Consultar NF', description: 'Acaricida seletivo a base de Bifenazate. Eficaz contra ovos, larvas e adultos de acaros.', handlingTip: 'NAO massagear. Empilhar somente com Bifenazate.' },
  { id: 'foxXpro', name: 'Fox Xpro', abbr: 'FXX', category: 'Fungicida', recipes: ['trifloxy', 'tebuconazole', 'bixafem'], bagWeight: 'Consultar NF', description: 'Fungicida tri-acao: Trifloxystrobin + Tebuconazole + Bixafem. Cada componente tem regra propria.', handlingTip: 'REGRA CRITICA: Trifloxy massageia e vai numa fila; Tebuconazole e Bixafem NAO massageiam e vao em outra fila. Empilhar cada receita somente com a mesma receita.' },
  { id: 'belt', name: 'Belt', abbr: 'BEL', category: 'Inseticida', recipes: ['imidacloprid'], bagWeight: 'Consultar NF', description: 'Inseticida a base de Flubendiamida. Controle de lagartas e lepidopteros.', handlingTip: 'Belt e so DESCASCAR, nao massageia. Processo simples: abrir e usar.' },
  { id: 'sphereMax', name: 'Sphere Max', abbr: 'SPH', category: 'Fungicida', recipes: ['trifloxy', 'tebuconazole'], bagWeight: 'Consultar NF', description: 'Fungicida com Trifloxystrobin + Tebuconazole e tecnologia de formulação avancada.', handlingTip: 'Trifloxy massageia, Tebuconazole nao. Separar em filas distintas.' },
  { id: 'connect', name: 'Connect', abbr: 'CON', category: 'Inseticida', recipes: ['imidacloprid'], bagWeight: 'Consultar NF', description: 'Imidacloprid + Beta-ciflutrina. Acao de contato e sistemica contra pragas variadas.', handlingTip: 'Massagear Imidacloprid antes do uso. Beta-ciflutrina nao massageia.' },
  { id: 'movento', name: 'Movento', abbr: 'MOV', category: 'Inseticida', recipes: ['spirotetramat'], bagWeight: 'Consultar NF', description: 'Spirotetramat — inseticida bidirecional. Controle eficaz de insetos sugadores.', handlingTip: 'Massagear bem antes do uso. Empilhar somente com Spirotetramat.' },
  { id: 'decis', name: 'Decis', abbr: 'DEC', category: 'Inseticida', recipes: ['bifenazate'], bagWeight: 'Consultar NF', description: 'Piretroide de amplo espectro. Acao rapida por contato e ingestão contra diversas pragas.', handlingTip: 'NAO massagear. Manter temperatura conforme especificacao do produto.' },
  { id: 'alsystim', name: 'Alsystim', abbr: 'ALS', category: 'Fungicida', recipes: ['trifloxy'], bagWeight: 'Consultar NF', description: 'Fungicida sistemico. Consultar composicao exata com responsavel tecnico.', handlingTip: 'Verificar receita especifica na NF. Seguir regras da receita correspondente.' },
  { id: 'hybstem', name: 'Hybstem', abbr: 'HYB', category: 'Fungicida', recipes: ['fluopyram'], bagWeight: 'Consultar NF', description: 'Fungicida. Consultar composicao exata com responsavel tecnico para procedimento correto.', handlingTip: 'Verificar receita especifica na NF. Seguir regras da receita correspondente.' },
  { id: 'ureia', name: 'Ureia', abbr: 'URE', category: 'Fertilizante', recipes: [], bagWeight: '700 kg/bag', description: 'Fertilizante nitrogenado. NAO e fungicida/inseticida. Manuseio separado dos agroquimicos.', handlingTip: 'Bag padrao: 700 kg. Nao misturar com agroquimicos. Area de armazenamento exclusiva.' },
];

const CATEGORIES = ['Todos', 'Fungicida', 'Inseticida', 'Acaricida', 'Fertilizante'];

const OP_SECTIONS: OpSection[] = [
  {
    id: 'stacking', title: 'Regras de Empilhamento e Massageamento', icon: 'layers-outline',
    items: [
      { text: 'REGRA GERAL: Produto massageado NAO pode ficar em cima de produto massageado de outra receita.', type: 'warning' },
      { text: 'Cada receita deve ser empilhada somente sobre a mesma receita.', type: 'warning' },
      { text: 'Trifloxy: massagear antes de usar. Empilhar somente Trifloxy sobre Trifloxy.', type: 'info' },
      { text: 'Tebuconazole: NAO massagear. Empilhar somente com Tebuconazole.', type: 'info' },
      { text: 'Bixafem: NAO massagear. Empilhar somente com Bixafem.', type: 'info' },
      { text: 'Spirotetramat: massagear antes de usar. Empilhar somente com Spirotetramat.', type: 'info' },
      { text: 'Fluopyram: massagear antes de usar. Empilhar somente com Fluopyram.', type: 'info' },
      { text: 'Belt (Flubendiamida): APENAS descascar, NAO massagear.', type: 'success' },
      { text: 'Bifenazate: NAO massagear. Empilhar somente com Bifenazate.', type: 'info' },
    ],
  },
  {
    id: 'foxXpro', title: 'Procedimento Especial: Fox Xpro', icon: 'git-branch-outline',
    items: [
      { text: 'FOX XPRO tem 3 receitas: Trifloxystrobin (Trifloxy) + Tebuconazole + Bixafem.', type: 'info' },
      { text: 'FILA 1 — Trifloxy: massagear antes de usar. Empilhar somente Trifloxy sobre Trifloxy.', type: 'success' },
      { text: 'FILA 2 — Tebuconazole + Bixafem: NAO massagear. Podem ser empilhados juntos nesta fila.', type: 'success' },
      { text: 'SEPARAR fisicamente as duas filas durante o processo de produção.', type: 'warning' },
      { text: 'Nao misturar Trifloxy com Tebuconazole ou Bixafem em nenhuma etapa.', type: 'warning' },
    ],
  },
  {
    id: 'weights', title: 'Pesos dos Bags (Referencia)', icon: 'scale-outline',
    items: [
      { text: 'Verango: 400 kg por bag', type: 'info' },
      { text: 'Ureia: 700 kg por bag', type: 'info' },
      { text: 'Demais produtos: consultar NF (Nota Fiscal) ou supervisor', type: 'normal' },
      { text: 'Sempre conferir NF antes de movimentar para garantir peso correto.', type: 'warning' },
    ],
  },
  {
    id: 'epi', title: 'EPI Obrigatorio', icon: 'shield-checkmark-outline',
    items: [
      { text: 'Macacao impermeavel de manga longa', type: 'normal' },
      { text: 'Luvas de borracha nitrilica (nao latex)', type: 'normal' },
      { text: 'Oculos de seguranca ampla visao', type: 'normal' },
      { text: 'Respirador semifacial com filtro P2/P3', type: 'normal' },
      { text: 'Botas de borracha cano longo', type: 'normal' },
      { text: 'Avental impermeavel (quando necessario)', type: 'normal' },
      { text: 'NUNCA manusear agroquimicos sem EPI completo.', type: 'warning' },
    ],
  },
  {
    id: 'decontam', title: 'Descontaminacao', icon: 'water-outline',
    items: [
      { text: '1. Remover EPI em area designada (nao na area de produção)', type: 'normal' },
      { text: '2. Lavar maos e rosto com agua e sabao por pelo menos 30 segundos', type: 'normal' },
      { text: '3. Trocar roupas contaminadas imediatamente', type: 'normal' },
      { text: '4. Ensacar roupas separadamente para lavagem especial', type: 'normal' },
      { text: '5. Tomar banho completo ao final do turno', type: 'normal' },
      { text: '6. Registrar qualquer exposicao acidental no livro de ocorrencias', type: 'warning' },
      { text: 'Em caso de contato com olhos: lavar com agua corrente por 15 min e buscar atendimento medico.', type: 'warning' },
    ],
  },
  {
    id: 'abbrs', title: 'Abreviacoes dos Lotes', icon: 'barcode-outline',
    items: [
      { text: 'NAT = Nativo', type: 'normal' },
      { text: 'VER = Verango', type: 'normal' },
      { text: 'OBE = Oberon', type: 'normal' },
      { text: 'FXX = Fox Xpro', type: 'normal' },
      { text: 'BEL = Belt', type: 'normal' },
      { text: 'SPH = Sphere Max', type: 'normal' },
      { text: 'CON = Connect', type: 'normal' },
      { text: 'MOV = Movento', type: 'normal' },
      { text: 'DEC = Decis', type: 'normal' },
      { text: 'ALS = Alsystim', type: 'normal' },
      { text: 'HYB = Hybstem', type: 'normal' },
      { text: 'URE = Ureia', type: 'normal' },
    ],
  },
  {
    id: 'proc', title: 'Procedimentos Operacionais', icon: 'list-circle-outline',
    items: [
      { text: 'Verificar FISPQ antes de manusear qualquer produto novo', type: 'normal' },
      { text: 'Confirmar disponibilidade de materia-prima antes de iniciar', type: 'normal' },
      { text: 'Registrar lote e quantidade no sistema ao iniciar produção', type: 'normal' },
      { text: 'Nunca misturar produtos sem aprovacao tecnica', type: 'warning' },
      { text: 'Manter area limpa e organizada (5S)', type: 'normal' },
      { text: 'Registrar observacoes importantes por item no sistema', type: 'normal' },
      { text: 'Notificar supervisor imediatamente em caso de desvio de processo', type: 'warning' },
      { text: 'Belt: apenas descascar. Nao necessita massageamento.', type: 'success' },
    ],
  },
];

export default function GuideScreen() {
  const { colors } = useTheme();
  const [section, setSection] = useState<'products'|'recipes'|'operations'>('products');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [expanded, setExpanded] = useState<string|null>(null);

  const toggle = (id: string) => setExpanded(p => p === id ? null : id);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return PRODUCTS.filter(p => {
      const matchCat = category === 'Todos' || p.category === category;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.abbr.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [search, category]);

  const filteredRecipes = useMemo(() => {
    const q = search.toLowerCase();
    return RECIPES.filter(r => !q || r.name.toLowerCase().includes(q) || r.chemical.scientific.toLowerCase().includes(q));
  }, [search]);

  const getCatColor = (cat: string) => {
    const m: Record<string,string> = { Fungicida: colors.primary, Inseticida: colors.warning, Acaricida: colors.info, Fertilizante: colors.success };
    return m[cat] || colors.textSecondary;
  };

  const itemBg = (type?: string) => {
    if (type === 'warning') return colors.warningBg;
    if (type === 'info') return colors.infoBg;
    if (type === 'success') return colors.successBg;
    return colors.surfaceElevated;
  };
  const itemColor = (type?: string) => {
    if (type === 'warning') return colors.warning;
    if (type === 'info') return colors.info;
    if (type === 'success') return colors.success;
    return colors.textSecondary;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <View style={styles.bayerBadge}>
            <BayerLogo size={24} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.hTitle, { color: colors.textPrimary }]}>Guia de Formulação</Text>
            <Text style={[styles.hSub, { color: colors.textSecondary }]}>Produtos, receitas e procedimentos</Text>
          </View>
        </View>
      </View>
      <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.textTertiary} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Buscar produto, receita, princípio ativo..." placeholderTextColor={colors.textTertiary} style={[styles.searchInput, { color: colors.textPrimary }]} />
        {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={colors.textTertiary} /></TouchableOpacity>}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingBottom: 8 }}>
        {(['products', 'recipes', 'operations'] as const).map(s => {
          const labels: Record<string,string> = { products: 'Produtos', recipes: 'Receitas', operations: 'Operacoes' };
          const icons: Record<string,string> = { products: 'flask-outline', recipes: 'beaker-outline', operations: 'clipboard-outline' };
          const active = section === s;
          return (
            <TouchableOpacity key={s} onPress={() => setSection(s)}
              style={[styles.sectionTab, { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border }]}>
              <Ionicons name={icons[s] as any} size={14} color={active ? '#fff' : colors.textSecondary} />
              <Text style={{ color: active ? '#fff' : colors.textSecondary, fontWeight: '600', fontSize: 13 }}>{labels[s]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {section === 'products' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingBottom: 8 }}>
            {CATEGORIES.map(cat => {
              const active = category === cat;
              const cc = getCatColor(cat);
              return (
                <TouchableOpacity key={cat} onPress={() => setCategory(cat)}
                  style={[styles.catChip, { backgroundColor: active ? cc + '22' : colors.surface, borderColor: active ? cc : colors.border }]}>
                  <Text style={{ color: active ? cc : colors.textSecondary, fontWeight: '600', fontSize: 12 }}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <FlatList data={filteredProducts} keyExtractor={p => p.id} contentContainerStyle={{ padding: 12, gap: 10 }} showsVerticalScrollIndicator={false}
            renderItem={({ item: p }) => {
              const cc = getCatColor(p.category);
              const recipeNames = p.recipes.map(rid => RECIPES.find(r => r.id === rid)?.name || rid).join(' + ');
              return (
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.cardRow}>
                    <View style={[styles.abbrBadge, { backgroundColor: cc + '20' }]}><Text style={[styles.abbrText, { color: cc }]}>{p.abbr}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{p.name}</Text>
                      <Text style={[styles.cardCat, { color: cc }]}>{p.category}</Text>
                    </View>
                    {p.bagWeight && <View style={[styles.weightBadge, { backgroundColor: colors.infoBg }]}><Text style={[styles.weightText, { color: colors.info }]}>{p.bagWeight}</Text></View>}
                  </View>
                  <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{p.description}</Text>
                  {recipeNames.length > 0 && (
                    <View style={[styles.recipeTag, { backgroundColor: colors.primary + '12' }]}>
                      <Ionicons name="flask-outline" size={12} color={colors.primary} />
                      <Text style={[styles.recipeTagText, { color: colors.primary }]}>Receita: {recipeNames}</Text>
                    </View>
                  )}
                  {p.handlingTip && (
                    <View style={[styles.tipBox, { backgroundColor: colors.warningBg }]}>
                      <Ionicons name="warning-outline" size={12} color={colors.warning} />
                      <Text style={[styles.tipText, { color: colors.warning }]}>{p.handlingTip}</Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        </>
      )}

      {section === 'recipes' && (
        <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }} showsVerticalScrollIndicator={false}>
          {filteredRecipes.map(r => {
            const open = expanded === r.id;
            const linked = PRODUCTS.filter(p => p.recipes.includes(r.id));
            return (
              <View key={r.id} style={[styles.accordion, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => toggle(r.id)} style={styles.accordionHeader} activeOpacity={0.7}>
                  <View style={[styles.recipeIcon, { backgroundColor: r.massageable ? colors.successBg : colors.infoBg }]}>
                    <Ionicons name={r.massageable ? 'hand-right-outline' : 'hand-left-outline'} size={18} color={r.massageable ? colors.success : colors.info} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{r.name}</Text>
                    <Text style={[styles.cardCat, { color: r.massageable ? colors.success : colors.info }]}>{r.massageable ? 'Massagear antes de usar' : 'NAO massagear'}</Text>
                  </View>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textTertiary} />
                </TouchableOpacity>
                {open && (
                  <View style={[styles.accordionBody, { borderTopColor: colors.border }]}>
                    <InfoRow label="Cientifico" value={r.chemical.scientific} colors={colors} />
                    <InfoRow label="Classe" value={r.chemical.chemClass} colors={colors} />
                    <InfoRow label="Acao" value={r.chemical.action} colors={colors} />
                    <InfoRow label="Alvo" value={r.chemical.target} colors={colors} />
                    <View style={[styles.noteBox, { backgroundColor: r.massageable ? colors.warningBg : colors.infoBg }]}>
                      <Ionicons name="layers-outline" size={14} color={r.massageable ? colors.warning : colors.info} />
                      <Text style={[styles.noteText, { color: r.massageable ? colors.warning : colors.info }]}>{r.stackingNote}</Text>
                    </View>
                    <View style={[styles.noteBox, { backgroundColor: colors.successBg }]}>
                      <Ionicons name="information-circle-outline" size={14} color={colors.success} />
                      <Text style={[styles.noteText, { color: colors.success }]}>{r.handlingNote}</Text>
                    </View>
                    <View style={[styles.noteBox, { backgroundColor: colors.dangerBg }]}>
                      <Ionicons name="alert-circle-outline" size={14} color={colors.danger} />
                      <Text style={[styles.noteText, { color: colors.danger }]}>{r.chemical.precautions}</Text>
                    </View>
                    {linked.length > 0 && (
                      <View>
                        <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>PRODUTOS QUE USAM ESTA RECEITA</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                          {linked.map(p => <View key={p.id} style={[styles.linkedChip, { backgroundColor: colors.primary + '18' }]}><Text style={[styles.linkedText, { color: colors.primary }]}>{p.name}</Text></View>)}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {section === 'operations' && (
        <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }} showsVerticalScrollIndicator={false}>
          {OP_SECTIONS.map(op => {
            const open = expanded === op.id;
            return (
              <View key={op.id} style={[styles.accordion, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => toggle(op.id)} style={styles.accordionHeader} activeOpacity={0.7}>
                  <View style={[styles.opIcon, { backgroundColor: colors.primary + '22' }]}><Ionicons name={op.icon as any} size={16} color={colors.primary} /></View>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary, flex: 1 }]}>{op.title}</Text>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textTertiary} />
                </TouchableOpacity>
                {open && (
                  <View style={[styles.accordionBody, { borderTopColor: colors.border }]}>
                    {op.items.map((item, i) => (
                      <View key={i} style={[styles.opItem, { backgroundColor: itemBg(item.type) }]}>
                        <Ionicons name={item.type === 'warning' ? 'warning-outline' : item.type === 'success' ? 'checkmark-circle-outline' : 'information-circle-outline'} size={14} color={itemColor(item.type)} />
                        <Text style={[styles.opText, { color: itemColor(item.type) }]}>{item.text}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return <View style={{ gap: 2 }}><Text style={[styles.infoLabel, { color: colors.textTertiary }]}>{label.toUpperCase()}</Text><Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 14, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bayerBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  headerText: { flex: 1 },
  hTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  hSub: { fontSize: 13, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, height: 44, borderRadius: 12, borderWidth: 1, margin: 12 },
  searchInput: { flex: 1, fontSize: 14 },
  sectionTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  abbrBadge: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  abbrText: { fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardCat: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  weightBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  weightText: { fontSize: 11, fontWeight: '700' },
  recipeTag: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 8 },
  recipeTagText: { fontSize: 12, fontWeight: '500', flex: 1 },
  tipBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 8, borderRadius: 8 },
  tipText: { fontSize: 12, flex: 1, lineHeight: 17 },
  accordion: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  accordionBody: { padding: 14, borderTopWidth: 1, gap: 10 },
  recipeIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  opIcon: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  noteBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 8 },
  noteText: { fontSize: 13, flex: 1, lineHeight: 18 },
  infoLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  infoValue: { fontSize: 13, lineHeight: 18 },
  linkedChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  linkedText: { fontSize: 12, fontWeight: '600' },
  opItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 8, borderRadius: 8 },
  opText: { fontSize: 13, flex: 1, lineHeight: 18 },
});
