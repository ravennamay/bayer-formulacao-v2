// =====================================================================
// TYPES
// =====================================================================

export type Recipe = {
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
  massageTime?: string;
};

export type Chemistry = {
  name: string;
  alias: string;
  className: string;
  func: string;
  applications: string;
  safety: string;
  image?: string;
  molecularFormula?: string;
};

export type Procedure = {
  title: string;
  icon: any;
  content: string;
  steps?: string[];
  tips?: string[];
  duration?: string;
};

export type Tutorial = {
  id: string;
  title: string;
  icon: string;
  description: string;
  duration: string;
  level: 'Fácil' | 'Médio' | 'Avançado';
  videoUrl?: string;
  videoThumbnail?: string;
  content?: string;
  steps?: string[];
};

export type EPI = {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  importance: 'Crítico' | 'Alto' | 'Médio';
  usage: string;
  image?: string;
  maintenanceTips?: string[];
};

export type SafetyTip = {
  id: string;
  title: string;
  icon: string;
  description: string;
  severity: 'Crítico' | 'Alto' | 'Médio';
  details?: string;
  preventionSteps?: string[];
};

export type GuideCategory =
  | 'produtos'
  | 'quimica'
  | 'procedimentos'
  | 'seguranca'
  | 'epis'
  | 'tutorial'
  | 'receita'
  | 'fretado';

// =====================================================================
// FRETADO / TURSAN BUS ROUTES
// =====================================================================

export type BusSchedule = {
  time: string;
  type: 'TURNO' | 'TURNO MANHA' | 'TURNO TARDE' | 'TURNO TARDE/NOITE' | 'TURNO MANHA/NOITE' | 'ADM';
  days: string;
  lineNumber: string;
};

export type BusRoute = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  schedules: BusSchedule[];
  observation?: string;
};

export const defaultBusRoutes: BusRoute[] = [
  {
    id: 'route-1',
    name: 'BAYER X ALCANTARA',
    origin: 'Bayer',
    destination: 'Alcântara',
    schedules: [
      { time: '06:30', type: 'TURNO MANHA/NOITE', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1275' },
      { time: '14:30', type: 'TURNO TARDE', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1275' },
      { time: '22:30', type: 'TURNO MANHA/NOITE', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1275' },
    ],
  },
  {
    id: 'route-2',
    name: 'BAYER X CAXIAS',
    origin: 'Bayer',
    destination: 'Duque de Caxias',
    schedules: [
      { time: '06:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1249' },
      { time: '14:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1249' },
      { time: '22:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1249' },
    ],
  },
  {
    id: 'route-3',
    name: 'BAYER X CENTRO',
    origin: 'Bayer',
    destination: 'Centro (Rio)',
    schedules: [
      { time: '06:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1259' },
      { time: '14:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1259' },
      { time: '22:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1259' },
    ],
  },
  {
    id: 'route-4',
    name: 'BAYER X LEBLON',
    origin: 'Bayer',
    destination: 'Leblon',
    schedules: [
      { time: '17:05', type: 'ADM', days: 'Seg, Ter, Qua, Qui, Sex', lineNumber: '1248' },
    ],
  },
  {
    id: 'route-5',
    name: 'BAYER X MIGUEL COUTO',
    origin: 'Bayer',
    destination: 'Miguel Couto',
    schedules: [
      { time: '06:30', type: 'TURNO MANHA', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1252' },
      { time: '14:30', type: 'TURNO TARDE/NOITE', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1252' },
      { time: '22:30', type: 'TURNO TARDE/NOITE', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1252' },
    ],
  },
  {
    id: 'route-6',
    name: 'BAYER X PACIENCIA / TAQUARA',
    origin: 'Bayer',
    destination: 'Paciência / Taquara',
    schedules: [
      { time: '17:05', type: 'ADM', days: 'Seg, Ter, Qua, Qui, Sex', lineNumber: '1261' },
    ],
  },
  {
    id: 'route-7',
    name: 'BAYER X PETROPOLIS',
    origin: 'Bayer',
    destination: 'Petrópolis',
    schedules: [
      { time: '17:05', type: 'ADM', days: 'Seg, Ter, Qua, Qui, Sex', lineNumber: '1257' },
    ],
  },
  {
    id: 'route-8',
    name: 'BAYER X SANTA CRUZ',
    origin: 'Bayer',
    destination: 'Santa Cruz',
    schedules: [
      { time: '06:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1273' },
      { time: '14:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1273' },
      { time: '22:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1273' },
    ],
  },
  {
    id: 'route-9',
    name: 'BAYER X TIJUCA',
    origin: 'Bayer',
    destination: 'Tijuca',
    schedules: [
      { time: '17:05', type: 'ADM', days: 'Seg, Ter, Qua, Qui, Sex', lineNumber: '1254' },
    ],
  },
  {
    id: 'route-10',
    name: 'CAXIAS X BAYER',
    origin: 'Duque de Caxias',
    destination: 'Bayer',
    schedules: [
      { time: '04:40', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1249' },
      { time: '11:30', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1249' },
      { time: '20:25', type: 'TURNO', days: 'Dom, Seg, Ter, Qua, Qui, Sex, Sab', lineNumber: '1249' },
    ],
  },
];

// =====================================================================
// NEW: PRODUCT DETAIL CATALOG
// =====================================================================

export type ProductCategory =
  | 'Fungicida'
  | 'Inseticida'
  | 'Acaricida'
  | 'Regulador de Crescimento';

export type ActiveIngredient = {
  name: string;
  percentage?: string;
  role?: string;
};

export type ProductDetail = {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  purpose: string;
  characteristics: string[];
  activeIngredients: ActiveIngredient[];
  hasMassageEffect: boolean;
  massageTime?: string;
  massageNotes?: string;
  applicationGuidelines: string[];
  technicalInfo: string[];
  specialNote?: string;
  isRecipe: boolean; // false for NATIVO and FOX XPRO
  compatibleRecipes?: string[];
  bagsPerLot?: number;
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  Fungicida: '#89D329',
  Inseticida: '#F59E0B',
  Acaricida: '#EC4899',
  'Regulador de Crescimento': '#8B5CF6',
};

export const defaultCatalog: ProductDetail[] = [
  {
    id: 'alsystin',
    name: 'ALSYSTIN',
    category: 'Inseticida',
    subcategory: 'Regulador de Crescimento de Insetos',
    purpose:
      'Controle de lagartas (Spodoptera frugiperda, Helicoverpa armigera) e outros lepidópteros em soja, milho, algodão e demais culturas.',
    characteristics: [
      'Inibe a síntese de quitina (grupo 15 da IRAC)',
      'Modo de ação único com baixo risco de resistência cruzada',
      'Baixa toxicidade para mamíferos e inimigos naturais',
      'Seletivo para organismos benéficos do ecossistema',
      'Efetivo em larvas jovens (instares iniciais)',
    ],
    activeIngredients: [
      { name: 'Triflumuron', percentage: '250 g/L', role: 'Inibidor de síntese de quitina' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Aplicar nas fases iniciais de desenvolvimento das lagartas',
      'Usar volume de calda adequado para cobertura total da folhagem',
      'Realizar monitoramento antes e após a aplicação',
      'Respeitar o intervalo de segurança (IEP) conforme bula',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: IV — Pouco tóxico',
      'Classe ambiental: II — Produto perigoso ao meio ambiente',
      'Mecanismo: Ecdisônio (inibição de muda)',
    ],
    isRecipe: false,
  },
  {
    id: 'bulldock',
    name: 'BULLDOCK',
    category: 'Inseticida',
    subcategory: 'Piretróide',
    purpose:
      'Controle de pulgões, tripes, lagartas e demais pragas sugadoras e mastigadoras em soja, algodão, milho e horticultura.',
    characteristics: [
      'Ação por contato e ingestão de alta eficiência',
      'Efeito knock-down rápido sobre insetos-praga',
      'Resistente à chuva após secagem da calda',
      'Amplo espectro com dose reduzida',
    ],
    activeIngredients: [
      { name: 'beta-Ciflutrina', percentage: '125 g/L', role: 'Piretróide sintético — ação no sistema nervoso' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Aplicar nas primeiras horas da manhã ou ao entardecer para evitar deriva',
      'Não misturar com produtos alcalinos',
      'Usar no início da infestação para maior eficiência',
      'Alternar mecanismos de ação para prevenir resistência',
    ],
    technicalInfo: [
      'Formulação: Emulsão concentrada (EC)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Classe ambiental: II — Perigoso ao meio ambiente',
      'Grupo IRAC: 3A (Moduladores do canal de sódio)',
    ],
    isRecipe: false,
  },
  {
    id: 'connect',
    name: 'CONNECT',
    category: 'Inseticida',
    subcategory: 'Neonicotinoide + Piretróide',
    purpose:
      'Controle de pulgões, tripes, mosca-branca, lagartas e pragas sugadoras em soja, milho e culturas diversas através da dupla ação.',
    characteristics: [
      'Combinação sinérgica: sistêmico + contato/ingestão',
      'Imidacloprid garante controle sistêmico duradouro',
      'beta-Ciflutrina oferece efeito knock-down imediato',
      'Amplo espectro de controle em uma única aplicação',
      'Alta eficácia mesmo em condições adversas',
    ],
    activeIngredients: [
      { name: 'Imidacloprid', percentage: '100 g/L', role: 'Neonicotinoide — ação sistêmica' },
      { name: 'beta-Ciflutrina', percentage: '12,5 g/L', role: 'Piretróide — ação por contato' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Aplicar ao primeiro sinal de infestação',
      'Usar equipamento calibrado para cobertura uniforme',
      'Não aplicar em período de floração para preservar abelhas',
      'Observar carência de acordo com a bula para cada cultura',
    ],
    technicalInfo: [
      'Formulação: Concentrado emulsionável (EC)',
      'Classe toxicológica: II — Altamente tóxico',
      'Grupo IRAC (Imidacloprid): 4A / (beta-Ciflutrina): 3A',
      'Persistência sistêmica: 14-21 dias',
    ],
    isRecipe: false,
    bagsPerLot: 4,
  },
  {
    id: 'curbix',
    name: 'CURBIX',
    category: 'Inseticida',
    subcategory: 'Sulfoximina',
    purpose:
      'Controle de mosca-branca, pulgões e tripes, incluindo populações resistentes a neonicotinoides, em soja, algodão, hortaliças e outros.',
    characteristics: [
      'Modo de ação inovador — grupo 4C da IRAC (Sulfoximinas)',
      'Efetivo em populações resistentes a neonicotinoides',
      'Menor pressão de seleção de resistência',
      'Alta eficácia em baixas doses por hectare',
      'Boa compatibilidade com programas de MIP',
    ],
    activeIngredients: [
      { name: 'Sulfoxaflor', percentage: '240 g/L', role: 'Agonista receptor de acetilcolina nicotínico (nAChR)' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Evitar aplicações em condições de alta temperatura (>30°C)',
      'Não aplicar durante floração para proteger polinizadores',
      'Alternar com outros grupos IRAC no programa de manejo',
      'Usar adjuvante silicone para melhor ação em mosca-branca',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Classe ambiental: III — Perigoso ao meio ambiente',
      'Grupo IRAC: 4C — Nova classe, sem resistência cruzada com 4A',
    ],
    isRecipe: false,
    bagsPerLot: 8,
  },
  {
    id: 'fox-xpro',
    name: 'FOX XPRO',
    category: 'Fungicida',
    subcategory: 'QoI + DMI + SDHI (Tripla Ação)',
    purpose:
      'Controle de doenças foliares em soja, trigo e outras culturas: ferrugem asiática, oídio, mancha alvo, cercospora e Sclerotinia.',
    characteristics: [
      'Três mecanismos de ação em uma só formulação',
      'Tecnologia Leafshield para máxima cobertura e penetração foliar',
      'APENAS Trifloxystrobin passa pelo ciclo de massagem',
      'Bixafen e Prothioconazole são descascados e adicionados por empilhamento',
      'Alta eficácia preventiva e curativa de amplo espectro',
    ],
    activeIngredients: [
      { name: 'Trifloxystrobin', role: 'QoI — massageado (ciclo de massagem)' },
      { name: 'Prothioconazole', role: 'DMI — descascado e empilhado (sem massagem)' },
      { name: 'Bixafen', role: 'SDHI — descascado e empilhado (sem massagem)' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Trifloxystrobin: submeter ao ciclo de massagem normalmente',
      'Bixafen e Prothioconazole: descascar e adicionar por empilhamento — sem ciclo de massagem',
      'Aplicar preventivamente, antes do surgimento dos sintomas',
      'Respeitar intervalo mínimo entre aplicações conforme bula',
      'Usar EPI completo durante o manuseio',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupos FRAC: 11 (QoI) + 3 (DMI) + 7 (SDHI)',
      'Processo: Trifloxystrobin — massagem | Bixafen + Prothioconazole — empilhamento',
    ],
    specialNote:
      'ATENÇÃO — FOX XPRO: somente o Trifloxystrobin passa pelo ciclo de massagem. Bixafen e Prothioconazole são descascados e adicionados por empilhamento (sem massagem).',
    isRecipe: false,
  },
  {
    id: 'fox-ultra',
    name: 'FOX ULTRA',
    category: 'Fungicida',
    subcategory: 'QoI + DMI + Morfolina',
    purpose:
      'Controle de oídio, ferrugens, septoriose e outras doenças foliares em trigo, cevada, soja e cereais de inverno.',
    characteristics: [
      'Tripla ação fungicida com cobertura ampla de espectro',
      'Spiroxamine garante controle específico de oídio',
      'Prothioconazole com excelente atividade sistêmica',
      'Alta performance em doenças de final de ciclo',
      'Aprovado para uso em programas de resistência',
    ],
    activeIngredients: [
      { name: 'Trifloxystrobin', role: 'QoI — Inibidor da respiração mitocondrial' },
      { name: 'Prothioconazole', role: 'DMI — Inibidor da biossíntese de ergosterol' },
      { name: 'Spiroxamine', role: 'Morfolina — Duplo mecanismo de inibição de ergosterol' },
    ],
    hasMassageEffect: true,
    massageTime: '~5-6 minutos (somente Trifloxystrobin)',
    massageNotes: 'Apenas o Trifloxystrobin passa pelo ciclo de massagem. Spiroxamine e Prothioconazole são adicionados sem massagem (empilhamento).',
    applicationGuidelines: [
      'Trifloxystrobin: submeter ao ciclo de massagem normalmente',
      'Spiroxamine e Prothioconazole: adicionar por empilhamento — sem ciclo de massagem',
      'Aplicar preventivamente no estádio correto da cultura',
      'Monitorar condições climáticas favoráveis para doenças',
      'Usar em rotação com outros grupos FRAC',
      'Verificar intervalo de segurança (carência) para cada cultura',
    ],
    technicalInfo: [
      'Formulação: Emulsão concentrada (EC)',
      'Classe toxicológica: III',
      'Grupos FRAC: 11, 3, 5',
      'Alta compatibilidade com tanque-mix quando testada',
    ],
    isRecipe: false,
  },
  {
    id: 'nativo',
    name: 'NATIVO',
    category: 'Fungicida',
    subcategory: 'Triazol + QoI (Dupla Ação)',
    purpose:
      'Proteção preventiva e curativa contra ferrugem asiática, oídio, cercospora, mancha parda e doenças de final de ciclo em soja e trigo.',
    characteristics: [
      'Formulação granulada dispersível em água (WG)',
      'Combinação sinérgica de dois mecanismos de ação complementares',
      'Tebuconazole (Triazol) inibe a biossíntese de ergosterol',
      'Trifloxystrobin (QoI) bloqueia a respiração mitocondrial do fungo',
      'Alta eficácia em condições de alta pressão de doenças',
    ],
    activeIngredients: [
      { name: 'Tebuconazole', percentage: '50%', role: 'Triazol DMI — Inibição de ergosterol' },
      { name: 'Trifloxystrobin', percentage: '25%', role: 'QoI — Inibição da quinona externa' },
    ],
    hasMassageEffect: true,
    massageTime: '~6-8 minutos (ciclo completo)',
    massageNotes: 'Ambos os ingredientes — Tebuconazole e Trifloxystrobin — são submetidos ao ciclo de massagem completo para homogeneização uniforme.',
    applicationGuidelines: [
      'Dissolver o produto em água antes de adicionar ao tanque',
      'Agitar continuamente durante a pulverização',
      'Aplicar preventivamente no fechamento do dossel',
      'Não exceder o número máximo de aplicações por safra',
    ],
    technicalInfo: [
      'Formulação: Granulado dispersível em água (WG)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupos FRAC: 3 (Triazol) + 11 (QoI)',
      'Persistência: 14-21 dias dependendo das condições',
    ],
    specialNote:
      'ATENÇÃO — No processo de formulação industrial, NATIVO possui ação sobre AMBOS os ingredientes: Tebuconazole E Trifloxystrobin. Por essa razão, NATIVO NÃO é categorizado como receita de tratamento de sementes neste sistema — permanece exclusivamente como produto.',
    isRecipe: false,
  },
  {
    id: 'oberon',
    name: 'OBERON',
    category: 'Acaricida',
    subcategory: 'Cetoenol',
    purpose:
      'Controle de ácaros (Tetranychus urticae, Panonychus ulmi) e mosca-branca em soja, algodão, frutas e culturas protegidas.',
    characteristics: [
      'Inibe a biossíntese de lipídios nos ácaros (mecanismo único)',
      'Atua efetivamente em todos os estágios: ovos, ninfas e adultos',
      'Baixo risco de resistência por modo de ação distinto',
      'Seletivo para predadores e inimigos naturais',
      'Longa duração de controle residual',
    ],
    activeIngredients: [
      { name: 'Spiromesifene', percentage: '240 g/L', role: 'Cetoenol — Inibição de biosíntese de lipídios' },
    ],
    hasMassageEffect: true,
    massageTime: '~5 minutos (com Universal)',
    massageNotes: 'OBERON deve ser massageado em combinação com o produto Universal para garantir homogeneização adequada nas sementes.',
    applicationGuidelines: [
      'Aplicar quando ácaros forem detectados no monitoramento',
      'Garantir boa cobertura da face abaxial (inferior) das folhas',
      'Usar em rotação com outros acaricidas de grupos distintos',
      'Respeitar volume mínimo de calda para penetração no dossel',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: IV — Pouco tóxico',
      'Grupo IRAC: 23 — Inibidor de acetil-CoA carboxilase',
      'Seletivo para ácaros predadores do gênero Phytoseiidae',
    ],
    isRecipe: false,
  },
  {
    id: 'premier-plus',
    name: 'PREMIER PLUS',
    category: 'Inseticida',
    subcategory: 'Neonicotinoide + Piretróide — Tratamento de Sementes',
    purpose:
      'Tratamento de sementes para proteção contra cupins, corós, pulgões, cigarrinhas e pragas de solo nas fases iniciais da cultura.',
    characteristics: [
      'Duplo modo de ação: sistêmico (Tiametoxam) + contato (Lambda-cialotrina)',
      'Proteção desde a germinação até os estádios iniciais',
      'Absorção rápida pela semente e sistema radicular',
      'Eficácia prolongada contra pragas de solo',
      'Compatível com tratamento industrial de sementes',
    ],
    activeIngredients: [
      { name: 'Tiametoxam', role: 'Neonicotinoide — IRAC 4A, ação sistêmica' },
      { name: 'Lambda-cialotrina', role: 'Piretróide — IRAC 3A, ação por contato' },
    ],
    hasMassageEffect: true,
    massageTime: '~5 minutos (ciclo padrão)',
    massageNotes: 'Tempo de massagem padrão para homogeneização em tratamento de sementes.',
    applicationGuidelines: [
      'Utilizar equipamento de tratamento de sementes calibrado',
      'Garantir cobertura uniforme das sementes durante o processo',
      'Respeitar a dosagem por 100 kg de sementes conforme bula',
      'Secar as sementes adequadamente antes do armazenamento',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada para tratamento (FS)',
      'Classe toxicológica: I — Extremamente tóxico',
      'Uso exclusivo em tratamento de sementes',
      'Manuseio obrigatório com EPI completo',
    ],
    isRecipe: true,
    compatibleRecipes: ['Tratamento industrial de sementes de soja', 'Tratamento de sementes de milho'],
  },
  {
    id: 'provado',
    name: 'PROVADO',
    category: 'Inseticida',
    subcategory: 'Neonicotinoide',
    purpose:
      'Controle sistêmico de pulgões, mosca-branca, cigarrinhas, tripes e outros insetos-praga em diversas culturas.',
    characteristics: [
      'Alta atividade sistêmica — absorvido e translocado pela planta',
      'Proteção prolongada: 14 a 21 dias após a aplicação',
      'Efetivo contra insetos vetores de viroses',
      'Múltiplas culturas registradas',
      'Pode ser utilizado via foliar ou no solo',
    ],
    activeIngredients: [
      { name: 'Imidacloprid', percentage: '200 g/L', role: 'Neonicotinoide — Agonista do receptor nicotínico de acetilcolina' },
    ],
    hasMassageEffect: true,
    massageTime: '~5 minutos (ciclo padrão)',
    massageNotes: 'Homogeneização padrão quando utilizado em tratamento de sementes.',
    applicationGuidelines: [
      'Verificar registro para a cultura e praga-alvo antes da aplicação',
      'Não aplicar em floração para proteger abelhas',
      'Alternar com inseticidas de outros grupos para manejo de resistência',
      'Ajustar dose conforme nível de infestação e cultura',
    ],
    technicalInfo: [
      'Formulação: Concentrado solúvel (SL)',
      'Classe toxicológica: II — Altamente tóxico',
      'Grupo IRAC: 4A — Neonicotinoide',
      'Intervalo de segurança: variável por cultura (ver bula)',
    ],
    isRecipe: true,
    compatibleRecipes: ['Tratamento foliar', 'Tratamento de solo', 'Fertirrigação'],
  },
  {
    id: 'sphere-max',
    name: 'SPHERE MAX',
    category: 'Fungicida',
    subcategory: 'QoI + Triazol',
    purpose:
      'Controle de ferrugem asiática, oídio, septoriose, manchas foliares e doenças de final de ciclo em soja, trigo e cevada.',
    characteristics: [
      'Dois mecanismos de ação complementares (QoI + Triazol)',
      'Alta eficácia no controle de doenças de final de ciclo',
      'Excelente distribuição sistêmica pelo tecido foliar',
      'Formulação que favorece a absorção rápida',
      'Boa performance em condições de alta umidade',
    ],
    activeIngredients: [
      { name: 'Trifloxystrobin', role: 'QoI — Inibição da quinona externa mitocondrial' },
      { name: 'Ciproconazole', role: 'Triazol DMI — Inibição de demetilação do ergosterol' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Realizar aplicação preventiva antes da infecção fúngica',
      'Usar volumes de calda de 100 a 200 L/ha',
      'Alternar com outros grupos FRAC nas safras subsequentes',
      'Aplicar nas horas mais frescas do dia para evitar deriva térmica',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupos FRAC: 11 (QoI) + 3 (Triazol)',
      'Registro em múltiplas culturas no Brasil',
    ],
    isRecipe: false,
  },
  {
    id: 'finish',
    name: 'FINISH',
    category: 'Regulador de Crescimento',
    subcategory: 'Etefon — Etileno',
    purpose:
      'Uniformizar e antecipar a maturação fisiológica de sementes, facilitar a colheita mecânica e melhorar a qualidade do produto final.',
    characteristics: [
      'Libera etileno na planta após absorção e metabolização',
      'Acelera a senescência foliar e o processo de maturação',
      'Reduz o período de exposição a condições climáticas adversas',
      'Melhora a uniformidade de maturação em lotes heterogêneos',
      'Facilita a operação de colheita e reduz perdas mecânicas',
    ],
    activeIngredients: [
      { name: 'Etefon', percentage: '720 g/L', role: 'Regulador de crescimento — liberador de etileno' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Aplicar somente no estádio de maturação fisiológica (R7/R8 em soja)',
      'Não aplicar em condições de estresse hídrico severo',
      'Temperatura ideal de aplicação: entre 15°C e 30°C',
      'Não misturar com produtos de reação alcalina',
      'Observar o pH da calda (manter abaixo de 6,5)',
    ],
    technicalInfo: [
      'Formulação: Concentrado solúvel (SL)',
      'Classe toxicológica: I — Extremamente tóxico',
      'Mecanismo: Liberação de etileno endógeno nas células da planta',
      'Sensível ao pH — evitar caldas alcalinas',
    ],
    isRecipe: false,
  },
  {
    id: 'soberan',
    name: 'SOBERAN',
    category: 'Fungicida',
    subcategory: 'SDHI + QoI (Dupla Ação)',
    purpose:
      'Controle de ferrugem asiática, mancha alvo, antracnose, mofo-branco e outras doenças em soja, milho e cereais.',
    characteristics: [
      'Combinação SDHI + QoI para manejo de resistência',
      'Fluxapiroxade oferece alta eficácia residual e sistêmica',
      'Piraclostrobina proporciona efeito verde da planta (greening)',
      'Ação preventiva e curativa de amplo espectro',
      'Aprovado em programas de manejo integrado de doenças',
    ],
    activeIngredients: [
      { name: 'Fluxapiroxade', role: 'SDHI — Inibição da succinato desidrogenase (complexo II)' },
      { name: 'Piraclostrobina', role: 'QoI — Inibição da quinona externa (complexo III)' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Aplicar preventivamente no início do período crítico de infecção',
      'Usar volume de calda adequado para cobertura completa',
      'Alternar com fungicidas de grupos FRAC distintos',
      'Monitorar resistência em programas de alerta fitossanitário',
    ],
    technicalInfo: [
      'Formulação: Emulsão em água (EW)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupos FRAC: 7 (SDHI) + 11 (QoI)',
      'Alta eficácia em doenças de difícil controle',
    ],
    isRecipe: false,
  },
  {
    id: 'verango',
    name: 'VERANGO',
    category: 'Fungicida',
    subcategory: 'SDHI + QoI — Tecnologia BiActive',
    purpose:
      'Controle de ferrugem asiática, doenças de final de ciclo, oídio e outras doenças fúngicas em soja, trigo e diversas culturas.',
    characteristics: [
      'Tecnologia BiActive com dois ingredientes ativos complementares',
      'Fluopyram (SDHI): amplo espectro e ação sistêmica superior',
      'Trifloxystrobin (QoI): cobertura foliar superior e ação protetora',
      'Alta eficácia mesmo em cenários de alta pressão de doença',
      'Efeito sobre qualidade de grãos e produtividade',
    ],
    activeIngredients: [
      { name: 'Fluopyram', role: 'SDHI — Inibição do complexo II da cadeia respiratória mitocondrial' },
      { name: 'Trifloxystrobin', role: 'QoI — Inibição da quinona externa mitocondrial' },
    ],
    hasMassageEffect: true,
    massageTime: '~5-6 minutos (ciclo padrão)',
    massageNotes: 'Fluopyram e Trifloxystrobin passam pelo ciclo de massagem para homogeneização completa.',
    applicationGuidelines: [
      'Aplicar preventivamente ou nos primeiros sintomas',
      'Respeitar o volume mínimo de calda por hectare',
      'Utilizar pontas de pulverização adequadas para cobertura uniforme',
      'Integrar com outras práticas do Manejo Integrado de Doenças',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupos FRAC: 7 (SDHI) + 11 (QoI)',
      'Registro em soja, trigo, amendoim e outras culturas',
    ],
    isRecipe: false,
    bagsPerLot: 11,
  },
  {
    id: 'gaucho',
    name: 'GAUCHO',
    category: 'Inseticida',
    subcategory: 'Neonicotinoide — Tratamento de Sementes',
    purpose:
      'Tratamento de sementes para controle de cupins, corós, pulgões, cigarrinhas e pragas de solo nas fases iniciais de desenvolvimento da cultura.',
    characteristics: [
      'Alta concentração de Imidacloprid (600 g/kg) para tratamento de sementes',
      'Proteção sistêmica desde a germinação',
      'Controla pragas de solo e parte aérea nos estádios iniciais',
      'Distribui-se uniformemente pela planta via absorção radicular',
      'Compatível com inoculantes e outros tratamentos de sementes',
    ],
    activeIngredients: [
      { name: 'Imidacloprid', percentage: '600 g/kg', role: 'Neonicotinoide — IRAC 4A, sistêmico' },
    ],
    hasMassageEffect: false,
    applicationGuidelines: [
      'Usar dosagem recomendada por 100 kg de sementes (ver bula)',
      'Garantir cobertura uniforme com equipamento de tratamento adequado',
      'Secar as sementes tratadas antes do armazenamento',
      'Transportar e armazenar separadamente de alimentos e rações',
      'Usar EPI completo durante o tratamento',
    ],
    technicalInfo: [
      'Formulação: Pó molhável (WP) ou suspensão concentrada (FS)',
      'Classe toxicológica: II — Altamente tóxico',
      'Grupo IRAC: 4A — Neonicotinoide',
      'Uso exclusivo: Tratamento industrial e/ou artesanal de sementes',
    ],
    isRecipe: true,
    compatibleRecipes: [
      'Tratamento industrial de sementes de soja',
      'Tratamento de sementes de milho',
      'Tratamento de sementes de trigo e cevada',
    ],
  },
  {
    id: 'fox-pro',
    name: 'FOX PRO',
    category: 'Fungicida',
    subcategory: 'QoI + DMI (Dupla Ação)',
    purpose: 'Controle de ferrugem asiática, oídio, septoriose e doenças foliares em soja, trigo e culturas diversas.',
    characteristics: [
      'Combinação Trifloxystrobin (QoI) + Prothioconazole (DMI)',
      'Produto embalado em bombona com lacre de segurança',
      'No processo de formulação, APENAS Trifloxystrobin é massageado',
      'Prothioconazole e demais componentes são adicionados por empilhamento',
      'Ação preventiva e curativa de amplo espectro',
    ],
    activeIngredients: [
      { name: 'Trifloxystrobin', role: 'QoI — Inibição da quinona externa mitocondrial' },
      { name: 'Prothioconazole', role: 'DMI — Inibição da biossíntese de ergosterol' },
    ],
    hasMassageEffect: false,
    specialNote:
      'ATENÇÃO — No processo de formulação industrial, FOX PRO possui ação de massagem APENAS sobre o ingrediente Trifloxystrobin. Os demais ingredientes (Prothioconazole) são adicionados por empilhamento, sem ciclo de massagem. Embalagem: bombona com lacre — remover lacre antes do uso.',
    applicationGuidelines: [
      'Remover lacre da bombona antes de abrir o produto',
      'Medir volume conforme receita técnica aprovada',
      'Trifloxystrobin é o único ingrediente submetido ao ciclo de massagem',
      'Prothioconazole deve ser empilhado (adicionado sem massagem)',
      'Usar EPI completo durante o manuseio',
    ],
    technicalInfo: [
      'Embalagem: Bombona com lacre de segurança',
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupos FRAC: 11 (QoI) + 3 (DMI)',
    ],
    isRecipe: false,
  },
  {
    id: 'fox-supra',
    name: 'FOX SUPRA',
    category: 'Fungicida',
    subcategory: 'DMI + SDHI (Dupla Ação)',
    purpose: 'Controle de ferrugem asiática, mancha alvo, oídio e doenças foliares em soja e demais culturas.',
    characteristics: [
      'Dupla ação: Prothioconazole (DMI) + Inpyrfluxam (SDHI)',
      'Produto embalado em bombona com lacre de segurança',
      'NÃO possui ciclo de massagem — adicionado por empilhamento',
      'Pode ser empilhado sobre outros tratamentos de sementes',
      'Alta eficácia preventiva e curativa em programa de manejo de resistência',
    ],
    activeIngredients: [
      { name: 'Prothioconazole', role: 'DMI — Inibição da biossíntese de ergosterol' },
      { name: 'Inpyrfluxam', role: 'SDHI — Inibição da succinato desidrogenase (complexo II)' },
    ],
    hasMassageEffect: false,
    specialNote:
      'FOX SUPRA NÃO possui ciclo de massagem. Produto adicionado por empilhamento (bag sobre bag). Pode ser empilhado. Remover lacre da bombona antes do uso.',
    applicationGuidelines: [
      'Remover lacre da bombona antes de abrir o produto',
      'Adicionar por empilhamento — sem ciclo de massagem',
      'Pode ser empilhado sobre outros tratamentos de sementes',
      'Medir volume conforme receita técnica aprovada',
      'Verificar compatibilidade com outros produtos no processo',
      'Usar EPI completo durante o manuseio da bombona',
    ],
    technicalInfo: [
      'Embalagem: Bombona com lacre de segurança',
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupos FRAC: 3 (DMI) + 7 (SDHI)',
    ],
    isRecipe: false,
  },
  {
    id: 'cropstar',
    name: 'CROPSTAR',
    category: 'Inseticida',
    subcategory: 'Neonicotinoide + Carbamato — Tratamento de Sementes',
    purpose: 'Tratamento de sementes para controle de cupins, corós, pulgões, cigarrinhas e pragas de solo nas fases iniciais da cultura.',
    characteristics: [
      'Combinação Imidacloprid (sistêmico) + Thiodicarb (contato/ingestão)',
      'Produto embalado em bombona com lacre de segurança',
      'NÃO passa pelo processo de massagem — adicionado por empilhamento',
      'Proteção desde a germinação até os estádios iniciais da planta',
      'Alta eficácia no controle de pragas de solo e parte aérea',
    ],
    activeIngredients: [
      { name: 'Imidacloprid', percentage: '150 g/L', role: 'Neonicotinoide — IRAC 4A, ação sistêmica' },
      { name: 'Thiodicarb', percentage: '450 g/L', role: 'Carbamato — IRAC 1A, ação por contato e ingestão' },
    ],
    hasMassageEffect: false,
    specialNote:
      'ATENÇÃO — CROPSTAR NÃO é massageado. Produto embalado em bombona com lacre de segurança. Remover lacre antes do uso. Adicionado por empilhamento ao tratamento de sementes, sem ciclo de massagem.',
    applicationGuidelines: [
      'Remover lacre da bombona antes de abrir o produto',
      'Adicionar por empilhamento — sem ciclo de massagem',
      'Dosagem conforme bula para cada cultura (100 kg de sementes)',
      'Usar apenas em tratamento de sementes, nunca em aplicação foliar',
      'Usar EPI completo (incluindo máscara respiratória) durante o manuseio',
    ],
    technicalInfo: [
      'Embalagem: Bombona com lacre de segurança',
      'Formulação: Suspensão concentrada para tratamento de sementes (FS)',
      'Classe toxicológica: I — Extremamente tóxico',
      'Grupos IRAC: 4A (Imidacloprid) + 1A (Thiodicarb)',
    ],
    isRecipe: false,
  },
  {
    id: 'sivanto',
    name: 'SIVANTO PRIME',
    category: 'Inseticida',
    subcategory: 'Butenolida — Tratamento de Sementes',
    purpose: 'Controle de mosca-branca, pulgões, cigarrinhas e insetos sugadores em soja, milho, algodão e hortaliças.',
    characteristics: [
      'Novo grupo químico: Butenolida (IRAC 4D) — baixo risco de resistência cruzada',
      'Modo de ação: agonista seletivo dos receptores nicotínicos de acetilcolina',
      'Alta seletividade para abelhas comparado a neonicotinoides tradicionais',
      'Sistêmico: absorvido e translocado pela planta eficientemente',
      'Efetivo contra populações resistentes a neonicotinoides',
    ],
    activeIngredients: [
      { name: 'Flupyradifurone', percentage: '200 g/L', role: 'Butenolida — Agonista nicotínico seletivo (IRAC 4D)' },
    ],
    hasMassageEffect: true,
    massageTime: '10 minutos e 5 segundos',
    massageNotes: 'SIVANTO PRIME passa pelo ciclo de massagem de 10 min 5 seg para distribuição uniforme do Flupyradifurone nas sementes. Para agilizar o processo, pode-se combinar com Trifloxystrobin (presente em FOX XPRO / SPHERE MAX) no mesmo ciclo — a combinação garante controle inseticida + fungicida em um único tratamento.',
    applicationGuidelines: [
      'Seguir dosagem recomendada por 100 kg de sementes conforme bula',
      'Aplicar com equipamento de tratamento de sementes calibrado',
      'Ciclo de massagem: 10 minutos e 5 segundos para distribuição uniforme',
      'Combinação com Trifloxystrobin (FOX XPRO/SPHERE MAX) permite tratamento inseticida + fungicida mais rápido',
      'Pode ser combinado com fungicidas TS (MONCEREM, MYTHOS) no mesmo ciclo',
      'Aplicar EPI completo: luvas, óculos, máscara PFF2 e avental impermeável',
      'Armazenar sementes tratadas em local ventilado, longe de fontes de calor',
      'Não misturar diretamente com produtos com pH muito ácido ou alcalino',
    ],
    technicalInfo: [
      'Formulação: Concentrado solúvel (SL) — 200 g/L de Flupyradifurone',
      'Classe toxicológica: III — Medianamente tóxico (atenção: tóxico aquático Categoria 1)',
      'Grupo IRAC: 4D — Butenolida (agonista seletivo dos receptores nicotínicos)',
      'Menor risco para polinizadores vs. neonicotinoides tradicionais (Classe 2A abelhas)',
      'Efetivo contra mosca-branca (Bemisia tabaci), pulgões e cigarrinhas',
      'Não apresenta resistência cruzada com neonicotinoides (Grupo 4A)',
      'Sistêmico: absorvido pela semente e translocado para plântula em crescimento',
      'Compatível com a maioria dos fungicidas TS e polímeros de seed treatment',
    ],
    isRecipe: true,
    compatibleRecipes: ['Tratamento industrial de sementes de soja', 'Tratamento de sementes de milho'],
    bagsPerLot: 4,
  },
  {
    id: 'moncerem',
    name: 'MONCEREM',
    category: 'Fungicida',
    subcategory: 'Triazol + Fenilamida — Tratamento de Sementes',
    purpose: 'Proteção de sementes contra fungos de solo e patógenos: tombamento, podridão radicular e mela causados por Rhizoctonia, Fusarium e Pythium.',
    characteristics: [
      'Combinação sinérgica: Ipconazole (Triazol) + Metalaxil (Fenilamida)',
      'Controla tombamento de plântulas causado por Rhizoctonia e Fusarium',
      'Metalaxil: controle específico de Oomicetos (Pythium)',
      'Proteção sistêmica desde a germinação até os estádios iniciais',
      'Alta eficácia em condições de solo encharcado e úmido',
    ],
    activeIngredients: [
      { name: 'Ipconazole', percentage: '7,5 g/L', role: 'Triazol DMI — Inibição da biossíntese de ergosterol' },
      { name: 'Metalaxil', percentage: '37,5 g/L', role: 'Fenilamida — Inibição de RNA polimerase de Oomicetos' },
    ],
    hasMassageEffect: true,
    massageTime: '~5 minutos (ciclo padrão)',
    massageNotes: 'MONCEREM passa pelo ciclo de massagem para distribuição uniforme nas sementes.',
    applicationGuidelines: [
      'Aplicar exclusivamente como tratamento de sementes',
      'Dosagem: conforme bula para cada cultura e tipo de sementes',
      'Utilizar equipamento de tratamento calibrado para cobertura uniforme',
      'Secar as sementes adequadamente antes do armazenamento',
      'Usar EPI completo durante o tratamento',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada para sementes (FS)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupos FRAC: 3 (Triazol / DMI) + 4 (Fenilamida)',
      'Uso exclusivo: Tratamento industrial e artesanal de sementes',
    ],
    isRecipe: true,
    compatibleRecipes: ['Tratamento industrial de sementes de soja', 'Tratamento de sementes de milho'],
  },
  {
    id: 'mythos',
    name: 'MYTHOS',
    category: 'Fungicida',
    subcategory: 'Triazol — Tratamento de Sementes',
    purpose: 'Proteção de sementes contra fungos de solo e foliares. Massageado em combinação com Universal para garantir aderência e distribuição uniforme.',
    characteristics: [
      'Fungicida triazol para tratamento de sementes',
      'Massageado com Universal como carreador base',
      'Ação preventiva e curativa no início do ciclo da cultura',
      'Controla patógenos de solo na fase de germinação',
      'Boa compatibilidade com demais fungicidas e inseticidas no tratamento',
    ],
    activeIngredients: [
      { name: 'Protioconazol', percentage: '250 g/L', role: 'Triazol DMI — Inibição da biossíntese de ergosterol' },
    ],
    hasMassageEffect: true,
    massageTime: '~5 minutos (com Universal)',
    massageNotes: 'MYTHOS deve ser massageado em combinação com o produto Universal para garantir homogeneização adequada e fixação uniforme nas sementes.',
    applicationGuidelines: [
      'Aplicar Universal primeiro para criar a camada base de adesão',
      'Adicionar MYTHOS após o ciclo inicial do Universal',
      'Ciclo de massagem de ~5 minutos em combinação com Universal',
      'Verificar cobertura uniforme visual antes de avançar',
      'Usar EPI completo durante todo o processo de tratamento',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada para tratamento de sementes (FS)',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupo FRAC: 3 (Triazol / DMI)',
      'Requer combinação com Universal no ciclo de massagem',
    ],
    isRecipe: false,
    bagsPerLot: 8,
  },
  {
    id: 'redigo',
    name: 'REDIGO',
    category: 'Fungicida',
    subcategory: 'Triazol — Tratamento de Sementes',
    purpose: 'Tratamento de sementes para controle de brusone, cárie, carvão, Fusarium e manchas foliares em cereais (trigo, cevada, centeio, triticale, aveia) e outras culturas.',
    characteristics: [
      'Ingrediente ativo: Prothioconazole (250 g/L) — triazol de última geração',
      'Amplo espectro: controla fungos causadores de brusone, cárie, carvão coberto e nu, Fusarium e manchas',
      'NÃO necessita de ciclo de massagem — sem efeito de massagem',
      'Produto em embalagem segura, adicionado por empilhamento',
      'Alta eficácia sistêmica — absorvido pela semente e distribuído na plântula',
      'Compatível com inseticidas TS e outros fungicidas de sementes',
    ],
    activeIngredients: [
      { name: 'Prothioconazole', percentage: '250 g/L', role: 'Triazol DMI — Inibição da biossíntese de ergosterol fúngico' },
    ],
    hasMassageEffect: false,
    specialNote:
      'REDIGO não requer ciclo de massagem. Adicionado por empilhamento no tratamento de sementes. Cada lote vem com 6 bags.',
    applicationGuidelines: [
      'Não requer ciclo de massagem — adicionar por empilhamento',
      'Aplicar exclusivamente como tratamento de sementes',
      'Dosagem: conforme bula para cada cultura e patógeno-alvo',
      'Compatível com inseticidas TS (Gaucho, Cropstar) e outros fungicidas',
      'Secar as sementes tratadas antes do armazenamento',
      'Usar EPI completo: luvas, óculos, máscara PFF2 durante o manuseio',
    ],
    technicalInfo: [
      'Formulação: FS — Suspensão concentrada para tratamento de sementes',
      'Classe toxicológica: III — Medianamente tóxico',
      'Grupo FRAC: 3 (Triazol / DMI — Demetilação inibidor)',
      'Registrado para: trigo, cevada, aveia, centeio, triticale e outras culturas',
      'Controla: Tilletia caries (cárie), Ustilago spp. (carvão), Fusarium spp., brusone',
      'Baixa ecotoxicidade para organismos do solo em doses recomendadas',
    ],
    isRecipe: false,
    bagsPerLot: 6,
  },
  {
    id: 'universal',
    name: 'UNIVERSAL',
    category: 'Regulador de Crescimento',
    subcategory: 'Carreador / Adesivo Base — Tratamento de Sementes',
    purpose: 'Produto carreador e adesivo base utilizado no tratamento industrial de sementes. Massageado primeiro para criar a camada de adesão que garante distribuição uniforme dos demais ingredientes ativos.',
    characteristics: [
      'Carreador base para tratamento de sementes — aplicado antes dos demais produtos',
      'Garante homogeneização e aderência uniforme nas sementes',
      'Massageado no ciclo inicial (~5 minutos) antes dos outros IAs',
      'Essencial para o processo combinado com MYTHOS e outros produtos',
      'Forma a camada base para fixação dos fungicidas e inseticidas',
    ],
    activeIngredients: [
      { name: 'Adesivo / Carreador base', role: 'Homogeneizador e veículo de distribuição nas sementes' },
    ],
    hasMassageEffect: true,
    massageTime: '~5 minutos',
    massageNotes: 'UNIVERSAL é sempre aplicado primeiro no ciclo. Massagear ~5 minutos para criar a camada base de adesão antes de adicionar os demais ingredientes ativos.',
    applicationGuidelines: [
      'Aplicar UNIVERSAL primeiro — antes de qualquer outro produto no ciclo',
      'Massagear por ~5 minutos para criar a camada base',
      'Após o ciclo do Universal, adicionar os demais produtos conforme ordem definida',
      'Verificar cobertura visual uniforme antes de adicionar o próximo produto',
      'Usar EPI completo durante todo o processo',
    ],
    technicalInfo: [
      'Função: Carreador e adesivo base para tratamento industrial de sementes',
      'Aplicação: Sempre primeiro no ciclo de massagem',
      'Combinação típica: Universal + MYTHOS (ciclo ~5 min juntos)',
    ],
    isRecipe: true,
    compatibleRecipes: ['Tratamento industrial de sementes de soja', 'Tratamento de sementes de milho'],
  },
  {
    id: 'cripton-ultra',
    name: 'CRIPTON ULTRA',
    category: 'Fungicida',
    subcategory: 'Triazol + SDHI + QoI (Tripla Ação)',
    purpose: 'Fungicida de tripla ação para tratamento de sementes e controle foliar. Combina Protioconazol (Triazol), Inpyrfluxam (Pirazolcarboxamida/SDHI) e Trifloxistrobin (Estrobilurina) para amplo espectro de doenças.',
    characteristics: [
      'Três grupos químicos distintos: Triazol + SDHI + Estrobilurina',
      'APENAS Trifloxistrobin passa pelo ciclo de massagem',
      'Protioconazol e Inpyrfluxam: descascados e adicionados por empilhamento',
      'Amplo espectro: controla doenças radiculares e foliares',
      'Processo idêntico ao FOX XPRO/SUPRA — massagem apenas do componente QoI',
    ],
    activeIngredients: [
      { name: 'Trifloxistrobin', role: 'Estrobilurina (QoI) — massageado (ciclo de massagem)' },
      { name: 'Protioconazol', role: 'Triazol (DMI) — descascado e empilhado (sem massagem)' },
      { name: 'Inpyrfluxam', role: 'Pirazolcarboxamida (SDHI) — descascado e empilhado (sem massagem)' },
    ],
    hasMassageEffect: true,
    massageTime: '~6 minutos e 40 segundos (Trifloxistrobin)',
    massageNotes: 'Apenas o Trifloxistrobin (QoI) passa pelo ciclo de massagem. Protioconazol e Inpyrfluxam são descascados e adicionados por empilhamento após o ciclo.',
    applicationGuidelines: [
      'Trifloxistrobin: submeter ao ciclo de massagem — seguir receita TRIFLOXY (6m40s) ou TEBUCONAZOLE B (3m20s)',
      'Protioconazol e Inpyrfluxam: descascar e adicionar por empilhamento — sem ciclo de massagem',
      'Aplicar preventivamente antes do surgimento de sintomas',
      'Respeitar intervalo mínimo entre aplicações conforme bula',
      'Usar EPI completo durante o manuseio',
    ],
    technicalInfo: [
      'Grupo FRAC: 3 (Triazol / DMI) + 7 (SDHI / Pirazolcarboxamida) + 11 (QoI / Estrobilurina)',
      'Classe toxicológica: verificar bula para classificação atual',
      'Processo: Trifloxistrobin — massagem | Protioconazol + Inpyrfluxam — empilhamento',
      'Referência: cropscience.bayer.com.py — CRIPTON ULTRA',
    ],
    specialNote:
      'ATENÇÃO — CRIPTON ULTRA: somente o Trifloxistrobin passa pelo ciclo de massagem. Protioconazol e Inpyrfluxam são descascados e adicionados por empilhamento. Usar como referência de tempo a receita TRIFLOXY (6m40s) ou TEBUCONAZOLE B (3m20s).',
    isRecipe: false,
  },
  {
    id: 'belt',
    name: 'BELT',
    category: 'Inseticida',
    subcategory: 'Diamida — Tratamento de Sementes',
    purpose: 'Controle de lagartas e lepidópteros em soja, milho, algodão e diversas culturas. Adicionado por empilhamento, sem necessidade de massagem.',
    characteristics: [
      'Modo de ação único: ativador de canais de rianodina (IRAC 28)',
      'Baixo risco de resistência cruzada com outros grupos inseticidas',
      'Alta eficácia em lagartas nos instares iniciais',
      'NÃO requer ciclo de massagem — adicionado por empilhamento',
      'Seletivo para inimigos naturais e baixa toxicidade para mamíferos',
    ],
    activeIngredients: [
      { name: 'Flubendiamide', role: 'Diamida — Ativador seletivo de canais de rianodina de insetos' },
    ],
    hasMassageEffect: false,
    specialNote: 'BELT não requer ciclo de massagem. Adicionado por empilhamento no tratamento. Cada lote vem com 10 bags.',
    applicationGuidelines: [
      'Adicionar por empilhamento — sem ciclo de massagem',
      'Aplicar ao primeiro sinal de infestação por lagartas',
      'Usar no início dos instares larvais para maior eficiência',
      'Respeitar carência conforme bula para cada cultura',
      'Usar EPI completo durante o manuseio',
    ],
    technicalInfo: [
      'Formulação: Suspensão concentrada (SC)',
      'Classe toxicológica: IV — Pouco tóxico',
      'Grupo IRAC: 28 — Diamidas (ativador de canais de rianodina)',
      'Saiba mais: https://www.agro.bayer.com.br/d/inseticida-bcs-belt-br',
    ],
    isRecipe: false,
    bagsPerLot: 10,
  },
];

// =====================================================================
// RECIPES — FOX XPRO and NATIVO removed (they are products, not recipes)
// =====================================================================

export const defaultRecipes: Recipe[] = [
  {
    product: 'TEBUCONAZOLE',
    recipe: 'Standard Formulation',
    active_ingredient: 'Tebuconazole 100%',
    category: 'Fungicida Triazol',
    func: 'Proteção contra oídio e ferrugem',
    application: 'Aplicação sistêmica foliar',
    notes: 'Produto versátil com excelente absorção foliar. Ideal para programas preventivos.',
    duration: '6-8',
    difficulty: 'Fácil',
    massageTime: '6-8 minutos',
  },
  {
    product: 'TEBUCONAZOLE B',
    recipe: 'Enhanced Formula',
    active_ingredient: 'Tebuconazole + Adjuvante',
    category: 'Fungicida Triazol Premium',
    func: 'Proteção aprimorada com melhor aderência foliar',
    application: 'Aplicação com espalhante adesivo',
    notes: 'Formulação melhorada com adjuvante que aumenta a aderência e penetração foliar.',
    duration: '7-9',
    difficulty: 'Médio',
    massageTime: '3 minutos e 20 segundos',
  },
  {
    product: 'TRIFLOXY',
    recipe: 'Strobilurin Premium',
    active_ingredient: 'Trifloxystrobin 100%',
    category: 'Fungicida Estrobilurina',
    func: 'Controle de múltiplas doenças com excelente cobertura foliar',
    application: 'Pulverização foliar uniforme',
    notes: 'Ótima cobertura foliar. Resistente à chuva após 2 horas da aplicação.',
    duration: '8-10',
    difficulty: 'Fácil',
    massageTime: '6 minutos e 40 segundos',
  },
  {
    product: 'UREIA',
    recipe: 'Nitrogen Source',
    active_ingredient: 'Ureia 46%',
    category: 'Fertilizante Nitrogenado',
    func: 'Fonte de nitrogênio de alta solubilidade para nutrição foliar',
    application: 'Fertirrigação ou pulverização foliar',
    notes: 'Altamente solúvel e de rápida absorção pela planta. Evitar aplicação em altas temperaturas.',
    duration: '5-7',
    difficulty: 'Fácil',
    massageTime: '1 minuto e 45 segundos',
  },
  {
    product: 'SIVANTO PRIME',
    recipe: 'SIVANTO PRIME',
    active_ingredient: 'Flupyradifurone 200 g/L',
    category: 'Inseticida Butenolida (IRAC 4D)',
    func: 'Controle sistêmico de mosca-branca, pulgões e insetos sugadores',
    application: 'Tratamento industrial de sementes',
    notes: 'Ingrediente ativo: Flupyradifurone (Butenolida, IRAC 4D). Novo grupo químico com baixo risco de resistência cruzada a neonicotinoides. Alta seletividade para abelhas (Classe 2A). Para maior rapidez no processo, pode-se combinar com a receita de Trifloxystrobin (FOX XPRO / SPHERE MAX) no mesmo ciclo de TS, unindo inseticida sistêmico + fungicida QoI em uma única passagem.',
    duration: '10',
    difficulty: 'Fácil',
    massageTime: '10 minutos e 5 segundos',
  },
  {
    product: 'MONCEREM',
    recipe: 'MONCEREM',
    active_ingredient: 'Ipconazole 7,5 g/L + Metalaxil 37,5 g/L',
    category: 'Fungicida Triazol + Fenilamida',
    func: 'Proteção contra tombamento, Rhizoctonia, Fusarium e Pythium',
    application: 'Tratamento industrial de sementes',
    notes: 'Controla Oomicetos (Pythium — via Metalaxil) e fungos verdadeiros (Rhizoctonia — via Ipconazole). Ideal para áreas com histórico de tombamento de plântulas.',
    duration: '5',
    difficulty: 'Fácil',
    massageTime: '5 minutos',
  },
  {
    product: 'UNIVERSAL',
    recipe: 'Universal Massageador',
    active_ingredient: 'Carreador / Adesivo base',
    category: 'Carreador para Tratamento de Sementes',
    func: 'Base de adesão e homogeneização para tratamento de sementes — massageado em combinação com outros produtos',
    application: 'Tratamento industrial de sementes (carreador base)',
    notes: 'Produto carreador utilizado em combinação com MYTHOS e outros produtos que requerem base de adesão. Aplicar Universal primeiro para criar a camada base antes de adicionar os demais ingredientes ativos.',
    duration: '5',
    difficulty: 'Fácil',
    massageTime: '5 minutos',
  },
];

// =====================================================================
// CHEMISTRY
// =====================================================================

export const defaultChemistry: Chemistry[] = [
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
    safety: 'Classe III — medianamente tóxico. Evitar inalação do pó.',
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
    name: 'Flupyradifurone',
    alias: 'Butenolida de nova geração (SIVANTO PRIME)',
    className: 'Butenolida — Agonista seletivo do receptor nicotínico de acetilcolina (nAChR) — IRAC 4D',
    func: 'Liga-se seletivamente aos receptores nicotínicos de acetilcolina (nAChR) nos insetos, causando hiperexcitação nervosa, paralisia e morte. Mecanismo de ação distinto dos neonicotinoides (4A): apesar de atuar no mesmo receptor, a conformação molecular diferente confere baixo risco de resistência cruzada.',
    applications: 'Inseticida sistêmico via tratamento de sementes para controle de mosca-branca (Bemisia tabaci biótipo B e Q), pulgões (Aphis glycines, Myzus persicae) e cigarrinhas. Produto SIVANTO PRIME (200 g/L SL). Combinável com Trifloxystrobin (QoI) para broadspectrum inseticida + fungicida no mesmo ciclo TS.',
    safety: 'Classe III — medianamente tóxico. Muito tóxico para organismos aquáticos (Categoria 1 aquática) — evitar contaminação de corpos d\'água. Perfil favorável para abelhas adultas (Classe 2A EFSA). EPI: luvas nitrílicas, óculos, máscara PFF2, avental impermeável.',
    molecularFormula: 'C12H11ClFN3O2',
  },
  {
    name: 'Fluopyram',
    alias: 'Carboxamida sistêmica de amplo espectro',
    className: 'SDHI — Inibidor da succinato desidrogenase (complexo II)',
    func: 'Bloqueia a succinato desidrogenase no complexo II da cadeia respiratória mitocondrial do fungo, impedindo a produção de ATP e causando morte celular.',
    applications: 'Controle de ferrugem, manchas foliares e doenças de solo. Presente em VERANGO.',
    safety: 'Classe III — medianamente tóxico. Baixa toxicidade para mamíferos. Evitar contato ocular.',
    molecularFormula: 'C16H11ClF6N2O',
  },
  {
    name: 'Ipconazole',
    alias: 'Triazol para tratamento de sementes',
    className: 'DMI — Inibidor de demetilação do ergosterol',
    func: 'Inibe a enzima C14-demetilase, bloqueando a biossíntese de ergosterol nas células fúngicas. Específico para fungos de solo e semente.',
    applications: 'Tratamento de sementes contra Rhizoctonia, Fusarium e outros patógenos de solo. Produto MONCEREM.',
    safety: 'Classe III — medianamente tóxico. Usar EPI durante tratamento de sementes. Não ingerir.',
    molecularFormula: 'C18H24ClN3O',
  },
  {
    name: 'Metalaxil',
    alias: 'Fenilamida específica para Oomicetos',
    className: 'Fenilamida — Inibidor de RNA polimerase (FRAC grupo 4)',
    func: 'Inibe a RNA polimerase I nos Oomicetos, bloqueando a síntese de RNA ribossômico. Ação específica e seletiva para Pythium, Phytophthora e Peronospora.',
    applications: 'Controle de Pythium (tombamento), Phytophthora e doenças causadas por Oomicetos no tratamento de sementes. Produto MONCEREM.',
    safety: 'Classe III — medianamente tóxico. Não possui ação sobre fungos verdadeiros — usar sempre em combinação com outro fungicida de amplo espectro.',
    molecularFormula: 'C15H21NO4',
  },
  {
    name: 'Flubendiamide',
    alias: 'Diamida de nova geração (BELT)',
    className: 'Diamida — Ativador seletivo de canais de rianodina de insetos (IRAC 28)',
    func: 'Ativa de forma seletiva os canais de rianodina nos músculos dos insetos, causando liberação descontrolada de cálcio, paralisia muscular irreversível e morte. Não afeta receptores de mamíferos.',
    applications: 'Inseticida para controle de lagartas e lepidópteros em soja, milho e algodão. Produto BELT. Adicionado por empilhamento no tratamento de sementes.',
    safety: 'Classe IV — pouco tóxico. Baixa toxicidade para mamíferos e inimigos naturais. Evitar contato com pele.',
    molecularFormula: 'C23H22F7IN2O4S',
  },
  {
    name: 'Triflumuron',
    alias: 'Inibidor de síntese de quitina (ALSYSTIN)',
    className: 'Benzoiluréia — Inibidor de síntese de quitina (IRAC grupo 15)',
    func: 'Inibe a enzima quitina sintase, impedindo a formação de quitina durante a muda dos insetos. Larvas não conseguem completar a muda e morrem. Ação lenta mas eficaz nos instares iniciais.',
    applications: 'Controle de lagartas (Spodoptera, Helicoverpa) em soja e milho. Produto ALSYSTIN. Baixo risco de resistência cruzada com outros mecanismos.',
    safety: 'Classe IV — pouco tóxico. Alta seletividade para mamíferos e insetos benéficos. Classe ambiental II.',
    molecularFormula: 'C15H10ClF3N2O3',
  },
  {
    name: 'beta-Ciflutrina',
    alias: 'Piretróide sintético de alta eficácia',
    className: 'Piretróide — Modulador do canal de sódio (IRAC 3A)',
    func: 'Mantém os canais de sódio abertos nas membranas nervosas dos insetos, causando hiperexcitação, paralisia e morte. Efeito knock-down rápido por contato e ingestão.',
    applications: 'Inseticida de amplo espectro para pulgões, tripes, lagartas e pragas sugadoras. Presente em BULLDOCK (125 g/L) e CONNECT (12,5 g/L em combinação com Imidacloprid).',
    safety: 'Classe III — medianamente tóxico. Muito tóxico para abelhas e organismos aquáticos. Aplicar fora do período de floração.',
    molecularFormula: 'C22H18Cl2FNO3',
  },
  {
    name: 'Sulfoxaflor',
    alias: 'Sulfoximina — nova classe de inseticida (CURBIX)',
    className: 'Sulfoximina — Agonista do receptor nicotínico de acetilcolina (IRAC 4C)',
    func: 'Liga-se aos receptores nicotínicos de acetilcolina (nAChR) dos insetos causando hiperexcitação nervosa e morte. Estrutura molecular distinta dos neonicotinoides (4A), sem resistência cruzada.',
    applications: 'Controle de mosca-branca, pulgões e tripes resistentes a neonicotinoides. Produto CURBIX (240 g/L SC). Eficaz em populações resistentes a Imidacloprid.',
    safety: 'Classe III — medianamente tóxico. Classe ambiental III. Não aplicar em floração. Alternativa para manejo de resistência a 4A.',
    molecularFormula: 'C10H10F2N2O2S',
  },
  {
    name: 'Spiroxamine',
    alias: 'Morfolina de duplo mecanismo (FOX ULTRA)',
    className: 'Morfolina — Inibidor de biossíntese de ergosterol (FRAC grupo 5)',
    func: 'Inibe dois pontos distintos na biossíntese de ergosterol: a enzima D8→D7 isomerase e a D14 redutase. Duplo mecanismo dificulta o desenvolvimento de resistência.',
    applications: 'Controle específico de oídio e ferrugens em trigo, cevada e soja. Presente em FOX ULTRA (combinado com Trifloxystrobin e Prothioconazole). Adicionado por empilhamento — sem ciclo de massagem.',
    safety: 'Classe III — medianamente tóxico. Evitar contato prolongado com pele e mucosas.',
    molecularFormula: 'C14H31NO2',
  },
  {
    name: 'Spiromesifene',
    alias: 'Cetoenol para controle de ácaros e mosca-branca (OBERON)',
    className: 'Cetoenol — Inibidor de biossíntese de lipídios (IRAC grupo 23)',
    func: 'Inibe a acetil-CoA carboxilase nos ácaros e mosca-branca, bloqueando a biossíntese de ácidos graxos e lipídios essenciais. Atua em ovos, ninfas e adultos.',
    applications: 'Acaricida e inseticida para controle de ácaros (Tetranychus urticae) e mosca-branca (Bemisia tabaci). Produto OBERON. Massageado com Universal.',
    safety: 'Classe IV — pouco tóxico. Seletivo para ácaros predadores do gênero Phytoseiidae. Seguro para inimigos naturais.',
    molecularFormula: 'C23H30O4',
  },
  {
    name: 'Tiametoxam',
    alias: 'Neonicotinoide sistêmico (PREMIER PLUS)',
    className: 'Neonicotinoide — Agonista do receptor nicotínico de acetilcolina (IRAC 4A)',
    func: 'Age como agonista nos receptores nicotínicos de acetilcolina (nAChR) do sistema nervoso central dos insetos, causando superestimulação, paralisia e morte. Absorvido e translocado sistemicamente pela planta.',
    applications: 'Tratamento de sementes para proteção sistêmica contra cupins, corós, pulgões e cigarrinhas. Presente em PREMIER PLUS (combinado com Lambda-cialotrina). Grupo IRAC 4A.',
    safety: 'Classe I — extremamente tóxico. Muito tóxico para abelhas e organismos aquáticos. EPI completo obrigatório.',
    molecularFormula: 'C8H10ClN5O3S',
  },
  {
    name: 'Lambda-cialotrina',
    alias: 'Piretróide de ação rápida por contato (PREMIER PLUS / CONNECT)',
    className: 'Piretróide — Modulador do canal de sódio (IRAC 3A)',
    func: 'Mantém canais de sódio abertos nas membranas nervosas dos insetos, gerando hiperexcitação, paralisia e morte por contato ou ingestão. Ação knock-down rápida.',
    applications: 'Combinado com Tiametoxam no PREMIER PLUS para proteção sistêmica + contato no tratamento de sementes. Controla pragas de solo e parte aérea nos estádios iniciais.',
    safety: 'Classe I — extremamente tóxico. Muito tóxico para abelhas e organismos aquáticos. Usar EPI completo.',
    molecularFormula: 'C23H19ClF3NO3',
  },
  {
    name: 'Imidacloprid',
    alias: 'Neonicotinoide clássico de amplo uso',
    className: 'Neonicotinoide — Agonista do receptor nicotínico de acetilcolina (IRAC 4A)',
    func: 'Liga-se seletivamente aos receptores nicotínicos de acetilcolina (nAChR) nos insetos, causando bloqueio da transmissão nervosa, paralisia e morte. Absorção sistêmica rápida pela planta.',
    applications: 'Controle de pulgões, mosca-branca, cigarrinhas, cupins e pragas de solo. Presente em PROVADO (200 g/L SL), GAUCHO (600 g/kg WP), CONNECT (100 g/L) e CROPSTAR (150 g/L).',
    safety: 'Classe II — altamente tóxico. Muito tóxico para abelhas. Não aplicar em floração. Respeitar carência por cultura.',
    molecularFormula: 'C9H10ClN5O2',
  },
  {
    name: 'Ciproconazole',
    alias: 'Triazol de alto desempenho (SPHERE MAX)',
    className: 'DMI — Inibidor de demetilação do ergosterol (FRAC grupo 3)',
    func: 'Inibe a enzima C14-demetilase bloqueando a biossíntese de ergosterol na membrana celular do fungo. Alta eficácia sistêmica e ampla distribuição no tecido vegetal.',
    applications: 'Controle de ferrugem asiática, oídio, septoriose e manchas foliares. Presente em SPHERE MAX (combinado com Trifloxystrobin). Ampla distribuição sistêmica.',
    safety: 'Classe III — medianamente tóxico. Biodegradável no solo. Evitar contato prolongado com pele e olhos.',
    molecularFormula: 'C14H18ClN3O',
  },
  {
    name: 'Etefon',
    alias: 'Regulador de crescimento — liberador de etileno (FINISH)',
    className: 'Regulador de crescimento — Etileno endógeno (FRAC sem grupo fungicida)',
    func: 'Após absorção pela planta, o Etefon é degradado liberando etileno endógeno nas células, acelerando a senescência foliar, a maturação dos grãos e a abscisão das folhas.',
    applications: 'Uniformização e antecipação da maturação fisiológica de sementes em soja (R7/R8) e outras culturas. Produto FINISH (720 g/L SL). Facilita colheita mecânica.',
    safety: 'Classe I — extremamente tóxico. Sensível ao pH — manter calda abaixo de 6,5. Não aplicar em estresse hídrico.',
    molecularFormula: 'C2H6ClO3P',
  },
  {
    name: 'Fluxapiroxade',
    alias: 'SDHI de amplo espectro (SOBERAN)',
    className: 'SDHI — Inibidor da succinato desidrogenase (FRAC grupo 7)',
    func: 'Inibe o complexo II da cadeia respiratória mitocondrial (succinato desidrogenase), bloqueando o ciclo de Krebs e a produção de ATP nos fungos.',
    applications: 'Controle de ferrugem asiática, mancha alvo, antracnose e mofo-branco em soja e milho. Presente em SOBERAN (combinado com Piraclostrobina). Alta eficácia residual.',
    safety: 'Classe III — medianamente tóxico. Baixa toxicidade para mamíferos e organismos do solo. Biodegradável.',
    molecularFormula: 'C18H12F5N3O2',
  },
  {
    name: 'Piraclostrobina',
    alias: 'Estrobilurina com efeito verde (SOBERAN)',
    className: 'QoI — Inibidor da quinona externa mitocondrial (FRAC grupo 11)',
    func: 'Inibe o complexo III da cadeia respiratória mitocondrial dos fungos, bloqueando a produção de ATP. Também induz o "efeito verde" na planta, prolongando a atividade fotossintética.',
    applications: 'Controle de ferrugem, manchas foliares e doenças de solo em soja e milho. Presente em SOBERAN (combinado com Fluxapiroxade). Proporciona maior produtividade pelo efeito verde.',
    safety: 'Classe III — medianamente tóxico. Tóxico para organismos aquáticos. Evitar aplicação próxima a corpos d\'água.',
    molecularFormula: 'C19H18ClNO4',
  },
  {
    name: 'Inpyrfluxam',
    alias: 'SDHI de nova geração (FOX SUPRA / CRIPTON ULTRA)',
    className: 'Pirazolcarboxamida / SDHI — Inibidor da succinato desidrogenase (FRAC grupo 7)',
    func: 'Inibe seletivamente a succinato desidrogenase (complexo II mitocondrial) dos fungos, bloqueando o ciclo de Krebs. Estrutura de pirazolcarboxamida com alta afinidade e potência.',
    applications: 'Controle de ferrugem e doenças foliares. Presente em FOX SUPRA (com Prothioconazole) e CRIPTON ULTRA (com Protioconazol + Trifloxistrobin). Adicionado por empilhamento — sem ciclo de massagem.',
    safety: 'Classe III — medianamente tóxico. Usar EPI completo. Baixa ecotoxicidade em doses recomendadas.',
    molecularFormula: 'C20H19F3N2O2S',
  },
  {
    name: 'Thiodicarb',
    alias: 'Carbamato inseticida por contato e ingestão (CROPSTAR)',
    className: 'Carbamato — Inibidor de acetilcolinesterase (IRAC 1A)',
    func: 'Inibe a enzima acetilcolinesterase de forma reversível, causando acúmulo de acetilcolina nas sinapses nervosas dos insetos, levando à hiperexcitação, paralisia e morte.',
    applications: 'Tratamento de sementes para controle de cupins, corós e pragas de solo. Presente em CROPSTAR (450 g/L, combinado com Imidacloprid). Adicionado por empilhamento.',
    safety: 'Classe I — extremamente tóxico. Inibidor de colinesterase — risco de intoxicação acumulativa. EPI completo obrigatório.',
    molecularFormula: 'C10H18N4O4S3',
  },
];

// =====================================================================
// PROCEDURES — includes 5S methodology
// =====================================================================

export const defaultProcedures: Procedure[] = [
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
    content: 'Processo seguro de adição de matérias-primas na sequência correta',
    steps: [
      'Pesar cada ingrediente conforme receita técnica aprovada',
      'Conferir datas de validade e lotes antes do uso',
      'Adicionar na sequência correta: líquidos primeiro, depois sólidos',
      'Usar EPI completo durante todo o processo',
      'Manter registro de lote para rastreabilidade',
      'Verificar compatibilidade química antes da mistura',
    ],
    tips: [
      'Sempre use balanças calibradas e verificadas',
      'Evite contaminação cruzada entre ingredientes',
      'Registre qualquer anomalia imediatamente no formulário',
    ],
    duration: '15-20',
  },
  {
    title: 'Ciclo de Massagem',
    icon: 'play-circle',
    content:
      'Processo de homogeneização da formulação. Tempos de referência: Universal (~5 min) · Trifloxy (6m40s) · Tebuconazole B (3m20s) · Ureia (1m45s)',
    steps: [
      'Inicie o ciclo seguindo os parâmetros definidos na receita',
      'Monitore temperatura constantemente (não exceder 40°C)',
      'Observe a homogeneidade visual da mistura durante o processo',
      'Cronômetro ativo — respeite o tempo determinado para cada produto',
      'Abra o equipamento apenas após confirmação de homogeneidade completa',
      'Documente todos os parâmetros do ciclo no relatório',
    ],
    tips: [
      'Universal massageador: ~5 min em média',
      'Trifloxy: 6 minutos e 40 segundos',
      'Tebuconazole B: 3 minutos e 20 segundos',
      'Ureia: 1 minuto e 45 segundos',
      'Nunca abra o equipamento antes do tempo determinado',
      'Use sensor de temperatura digital para monitoramento',
    ],
    duration: '5-7',
  },
  {
    title: 'Verificação de Qualidade',
    icon: 'checkmark-circle',
    content: 'Controles obrigatórios de qualidade da formulação final antes da liberação',
    steps: [
      'Inspecione visualmente cores, aspecto e uniformidade',
      'Teste consistência e viscosidade da amostra',
      'Valide pH conforme especificação técnica (5.5-7.0)',
      'Teste dispersibilidade em água (padrão: <60 segundos)',
      'Documente todos os resultados no relatório de controle',
      'Aprove ou rejeite o lote conforme critérios da norma interna',
    ],
    tips: [
      'Use apenas equipamentos calibrados e verificados',
      'Compare com amostra padrão aprovada pelo laboratório',
      'Em caso de dúvida, rejeite o lote e acione o supervisor',
    ],
    duration: '10-15',
  },
  {
    title: 'Descarga e Embalagem',
    icon: 'archive',
    content: 'Transferência e acondicionamento seguro do produto final',
    steps: [
      'Descarregue com cuidado utilizando sistema fechado sempre que possível',
      'Usar EPI apropriado para evitar qualquer contato com o produto',
      'Etiquete corretamente cada embalagem com lote, data e validade',
      'Armazene em local fresco, seco e arejado, longe de fontes de calor',
      'Registre saída no sistema de inventário (data, lote, quantidade)',
      'Limpe o equipamento imediatamente após a descarga',
    ],
    tips: [
      'Evite respingos e derramamentos durante a operação',
      'Todos os recipientes devem estar limpos, secos e identificados',
      'Documente qualquer perda de produto no registro de ocorrências',
    ],
    duration: '15-20',
  },
  {
    title: 'Metodologia 5S',
    icon: 'star',
    content:
      'Filosofia japonesa de gestão empresarial adotada pela Bayer para organização, limpeza e melhoria contínua do ambiente de trabalho industrial.',
    steps: [
      '1º S — SEIRI (Utilização): Separar o que é necessário do desnecessário. Eliminar do espaço de trabalho tudo o que não tem utilidade.',
      '2º S — SEITON (Organização): Cada coisa em seu lugar. Organizar os itens necessários de forma acessível, com identificação clara.',
      '3º S — SEISO (Limpeza): Manter o ambiente limpo. Limpar é também inspecionar — identificar fontes de sujeira e eliminar causas.',
      '4º S — SEIKETSU (Padronização): Criar padrões visuais e procedimentos para manter os três primeiros S. Tornar a organização um hábito.',
      '5º S — SHITSUKE (Autodisciplina): Manter e melhorar continuamente os padrões estabelecidos. Desenvolver disciplina e comprometimento.',
    ],
    tips: [
      'O 5S não é uma faxina única — é uma cultura de melhoria contínua',
      'Comece pelo seu posto de trabalho imediato',
      'Envolva toda a equipe nas auditorias periódicas de 5S',
      'Fotografe antes e depois para evidenciar melhorias',
      'A Bayer aplica o 5S como base para qualidade e segurança operacional',
    ],
    duration: '20-30',
  },
  {
    title: 'Regra de Empilhamento de Sacas',
    icon: 'layers',
    content: 'Norma crítica de qualidade: NUNCA empilhar saca com efeito de massagem sobre saca sem efeito de massagem. Contaminação cruzada invalida o lote.',
    steps: [
      'Antes de empilhar, identificar se o produto possui ou NÃO efeito de massagem',
      'COM massagem: SIVANTO, MONCEREM, VERANGO, NATIVO, OBERON, PREMIER PLUS, PROVADO',
      'SEM massagem (embalagem bombona): FOX SUPRA, CROPSTAR, FOX PRO (trifloxy é massageado, resto empilhado)',
      'GAUCHO: NÃO é massageado — verificar orientação técnica antes de empilhar',
      'Manter pilhas separadas por tipo: massageados com massageados, não-massageados com não-massageados',
      'Em caso de mistura acidental, isolar o lote e acionar o supervisor imediatamente',
      'Sinalizar claramente cada pilha com etiqueta de identificação de produto',
    ],
    tips: [
      'CRÍTICO: Saca massageada NUNCA sobre saca não-massageada — risco de contaminação cruzada',
      'Use etiquetas coloridas para diferenciar rapidamente os tipos',
      'Dúvida = parar + consultar ficha técnica + acionar supervisor',
      'Registrar qualquer não-conformidade no formulário de ocorrências',
    ],
    duration: '5-10',
  },
  {
    title: 'Segurança nas Escadas',
    icon: 'alert',
    content: 'Procedimento obrigatório para uso seguro das escadas na área de produção. Luvas de proteção química criam risco grave de escorregamento no corrimão.',
    steps: [
      'ANTES de subir ou descer escadas: RETIRE as luvas de proteção química',
      'As luvas reduzem drasticamente o atrito com o corrimão — risco de queda',
      'SEMPRE segure o corrimão com firmeza ao usar qualquer escada da área',
      'Desça de frente para a escada — nunca de costas ou de lado',
      'Observe o piso antes de cada degrau: superfícies molhadas aumentam risco',
      'Nunca transporte objetos volumosos que impeçam a visão dos degraus ou o uso do corrimão',
      'Se o piso estiver molhado: aguardar secagem, sinalizar área ou utilizar alternativa segura',
    ],
    tips: [
      'CRÍTICO: Luvas de proteção química NÃO podem ser usadas nas escadas',
      'Retire as luvas ANTES de qualquer escada — coloque-as de volta no destino',
      'Um segundo de precaução previne acidentes graves e afastamentos',
      'Piso danificado ou escorregadio? Comunicar ao supervisor imediatamente',
    ],
    duration: '1-2',
  },
  {
    title: 'Carregamento de Bateria — Selectiva Plus',
    icon: 'flash',
    content: 'Procedimento seguro e obrigatório para carregamento de baterias com o carregador Selectiva Plus na área de produção.',
    steps: [
      '1. Posicionar o carregador Selectiva Plus em superfície plana, firme e bem ventilada',
      '2. Verificar se o carregador está DESLIGADO da tomada antes de conectar qualquer cabo',
      '3. Identificar os terminais: VERMELHO (+) positivo / PRETO (-) negativo',
      '4. Conectar primeiro o cabo VERMELHO ao terminal positivo (+) da bateria',
      '5. Em seguida, conectar o cabo PRETO ao terminal negativo (-) da bateria',
      '6. Ligar o carregador na tomada correta (110V ou 220V — verificar etiqueta do equipamento)',
      '7. Selecionar o modo de carregamento conforme tipo de bateria (ver painel frontal do Selectiva Plus)',
      '8. Aguardar indicação de carga completa no display/LED — não interromper prematuramente',
      '9. DESLIGAR o carregador da tomada ANTES de desconectar os cabos',
      '10. Desconectar na ordem inversa: primeiro PRETO (negativo), depois VERMELHO (positivo)',
    ],
    tips: [
      'CRÍTICO: NUNCA inverter polaridade — pode causar explosão ou incêndio da bateria',
      'Sempre desligar da tomada ANTES de desconectar os cabos — evita faísca',
      'Manter área ventilada: baterias em carga liberam gases inflamáveis (H₂)',
      'Não carregar baterias visualmente danificadas, inchadas ou com odor estranho',
      'EPI obrigatório: óculos de proteção + luvas de procedimento',
      'Faísca ou cheiro anormal? Interromper imediatamente e acionar supervisor + CIPA',
    ],
    duration: '15-480',
  },
  {
    title: 'Identificação e Descarte de Resíduos (BCSBR)',
    icon: 'trash',
    content: 'Classificação e descarte correto de resíduos industriais conforme norma interna Bayer: BCSBR01 (sólidos), BCSBR02 (líquidos/IBCs), BCSBR03 (úmidos).',
    steps: [
      'BCSBR01 — Embalagens Sólidas Vazias: sacos plásticos vazios, caixas de papelão contaminadas, tampa e embalagens rígidas limpas',
      '  → Acondicionar em bombonas ou bags identificados como "BCSBR01"',
      '  → Não compactar forçadamente — risco de liberação de resíduos químicos',
      'BCSBR02 — Resíduos Líquidos (IBCs): restos de formulação líquida, lavagem de equipamentos, águas residuais contaminadas',
      '  → Coletar em IBCs (contêineres cúbicos de 1000L) identificados como "BCSBR02"',
      '  → NUNCA despejar em ralo, vaso sanitário, rio ou solo',
      '  → IBC cheio: sinalizar, lacrar e acionar coleta antes de continuar',
      'BCSBR03 — Resíduos Úmidos/Contaminados: materiais absorventes contaminados (papel, serragem, EPI descartado), embalagens com resíduo de produto',
      '  → Acondicionar em sacos plásticos resistentes identificados como "BCSBR03"',
      '  → Selar os sacos antes de depositar no ponto de coleta',
      'Todos os resíduos → entregar ao ponto de coleta designado pelo setor de Meio Ambiente',
    ],
    tips: [
      'NUNCA misturar resíduos de categorias diferentes no mesmo recipiente',
      'Identificar corretamente o código (BCSBR01/02/03) antes de qualquer descarte',
      'Dúvida sobre classificação? Acionar o supervisor ambiental — não arriscar',
      'Registro obrigatório: data, produto origem, quantidade, responsável',
      'Descarte irregular pode resultar em penalidades para a empresa e responsabilidade pessoal',
    ],
    duration: '10-20',
  },
];

// =====================================================================
// TUTORIALS
// =====================================================================

export const defaultTutorials: Tutorial[] = [
  {
    id: 'tut-1',
    title: 'Integração de Sistema',
    icon: 'play-circle',
    description: 'Aprenda como integrar e utilizar o sistema de formulação agrícola',
    duration: '15 min',
    level: 'Fácil',
    videoUrl: 'https://www.youtube.com/watch?v=bRz-CJert2E',
    videoThumbnail: 'https://img.youtube.com/vi/bRz-CJert2E/maxresdefault.jpg',
    content:
      'Neste tutorial, você aprenderá os princípios fundamentais de integração do sistema, tipos de formulações e como começar a utilizar a plataforma.',
    steps: [
      'Entender os componentes do sistema',
      'Conhecer o fluxo de trabalho',
      'Aprender sobre integração de dados',
      'Praticar com um exemplo simples',
    ],
  },
  {
    id: 'tut-2',
    title: 'Técnicas de Massagem',
    icon: 'fitness',
    description: 'Dominar as técnicas profissionais de homogeneização industrial',
    duration: '25 min',
    level: 'Avançado',
    content:
      'Tutorial completo sobre técnicas de massagem, incluindo parâmetros otimizados e troubleshooting para cada produto.',
    steps: [
      'Preparar o equipamento adequadamente',
      'Monitorar parâmetros em tempo real',
      'Ajustar velocidade e temperatura conforme produto',
      'Documentar e validar resultados',
    ],
  },
  {
    id: 'tut-3',
    title: 'Controle de Qualidade',
    icon: 'checkmark-circle',
    description: 'Realizar verificações de qualidade e documentação correta',
    duration: '18 min',
    level: 'Médio',
    content:
      'Guia passo a passo para realizar controles de qualidade efetivos e documentar resultados conforme norma interna.',
    steps: [
      'Coletar amostras corretamente',
      'Realizar testes visuais e físico-químicos',
      'Medir parâmetros críticos (pH, viscosidade)',
      'Documentar e arquivar resultados no sistema',
    ],
  },
];

// =====================================================================
// EPIs
// =====================================================================

export const defaultEPIs: EPI[] = [
  {
    id: 'epi-1',
    name: 'Capacete de Segurança',
    icon: 'shield-outline',
    category: 'Proteção da Cabeça',
    description: 'Proteção contra impactos e quedas de objetos na área de produção',
    importance: 'Crítico',
    usage: 'Usar durante todas as operações na área de produção e estoque',
    maintenanceTips: [
      'Inspecionar por rachaduras ou danos antes de cada uso',
      'Verificar função e integridade da jugular',
      'Substituir conforme regulamentação vigente',
    ],
  },
  {
    id: 'epi-2',
    name: 'Óculos de Proteção',
    icon: 'eye-outline',
    category: 'Proteção Ocular',
    description: 'Proteção dos olhos contra respingos de produtos químicos, pós e partículas',
    importance: 'Crítico',
    usage: 'Usar durante todas as operações que envolvam líquidos ou pós',
    maintenanceTips: [
      'Limpar regularmente com pano macio e água',
      'Inspecionar lentes por danos, riscos ou embaçamento',
      'Armazenar em case apropriado quando não usar',
      'Substituir se houver riscos que comprometam a visão',
    ],
  },
  {
    id: 'epi-3',
    name: 'Protetor Auricular',
    icon: 'volume-mute-outline',
    category: 'Proteção Auditiva',
    description: 'Proteção contra ruído excessivo de máquinas e equipamentos industriais',
    importance: 'Alto',
    usage: 'Usar durante operação de equipamentos de alta potência sonora',
    maintenanceTips: [
      'Verificar vedação e integridade regularmente',
      'Lavar com água e sabão neutro',
      'Trocar espumas/almofadas quando necessário',
    ],
  },
  {
    id: 'epi-4',
    name: 'Luvas de Proteção Química',
    icon: 'hand-left-outline',
    category: 'Proteção das Mãos',
    description: 'Proteção contra contato direto com produtos químicos, agrotóxicos e abrasivos',
    importance: 'Crítico',
    usage: 'Usar em todas as operações de manipulação de produtos e ingredientes',
    maintenanceTips: [
      'Verificar integridade (sem furos ou rasgos) antes de usar',
      'Trocar imediatamente se houver qualquer perfuração',
      'Descartar adequadamente conforme protocolo de resíduos',
    ],
  },
  {
    id: 'epi-5',
    name: 'Avental Impermeável',
    icon: 'shirt-outline',
    category: 'Proteção do Corpo',
    description: 'Proteção do vestuário e corpo contra respingos e contaminação por produtos',
    importance: 'Alto',
    usage: 'Usar durante preparação, carregamento e descarga de produtos',
    maintenanceTips: [
      'Lavar regularmente com água e detergente neutro',
      'Inspecionar por desgaste, furos ou áreas comprometidas',
      'Secar completamente antes de guardar ou reutilizar',
    ],
  },
  {
    id: 'epi-6',
    name: 'Botinas de Segurança (Antiderrapante)',
    icon: 'walk-outline',
    category: 'Proteção dos Pés',
    description: 'Proteção dos pés contra quedas de objetos, perfurações e escorregamentos. Solado antiderrapante obrigatório para áreas molhadas e escadas.',
    importance: 'Crítico',
    usage: 'Usar em toda a área de produção, armazém, escadas e áreas externas do complexo',
    maintenanceTips: [
      'Verificar integridade do bico de aço e solado antes de cada turno',
      'Trocar quando solado apresentar desgaste que comprometa a aderência',
      'Limpar e secar após contato com produtos químicos ou superfícies molhadas',
      'Não usar botinas com solado liso — substituir imediatamente',
      'Verificar amarração dos cadarços antes de usar escadas',
    ],
  },
  {
    id: 'epi-7',
    name: 'Máscara Respiratória PFF2/PFF3',
    icon: 'medical-outline',
    category: 'Proteção Respiratória',
    description: 'Proteção das vias respiratórias contra pós, névoas e vapores de produtos químicos durante manipulação e tratamento de sementes.',
    importance: 'Crítico',
    usage: 'Usar ao manusear produtos em pó, durante mistura, tratamento de sementes e em áreas com geração de poeira ou vapor',
    maintenanceTips: [
      'Verificar vedação facial antes de cada uso — apertar as tiras de ajuste',
      'Substituir quando houver dificuldade respiratória ou dano visível',
      'Máscaras descartáveis (PFF2/PFF3): não reutilizar após contaminação',
      'Armazenar em embalagem original longe de umidade e contaminantes',
      'PFF3: necessária para produtos com classe toxicológica I e II',
    ],
  },
  {
    id: 'epi-8',
    name: 'Viseira de Proteção Facial',
    icon: 'eye-outline',
    category: 'Proteção Facial',
    description: 'Proteção total do rosto contra respingos, faíscas e partículas durante operações de alto risco como carregamento de bateria e manuseio de líquidos.',
    importance: 'Alto',
    usage: 'Usar no carregamento de baterias, operações com produtos líquidos corrosivos e manuseio de IBCs',
    maintenanceTips: [
      'Limpar visor com pano macio após cada uso',
      'Verificar articulação e fixação no capacete ou cabeça',
      'Substituir se houver trincas ou arranhões profundos no visor',
      'Usar sempre em conjunto com óculos de proteção quando aplicável',
    ],
  },
];

// =====================================================================
// SAFETY TIPS
// =====================================================================

export const defaultSafetyTips: SafetyTip[] = [
  {
    id: 'safe-1',
    title: 'Intoxicação por Inalação',
    icon: 'alert-circle-outline',
    description: 'Exposição a pós ou vapores de agrotóxicos pode causar irritação respiratória grave',
    severity: 'Crítico',
    preventionSteps: [
      'Usar máscara de proteção respiratória adequada ao produto',
      'Garantir boa ventilação e exaustão na área de trabalho',
      'Limitar o tempo de exposição contínua',
      'Fazer pausas frequentes ao ar livre',
    ],
  },
  {
    id: 'safe-2',
    title: 'Contato Dérmico com Agrotóxicos',
    icon: 'alert-outline',
    description: 'Contato com produtos pode causar irritação, absorção sistêmica ou reações alérgicas',
    severity: 'Alto',
    preventionSteps: [
      'Usar luvas impermeáveis (nitrílicas ou neoprene)',
      'Lavar mãos com água e sabão após qualquer contato',
      'Trocar roupas contaminadas imediatamente',
      'Reportar qualquer reação anormal ao médico do trabalho',
    ],
  },
  {
    id: 'safe-3',
    title: 'Derramamento de Produtos',
    icon: 'water-outline',
    description: 'Derramamentos podem contaminar superfícies, criar risco de escorregamento e poluição',
    severity: 'Alto',
    preventionSteps: [
      'Limpar imediatamente com material absorvente específico',
      'Descartar conforme protocolo de resíduos perigosos',
      'Sinalizar área molhada para prevenir acidentes',
      'Verificar se houve contaminação de solo ou ralo',
    ],
  },
  {
    id: 'safe-4',
    title: 'Sobrecarga do Equipamento',
    icon: 'flash-outline',
    description: 'Operação incorreta pode danificar o equipamento, causar superaquecimento ou acidente',
    severity: 'Crítico',
    preventionSteps: [
      'Respeitar sempre os limites de capacidade do massageador',
      'Monitorar temperatura constantemente durante o ciclo',
      'Realizar pausas entre ciclos consecutivos',
      'Manutenção preventiva conforme cronograma do fabricante',
    ],
  },
  {
    id: 'safe-5',
    title: 'Reação Química Inesperada',
    icon: 'flask-outline',
    description: 'Mistura incorreta de ingredientes pode gerar reações exotérmicas ou liberar gases',
    severity: 'Crítico',
    preventionSteps: [
      'Seguir rigorosamente a sequência de adição da receita',
      'Verificar compatibilidade química entre todos os ingredientes',
      'Adicionar ingredientes lentamente e com agitação controlada',
      'Manter distância segura e usar EPI durante a mistura',
    ],
  },
  {
    id: 'safe-6',
    title: 'Risco de Queda em Escadas',
    icon: 'warning-outline',
    description: 'Luvas de proteção química reduzem atrito e aumentam risco de escorregamento no corrimão. NUNCA use escadas com luvas.',
    severity: 'Crítico',
    preventionSteps: [
      'SEMPRE retire as luvas ANTES de usar qualquer escada da área',
      'SEMPRE segure o corrimão com firmeza ao subir ou descer',
      'Nunca carregue objetos que impeçam o uso do corrimão',
      'Inspecionar condição do piso e degraus antes de subir',
      'Botinas com solado antiderrapante são obrigatórias',
    ],
  },
  {
    id: 'safe-7',
    title: 'Risco no Carregamento de Baterias',
    icon: 'flash-outline',
    description: 'Baterias em carga liberam gases inflamáveis (H₂). Polaridade incorreta pode causar explosão, incêndio e lesões graves.',
    severity: 'Crítico',
    preventionSteps: [
      'VERIFICAR polaridade antes de conectar: Vermelho (+), Preto (-)',
      'Carregar EXCLUSIVAMENTE em local ventilado — nunca em espaços fechados',
      'DESLIGAR o carregador da tomada ANTES de desconectar qualquer cabo',
      'Usar óculos de proteção + viseira + luvas de procedimento',
      'Não carregar baterias danificadas, inchadas ou com vazamento de eletrólito',
      'Qualquer faísca ou odor anormal: interromper e acionar CIPA/supervisor',
    ],
  },
  {
    id: 'safe-8',
    title: 'Descarte Incorreto de Resíduos',
    icon: 'trash-outline',
    description: 'Descarte incorreto de resíduos químicos contamina o meio ambiente e pode gerar responsabilidade legal para colaborador e empresa.',
    severity: 'Alto',
    preventionSteps: [
      'Classificar antes: BCSBR01 (sólidos), BCSBR02 (líquidos/IBC), BCSBR03 (úmidos)',
      'NUNCA despejar resíduos líquidos em ralos, vasos sanitários ou solo',
      'NUNCA misturar resíduos de categorias diferentes no mesmo recipiente',
      'IBC cheio (BCSBR02): sinalizar, lacrar e acionar coleta imediatamente',
      'Acionar supervisor ambiental em caso de qualquer dúvida sobre classificação',
    ],
  },
  {
    id: 'safe-9',
    title: 'Empilhamento Incorreto de Sacas',
    icon: 'layers-outline',
    description: 'Misturar sacas massageadas com não-massageadas no empilhamento pode causar contaminação cruzada e invalidar o lote inteiro.',
    severity: 'Alto',
    preventionSteps: [
      'Identificar antes do empilhamento: o produto é massageado ou não?',
      'Sacas massageadas: empilhar apenas com outras sacas massageadas',
      'Produtos em bombona (FOX SUPRA, CROPSTAR): nunca misturar com sacas massageadas',
      'Qualquer mistura acidental: isolar o lote e acionar supervisor imediatamente',
      'Usar etiquetas de identificação de cor diferente para cada tipo',
    ],
  },
];
