# 📋 Guia de Implementação - Planilha & Guia

## Resumo das Mudanças

### ✅ O Que Foi Feito

1. **Guia de Formulação Expandido** (`app/(tabs)/guide.tsx`)
   - ✅ Adicionados 13 produtos Bayer (FOX XPRO, NATIVO, CURBIX, etc)
   - ✅ 10 ingredientes químicos com detalhes
   - ✅ 5 procedimentos operacionais
   - ✅ Tutorial de massagem com tempos
   - ✅ EPIs obrigatórios (uniforme, luvas, óculos, máscara, capacete)
   - ✅ Segurança do site (velocidade, celular, padrão, etc)

2. **Planilha Redesenhada** (`app/(tabs)/planilha.tsx`)
   - ✅ Design moderno tipo anexo 3 (dark theme)
   - ✅ Cores únicas por produto
   - ✅ Stats cards em scroll horizontal
   - ✅ Cards com barra colorida no topo
   - ✅ Badge de abreviação
   - ✅ Filtros estilizados
   - ✅ Info rows organizadas
   - ✅ Botão delete no canto
   - ✅ Observações destacadas

3. **Componentes Reutilizáveis** (`src/PlanilhaComponents.tsx`)
   - ✅ StatCard
   - ✅ ProductBadge
   - ✅ InfoPair
   - ✅ FilterButton
   - ✅ DeleteButton
   - ✅ ProductCardHeader
   - ✅ ModernCard

4. **Componentes de Guia** (`src/GuideComponents.tsx`)
   - ✅ VisualCard
   - ✅ DetailRow
   - ✅ EmptyState
   - ✅ Badge

## 🎨 Paleta de Cores por Produto

```
FOX XPRO      → #00BCFF (Azul)
NATIVO        → #89D329 (Verde)
FOX PRO       → #00BCFF (Azul)
CURBIX        → #EC4899 (Rosa)
CONNECT       → #F59E0B (Laranja)
BULLDOCK      → #8B5CF6 (Roxo)
ALSYSTIN      → #10B981 (Verde escuro)
OBERON        → #06B6D4 (Ciano)
PREMIER PLUS  → #F97316 (Laranja escuro)
PROVADO       → #EF4444 (Vermelho)
SPHERE MAX    → #6366F1 (Índigo)
FINISH        → #A78BFA (Roxo claro)
SOBERAN       → #14B8A6 (Verde azulado)
```

## 📁 Estrutura de Arquivos

```
src/
├── GuideComponents.tsx          # Componentes do Guia
├── PlanilhaComponents.tsx       # Componentes da Planilha
├── PLANILHA_CHANGES.md         # Changelog detalhado
└── IMPLEMENTATION_GUIDE.md      # Este arquivo

app/(tabs)/
├── guide.tsx                    # Guia com produtos + químicas
└── planilha.tsx                # Planilha redesenhada
```

## 🚀 Como Usar os Componentes

### Em PlanilhaComponents.tsx

```tsx
import {
  StatCard,
  ProductBadge,
  InfoPair,
  FilterButton,
  DeleteButton,
  ProductCardHeader,
  ModernCard,
} from '../../src/PlanilhaComponents';

// StatCard
<StatCard
  label="Total"
  value="42"
  icon="cube"
  color="#00BCFF"
  colors={colors}
/>

// ModernCard
<ModernCard
  color={productColor}
  colors={colors}
  onDeletePress={() => handleDelete(id)}
>
  <ProductCardHeader
    product={item.product}
    abbreviation={item.product_abbr}
    batch={item.batch}
    color={productColor}
    colors={colors}
  />
  {/* Conteúdo adicional */}
</ModernCard>

// FilterButton
<FilterButton
  text="Recebido"
  isActive={sitFilter === 'Recebido'}
  onPress={() => setSitFilter('Recebido')}
  colors={colors}
/>
```

### Em GuideComponents.tsx

```tsx
import {
  VisualCard,
  DetailRow,
  EmptyState,
  Badge,
} from '../../src/GuideComponents';

// VisualCard
<VisualCard
  id="tutorial-fox"
  icon="flask"
  title="FOX XPRO"
  subtitle="Triple Action"
  color="#00BCFF"
  isOpen={expandedId === 'tutorial-fox'}
  onPress={() => toggleExpand('tutorial-fox')}
  colors={colors}
>
  <Badge text="8-10 min" color="#00BCFF" />
  <DetailRow label="O que faz" value="Massageia TUDO" />
</VisualCard>

// DetailRow
<DetailRow
  label="Tempo"
  value="6 minutos e 40 segundos"
/>

// EmptyState
<EmptyState
  icon="flask"
  title="Nenhum produto encontrado"
  colors={colors}
/>
```

## 📊 Dados Padrão Adicionados

### Produtos (13 total)
- FOX XPRO, NATIVO, FOX PRO, CURBIX, CONNECT, BULLDOCK
- ALSYSTIN, OBERON, PREMIER PLUS, PROVADO
- SPHERE MAX, FINISH, SOBERAN

### Químicas (10 ingredientes)
- Trifloxystrobin (Strobilurin QoI)
- Tebuconazole (Triazol DMI)
- Prothioconazole (Triazol Avançado)
- Bixafen (Carboxamida SDHI)
- Clothianidin (Neonicotinóide)
- Metalaxyl (Fenilamida)
- Bacillus subtilis (Bio-ativo)
- Imidacloprido (Neonicotinóide)
- Propiconazole (Triazol Clássico)
- Azoxystrobin (Estrobilurina)

### Procedimentos (5 operacionais)
- Preparação do Equipamento
- Carregamento de Ingredientes
- Ciclo de Massagem
- Verificação de Qualidade
- Descarga e Embalagem

## 🔍 Checklist de Integração

### Guide.tsx
- [x] Produtos importados do anexo 2
- [x] Químicas preenchidas com detalhes
- [x] Procedimentos operacionais descritos
- [x] Tutorial de massagem expandido
- [x] EPIs completos
- [x] Segurança do site detalhada
- [x] Design visual moderno

### Planilha.tsx
- [x] Stats cards implementados
- [x] Cores por produto
- [x] Cards modernizados
- [x] Filtros estilizados
- [x] Badge de abreviação
- [x] Botão delete posicionado
- [x] Header novo
- [x] Empty states melhorados

### Componentes
- [x] GuideComponents.tsx criado
- [x] PlanilhaComponents.tsx criado
- [x] Todos os componentes testáveis
- [x] Exports organizados
- [x] Styles encapsulados

## 🐛 Troubleshooting

### Se os componentes não importam:
```tsx
// Correto
import { VisualCard } from '../../src/GuideComponents';

// Certifique-se do caminho relativo
// A partir de app/(tabs)/guide.tsx:
// ../../src/GuideComponents (2 pastas acima)
```

### Se as cores não aparecem:
```tsx
// Verifique se colors está sendo passado corretamente
const { colors } = useTheme();

// Passe sempre colors={colors} aos componentes
<StatCard colors={colors} ... />
```

### Se a exportação Excel falhar:
```tsx
// Verifique:
// 1. TOKEN do backend
// 2. URL da API (EXPO_PUBLIC_BACKEND_URL)
// 3. Permissões de arquivo
```

## 📱 Responsividade

Todos os componentes são responsivos:
- ✅ Stats cards scroll horizontal no mobile
- ✅ Filtros scroll horizontal
- ✅ Cards adaptáveis
- ✅ Texto com numberOfLines
- ✅ Padding adaptativo

## 🎯 Próximas Melhorias (Opcionais)

1. **Animações**: Transições suaves ao expandir cards
2. **Gráficos**: Adicionar gráficos de produção na planilha
3. **Busca**: Busca em tempo real melhorada
4. **Sync**: Sincronizar com backend em tempo real
5. **PDF**: Exportar como PDF além de Excel/PNG

## 📞 Suporte

Se encontrar problemas:
1. Verifique os imports
2. Valide o uso de `useTheme()`
3. Confirme que os dados estão sendo carregados
4. Teste em device real (não apenas emulador)

---

**Versão**: 1.0.0  
**Data**: Abril 2026  
**Status**: ✅ Completo e Testado
