# Nova Estrutura de Settings - Bayer Formulação

## Visão Geral

A seção de Configurações foi completamente refatorada para oferecer melhor organização, responsividade e experiência do usuário. Agora cada categoria tem sua própria página dedicada com funcionalidades específicas.

## Estrutura de Pastas

```
app/(tabs)/settings/
├── _layout.tsx          # Layout das sub-rotas
├── index.tsx            # Hub principal com menu de navegação
├── account.tsx          # Minha Conta - Perfil e informações pessoais
├── appearance.tsx       # Aparência - Tema e modo escuro
├── security.tsx         # Segurança - Senha e autenticação dupla
├── notifications.tsx    # Notificações - Alertas e preferências
├── products.tsx         # Catálogo - Produtos e pesos de referência
└── admin.tsx            # Administração - Painel admin (restrito)
```

## Páginas Disponíveis

### 1. Index (Hub Principal)
**Arquivo:** `index.tsx`

- Menu visual com cards para cada seção
- Informações do usuário no topo
- Responsivo: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop)
- Botão de logout no final

### 2. Minha Conta
**Arquivo:** `account.tsx`

Funcionalidades:
- Visualização do perfil com avatar grande
- Edição de nome e informações básicas
- Visualização de ID, tipo de conta e status
- Botão para deletar conta (zona de risco)
- Aviso para modo demo

### 3. Aparência
**Arquivo:** `appearance.tsx`

Funcionalidades:
- Seleção de tema (Claro/Escuro)
- Visualização compacta e animações
- Seletor de cores de destaque (6 opções)
- Informações de display (tema, resolução)
- Acessibilidade: tamanho de fonte e contraste

### 4. Segurança
**Arquivo:** `security.tsx`

Funcionalidades:
- Alterar senha com validação
- Autenticação em duas etapas
- Autenticação biométrica
- Lista de sessões ativas
- Histórico de login
- Dicas de senha forte

### 5. Notificações
**Arquivo:** `notifications.tsx`

Funcionalidades:
- Controles gerais (push, email)
- 4 categorias de notificação personalizáveis
- Horas silenciosas configuráveis
- Frequência de email ajustável
- Centro de notificações com histórico
- Botão para limpar todas

### 6. Catálogo de Produtos
**Arquivo:** `products.tsx`

Funcionalidades:
- Busca por nome ou abreviação
- Estatísticas (total, selecionados, filtrados)
- Seleção múltipla de produtos
- Grid responsivo (1 ou 2 colunas)
- Pesos de referência por produto
- Botão para salvar seleção

### 7. Administração
**Arquivo:** `admin.tsx`

Funcionalidades (apenas para admins):
- 4 ações administrativas (usuários, produtos, relatórios, backup)
- Configurações de sistema (manutenção, cache, sincronização)
- Logs e auditoria
- Informações do sistema
- Zona de risco para reset de dados

## Responsividade

### Hook useResponsive
**Arquivo:** `src/useResponsive.ts`

Propriedades disponíveis:
- `isMobile`: largura < 768px
- `isTablet`: 768px ≤ largura < 1024px
- `isDesktop`: largura ≥ 1024px
- `padding`: 16px (mobile), 20px (tablet), 24px (desktop)
- `gap`: 12px (mobile), 16px (others)
- `buttonHeight`: 44px (mobile), 48px (desktop)

### Exemplo de Uso

```tsx
const responsive = useResponsive();

<View style={{ padding: responsive.padding, gap: responsive.gap }}>
  <View style={[styles.grid, { gap: responsive.gap }]}>
    {items.map((item) => (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.card,
          { flex: responsive.isMobile ? 1 : 0.5 }
        ]}
      />
    ))}
  </View>
</View>
```

## Navegação

### Estrutura
```
/(tabs)
└── settings
    ├── index (hub)
    ├── account
    ├── appearance
    ├── security
    ├── notifications
    ├── products
    └── admin
```

### Navegação entre páginas
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Navegar para uma seção
router.push('/(tabs)/settings/account');

// Voltar
router.back();
```

## Estilo e Tema

Todas as páginas utilizam o sistema de cores do tema atual:

```tsx
const { colors, mode, toggle } = useTheme();

// Cores disponíveis
colors.primary        // Azul principal
colors.secondary      // Cor secundária
colors.success        // Verde
colors.warning        // Laranja
colors.danger         // Vermelho
colors.info           // Azul claro
colors.surface        // Fundo dos cards
colors.background     // Fundo da página
colors.textPrimary    // Texto principal
colors.textSecondary  // Texto secundário
colors.textTertiary   // Texto terciário
colors.border         // Bordas
```

## Componentes Reutilizáveis

### Header Padrão
Todas as páginas têm um header com:
- Botão voltar à esquerda
- Título centralizado
- Espaçador à direita

```tsx
<View style={[styles.header, { backgroundColor: colors.surface }]}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="chevron-back" size={24} />
  </TouchableOpacity>
  <Text style={styles.title}>Título</Text>
  <View style={{ width: 24 }} />
</View>
```

### Section Labels
Rótulos de seção com estilo consistente:

```tsx
<Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
  NOME DA SEÇÃO
</Text>
```

### Cards e Rows
Cards com bordas, superfícies e ícones padronizados.

## Performance

### Otimizações Implementadas
- Lazy loading com ScrollView
- Uso de `keyboardShouldPersistTaps="handled"`
- Avoid re-renders desnecessários com `useCallback`
- Listener de Dimensions removido corretamente

### Exemplo de Carregamento

```tsx
const loadProducts = useCallback(async () => {
  if (isDemo) return;
  try {
    const r = await api.get('/products');
    setProducts(Array.isArray(r.data) ? r.data : []);
  } catch {}
}, [isDemo]);

useEffect(() => {
  loadProducts();
}, [loadProducts]);
```

## Estados do Aplicativo

### Demo Mode
- Modo de demonstração disable algumas funcionalidades
- Aviso visual em cards relevantes
- Dados não são persistidos

### Modo Escuro
- Suportado em todas as páginas
- Cores ajustadas automaticamente
- Usa sistema de cores do tema

## Próximos Passos / TODO

- [ ] Integrar com backend para persistência
- [ ] Implementar validações mais robustas
- [ ] Adicionar animações de transição
- [ ] Implementar notificações reais
- [ ] Adicionar autenticação biométrica real
- [ ] Criar testes unitários
- [ ] Melhorar acessibilidade (WCAG)

## Troubleshooting

### Problema: Layout quebrado no tablet
**Solução:** Verifique o hook `useResponsive()` - os breakpoints podem precisar ajuste para seu caso específico.

### Problema: Cores não aparecem corretamente
**Solução:** Verifique se o `ThemeProvider` está envolvendo toda a aplicação no `_layout.tsx` raiz.

### Problema: Navegação não funciona
**Solução:** Certifique-se de que o `_layout.tsx` está na pasta `settings/` e exporta corretamente as rotas.

## Suporte

Para questões sobre a nova estrutura de settings:
1. Verifique a documentação acima
2. Consulte o código dos componentes
3. Teste no previewer
