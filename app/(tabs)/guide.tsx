import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/auth';
import { useTheme } from '../../src/theme';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const GRID_GAP = 16;

type Recipe = {
  product: string;
  recipe: string;
  active_ingredient: string;
  category: string;
  func: string;
  application: string;
  notes: string;
  image?: string;
  duration?: string;
  difficulty?: 'Fácil' | 'Médio' | 'Avançado';
};

type Chemistry = {
  name: string;
  alias: string;
  className: string;
  func: string;
  applications: string;
  safety: string;
  image?: string;
  molecularFormula?: string;
};

type Procedure = {
  title: string;
  icon: any;
  content: string;
  steps?: string[];
  tips?: string[];
  duration?: string;
};

type GuideCategory = 'produtos' | 'quimica' | 'procedimentos' | 'seguranca' | 'epis' | 'tutorial';

interface CourseCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  gradientColors: string[];
  image?: string;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  lessons: number;
  category: GuideCategory;
}

export default function GuideScreen() {
  const { colors, isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<GuideCategory>('produtos');
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [chemistry, setChemistry] = useState<Chemistry[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const r = await api.get('/recipes');
      const baseRecipes = r.data.recipes ?? [];
      const baseChemistry = r.data.chemistry ?? [];
      const baseProcedures = r.data.procedures ?? [];

      const defaultRecipes = getDefaultRecipes();
      const defaultChemistry = getDefaultChemistry();
      const baseProceduresDefault = getDefaultProcedures();

      setRecipes(baseRecipes.length > 0 ? baseRecipes : defaultRecipes);
      setChemistry(baseChemistry.length > 0 ? baseChemistry : defaultChemistry);
      setProcedures(baseProcedures.length > 0 ? baseProcedures : baseProceduresDefault);
    } catch (e) {
      console.log('Erro recipes:', e);
      setRecipes(getDefaultRecipes());
      setChemistry(getDefaultChemistry());
      setProcedures(getDefaultProcedures());
    } finally {
      setLoading(false);
    }
  };

  const q = search.trim().toLowerCase();

  const filteredRecipes = useMemo(() => {
    if (!q) return recipes;
    return recipes.filter(r =>
      `${r.product} ${r.recipe} ${r.active_ingredient} ${r.category}`.toLowerCase().includes(q)
    );
  }, [recipes, q]);

  const filteredChem = useMemo(() => {
    if (!q) return chemistry;
    return chemistry.filter(c => `${c.name} ${c.alias} ${c.className}`.toLowerCase().includes(q));
  }, [chemistry, q]);

  const filteredProc = useMemo(() => {
    if (!q) return procedures;
    return procedures.filter(p => `${p.title} ${p.content}`.toLowerCase().includes(q));
  }, [procedures, q]);

  const categories: {
    key: GuideCategory;
    label: string;
    icon: string;
    color: string;
    gradient: string[];
  }[] = [
    {
      key: 'produtos',
      label: 'Produtos',
      icon: 'flask',
      color: '#00BCFF',
      gradient: ['#00BCFF', '#0099CC'],
    },
    {
      key: 'quimica',
      label: 'Química',
      icon: 'leaf',
      color: '#89D329',
      gradient: ['#89D329', '#6BA31F'],
    },
    {
      key: 'procedimentos',
      label: 'Procedimentos',
      icon: 'cog',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706'],
    },
    {
      key: 'tutorial',
      label: 'Tutoriais',
      icon: 'play-circle',
      color: '#EC4899',
      gradient: ['#EC4899', '#BE185D'],
    },
    {
      key: 'epis',
      label: 'EPIs',
      icon: 'shield',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#6D28D9'],
    },
    {
      key: 'seguranca',
      label: 'Segurança',
      icon: 'warning',
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
    },
  ];

  const getCourseCards = (): CourseCard[] => {
    if (activeCategory === 'produtos') {
      return recipes.map((r, i) => ({
        id: `prod-${i}`,
        title: r.product,
        subtitle: r.recipe,
        description: r.notes,
        icon: 'flask',
        color: '#00BCFF',
        gradientColors: ['#00BCFF', '#0099CC'],
        duration: r.application?.match(/\d+/)?.[0] || '8-10',
        level: 'Intermediário',
        lessons: 4,
        category: 'produtos',
      }));
    }
    if (activeCategory === 'quimica') {
      return chemistry.map((c, i) => ({
        id: `chem-${i}`,
        title: c.name,
        subtitle: c.alias,
        description: c.func,
        icon: 'leaf',
        color: '#89D329',
        gradientColors: ['#89D329', '#6BA31F'],
        duration: 'N/A',
        level: 'Avançado',
        lessons: 3,
        category: 'quimica',
      }));
    }
    if (activeCategory === 'procedimentos') {
      return procedures.map((p, i) => ({
        id: `proc-${i}`,
        title: p.title,
        subtitle: 'Passo a passo',
        description: p.content.split('\n')[0],
        icon: p.icon,
        color: '#F59E0B',
        gradientColors: ['#F59E0B', '#D97706'],
        duration: '15-20',
        level: 'Iniciante',
        lessons: 5,
        category: 'procedimentos',
      }));
    }
    return [];
  };

  const openDetail = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderCourseCard = ({ item }: { item: CourseCard }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => openDetail(item)}
      style={styles.cardWrapper}
    >
      <LinearGradient
        colors={item.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.courseCard}
      >
        <View style={styles.cardIconContainer}>
          <Ionicons name={item.icon} size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.cardBadge}>
            <Ionicons name="time-outline" size={12} color="#FFFFFF" />
            <Text style={styles.cardBadgeText}>{item.duration} min</Text>
          </View>
          <View style={styles.cardBadge}>
            <Ionicons name="book-outline" size={12} color="#FFFFFF" />
            <Text style={styles.cardBadgeText}>{item.lessons} aulas</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderHeroCard = () => (
    <LinearGradient
      colors={isDark ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      <View style={styles.heroContent}>
        <Text style={styles.heroBadge}>🎓 GUIA COMPLETO</Text>
        <Text style={styles.heroTitle}>Aprenda sobre{'\n'}Formulação Agrícola</Text>
        <Text style={styles.heroDescription}>
          Domine as técnicas de massagem, conheça os produtos e garanta a qualidade do seu processo
        </Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>50+</Text>
            <Text style={styles.heroStatLabel}>Produtos</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>30+</Text>
            <Text style={styles.heroStatLabel}>Ingredientes</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>15+</Text>
            <Text style={styles.heroStatLabel}>Procedimentos</Text>
          </View>
        </View>
      </View>
      <View style={styles.heroImageContainer}>
        <Ionicons name="school-outline" size={120} color="rgba(255,255,255,0.1)" />
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>📚 Guia de Estudos</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Conhecimento técnico especializado
            </Text>
          </View>
          <TouchableOpacity style={[styles.profileBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar cursos, produtos, ingredientes..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* HERO BANNER */}
        {renderHeroCard()}

        {/* CATEGORY TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(cat => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                style={[
                  styles.categoryTab,
                  {
                    backgroundColor: isActive ? cat.color : colors.surface,
                    borderColor: isActive ? cat.color : colors.border,
                  },
                ]}
              >
                <LinearGradient
                  colors={isActive ? cat.gradient : ['transparent', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryGradient}
                >
                  <Ionicons
                    name={cat.icon}
                    size={20}
                    color={isActive ? '#FFFFFF' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      {
                        color: isActive ? '#FFFFFF' : colors.textSecondary,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* COURSES GRID */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <View style={styles.coursesSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {categories.find(c => c.key === activeCategory)?.label}
              </Text>
              <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
                {getCourseCards().length} cursos
              </Text>
            </View>
            <FlatList
              data={getCourseCards()}
              renderItem={renderCourseCard}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
              columnWrapperStyle={styles.gridRow}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="book-outline" size={64} color={colors.textTertiary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Nenhum curso encontrado
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </ScrollView>

      {/* DETAIL MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={Platform.OS === 'ios' ? 50 : 100} style={StyleSheet.absoluteFill}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.modalIconContainer}>
                  <Ionicons name={selectedItem?.icon || 'book'} size={40} color="#FFFFFF" />
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  {selectedItem?.title}
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  {selectedItem?.subtitle}
                </Text>

                <View style={styles.modalStats}>
                  <View style={styles.modalStat}>
                    <Ionicons name="time-outline" size={16} color={colors.primary} />
                    <Text style={[styles.modalStatText, { color: colors.textSecondary }]}>
                      {selectedItem?.duration} minutos
                    </Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Ionicons name="book-outline" size={16} color={colors.primary} />
                    <Text style={[styles.modalStatText, { color: colors.textSecondary }]}>
                      {selectedItem?.lessons} aulas
                    </Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Ionicons name="signal-outline" size={16} color={colors.primary} />
                    <Text style={[styles.modalStatText, { color: colors.textSecondary }]}>
                      {selectedItem?.level}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={[styles.modalDescription, { color: colors.textPrimary }]}>
                  {selectedItem?.description}
                </Text>

                <TouchableOpacity style={[styles.startButton, { backgroundColor: colors.primary }]}>
                  <Text style={styles.startButtonText}>Iniciar Curso</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </SafeAreaView>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

// DEFAULT DATA FUNCTIONS
function getDefaultRecipes(): Recipe[] {
  return [
    {
      product: 'FOX XPRO',
      recipe: 'Triple Action',
      active_ingredient: 'Trifloxystrobin + Prothioconazole + Bixafen',
      category: 'Fungicida Sistêmico Avançado',
      func: 'Controle de doenças foliares com tecnologia Leafshield',
      application: 'Pulverização foliar (8-10 min)',
      notes:
        'Tecnologia exclusiva que garante absorção rápida e proteção prolongada. Ideal para culturas de alto valor.',
      duration: '8-10',
      difficulty: 'Intermediário',
    },
    {
      product: 'NATIVO WG 75',
      recipe: 'Dual Action',
      active_ingredient: 'Tebuconazole (50%) + Trifloxystrobin (25%)',
      category: 'Fungicida Preventivo',
      func: 'Proteção preventiva e curativa com duplo mecanismo',
      application: 'Pulverização (6-8 min)',
      notes: 'Granulado dispersível em água. Combinação sinérgica para máxima eficácia.',
      duration: '6-8',
      difficulty: 'Intermediário',
    },
    {
      product: 'FOX PRO',
      recipe: 'Broad Spectrum',
      active_ingredient: 'Trifloxystrobin',
      category: 'Fungicida Estrobilurina',
      func: 'Controle de múltiplas doenças com excelente cobertura',
      application: 'Aplicação em 8-10 min',
      notes: 'Ótima cobertura foliar. Resistente à chuva após 2 horas.',
      duration: '8-10',
      difficulty: 'Iniciante',
    },
    {
      product: 'CURBIX',
      recipe: 'Insecticide Advanced',
      active_ingredient: 'Clothianidin',
      category: 'Inseticida Neonicotinóide',
      func: 'Controle de pragas sugadoras com ação sistêmica',
      application: 'Pulverização agrícola',
      notes: 'Sistemicidade rápida. Protege a planta por dentro.',
      duration: '5-7',
      difficulty: 'Intermediário',
    },
    {
      product: 'CONNECT',
      recipe: 'Fungicide Mix',
      active_ingredient: 'Metalaxyl + Mancozeb',
      category: 'Fungicida Multi-sítio',
      func: 'Proteção contra oomicetos e fungos foliares',
      application: 'Pulverização preventiva',
      notes: 'Contato e translaminar. Ideal para programas de manejo.',
      duration: '7-9',
      difficulty: 'Avançado',
    },
    {
      product: 'BULLDOCK',
      recipe: 'Pyrethroid Potente',
      active_ingredient: 'Beta-ciflutrina',
      category: 'Inseticida Sintético',
      func: 'Controle rápido de pragas com efeito knockdown',
      application: 'Pulverização foliar',
      notes: 'Ação knockdown potente. Eficaz contra lepidópteros.',
      duration: '4-6',
      difficulty: 'Iniciante',
    },
  ];
}

function getDefaultChemistry(): Chemistry[] {
  return [
    {
      name: 'Trifloxystrobin',
      alias: 'Strobilurin de última geração',
      className: 'QoI (Quinona externa inibidora)',
      func: 'Inibição da respiração mitocondrial, bloqueando a produção de energia do fungo',
      applications: 'Fungicida foliar para controle de oídio, ferrugem e antracnose',
      safety: 'Categoria toxicológica 5 (produto pouco tóxico). Evitar contato ocular prolongado.',
      molecularFormula: 'C20H19F3N2O4',
    },
    {
      name: 'Tebuconazole',
      alias: 'Triazol sistêmico',
      className: 'DMI (Demetilação inibidor)',
      func: 'Inibição da biossíntese de ergosterol, essencial para membrana celular do fungo',
      applications: 'Proteção preventiva e curativa em diversas culturas',
      safety: 'Classe III - medianamente tóxico. Evitar inalação do pó.',
      molecularFormula: 'C16H22ClN3O',
    },
    {
      name: 'Prothioconazole',
      alias: 'Triazol Avançado',
      className: 'DMI (Demetilação inibidor)',
      func: 'Inibição de ergosterol + propriedades anti-transpiração',
      applications: 'Fungicida sistêmico para doenças de final de ciclo',
      safety: 'Baixa toxicidade para mamíferos. Seguro em aplicação foliar.',
      molecularFormula: 'C14H15Cl2N3O',
    },
    {
      name: 'Bixafen',
      alias: 'Carboxamida moderna',
      className: 'SDHI (Succinate dehydrogenase inhibitor)',
      func: 'Inibição do complexo II mitocondrial, interrompendo o ciclo de Krebs',
      applications: 'Controle de ferrugem e manchas foliares resistentes a QoI',
      safety: 'Toxicidade aguda baixa. Biodegradável no solo.',
      molecularFormula: 'C18H12Cl2F3N3O',
    },
    {
      name: 'Clothianidin',
      alias: 'Neonicotinóide sistêmico',
      className: 'Agonista nicotínico',
      func: 'Agonista de receptor de acetilcolina, causando paralisia e morte',
      applications: 'Inseticida sistêmico para pragas sugadoras',
      safety: 'ALTAMENTE TÓXICO PARA ABELHAS. Evitar aplicação durante floração.',
      molecularFormula: 'C6H8ClN5O2S',
    },
  ];
}

function getDefaultProcedures(): Procedure[] {
  return [
    {
      title: 'Preparação do Equipamento',
      icon: 'cog',
      content: 'Inspeção completa do massageador industrial antes do uso',
      steps: [
        'Inspecione visualmente todas as partes do equipamento',
        'Verifique se o equipamento está limpo e sem resíduos',
        'Valide conectores, mangueiras e vedações',
        'Teste funcionamento básico em modo vazio por 30 segundos',
        'Documente a inspeção no formulário de checklist',
      ],
      tips: [
        'Use EPI completo durante a inspeção',
        'Nunca opere com ruídos anormais',
        'Lubrifique conforme manual do fabricante',
      ],
      duration: '10-15',
    },
    {
      title: 'Carregamento de Ingredientes',
      icon: 'flask',
      content: 'Processo seguro de adição de matérias-primas',
      steps: [
        'Pesar cada ingrediente conforme receita técnica',
        'Conferir datas de validade e lotes',
        'Adicionar na sequência correta (líquidos primeiro, depois sólidos)',
        'Usar EPI completo durante todo o processo',
        'Manter registro de lote para rastreabilidade',
        'Verificar compatibilidade química antes da mistura',
      ],
      tips: [
        'Sempre use balanças calibradas',
        'Evite contaminação cruzada',
        'Registre qualquer anomalia imediatamente',
      ],
      duration: '15-20',
    },
    {
      title: 'Ciclo de Massagem',
      icon: 'play-circle',
      content: 'Processo de homogeneização da formulação',
      steps: [
        'Inicie o ciclo seguindo os parâmetros da receita',
        'Monitore temperatura constantemente (não exceder 40°C)',
        'Observe a homogeneidade visual da mistura',
        'Cronometro ativo - respeite o tempo determinado',
        'Abra apenas após confirmação de homogeneidade completa',
        'Documente os parâmetros do ciclo',
      ],
      tips: [
        'Nunca abra antes do tempo',
        'Use sensor de temperatura digital',
        'Faça pausas se necessário para evitar superaquecimento',
      ],
      duration: '8-12',
    },
    {
      title: 'Verificação de Qualidade',
      icon: 'checkmark-circle',
      content: 'Controles de qualidade da formulação final',
      steps: [
        'Inspecione visualmente cores e aspecto',
        'Teste consistência/viscosidade',
        'Valide pH conforme especificação (5.5-7.0)',
        'Teste dispersibilidade em água',
        'Documente todos os resultados no relatório',
        'Aprove ou rejeite conforme critérios',
      ],
      tips: [
        'Use equipamentos calibrados',
        'Compare com amostra padrão',
        'Em caso de dúvida, rejeite o lote',
      ],
      duration: '10-15',
    },
    {
      title: 'Descarga e Embalagem',
      icon: 'archive',
      content: 'Transferência e acondicionamento do produto final',
      steps: [
        'Descarregue com cuidado usando sistema fechado',
        'Use EPI apropriado para evitar contato',
        'Etiquete corretamente com lote e validade',
        'Armazene em local fresco e arejado',
        'Registre saída no sistema de inventário',
        'Limpe o equipamento imediatamente após uso',
      ],
      tips: [
        'Evite respingos e derramamentos',
        'Recipientes devem estar limpos e secos',
        'Documente qualquer perda de produto',
      ],
      duration: '15-20',
    },
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  heroCard: {
    margin: 20,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    minHeight: 200,
  },
  heroContent: {
    flex: 1,
  },
  heroBadge: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 36,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 20,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 20,
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  heroImageContainer: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.3,
  },
  categoriesScroll: {
    marginVertical: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryTab: {
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryLabel: {
    fontSize: 14,
  },
  coursesSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 13,
  },
  gridContainer: {
    paddingHorizontal: 12,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: 4,
  },
  courseCard: {
    borderRadius: 20,
    padding: 16,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  cardBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    width: '100%',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalClose: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00BCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 16,
  },
  modalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalStatText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
