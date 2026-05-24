import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Image,
  LinearGradient,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/auth";
import { useTheme } from "../../src/theme";

type Recipe = {
  product: string;
  recipe: string;
  active_ingredient: string;
  category: string;
  func: string;
  application: string;
  notes: string;
};

type Chemistry = {
  name: string;
  alias: string;
  className: string;
  func: string;
  applications: string;
  safety: string;
};

type Procedure = { title: string; icon: any; content: string };

type GuideCategory = "produtos" | "quimica" | "procedimentos" | "seguranca" | "epis" | "tutorial";

interface CategoryItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  badge?: string;
}

const { width } = Dimensions.get("window");

export default function GuideScreen() {
  const { colors } = useTheme();

  const [activeCategory, setActiveCategory] = useState<GuideCategory>("produtos");
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [chemistry, setChemistry] = useState<Chemistry[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/recipes");
        setRecipes(r.data.recipes ?? []);
        setChemistry(r.data.chemistry ?? []);
        setProcedures(r.data.procedures ?? []);
      } catch (e) {
        console.log("Erro recipes:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const q = search.trim().toLowerCase();

  const filteredRecipes = useMemo(() => {
    if (!q) return recipes;
    return recipes.filter((r) =>
      `${r.product} ${r.recipe} ${r.active_ingredient} ${r.category}`
        .toLowerCase()
        .includes(q)
    );
  }, [recipes, q]);

  const filteredChem = useMemo(() => {
    if (!q) return chemistry;
    return chemistry.filter((c) =>
      `${c.name} ${c.alias} ${c.className}`.toLowerCase().includes(q)
    );
  }, [chemistry, q]);

  const filteredProc = useMemo(() => {
    if (!q) return procedures;
    return procedures.filter((p) =>
      `${p.title} ${p.content}`.toLowerCase().includes(q)
    );
  }, [procedures, q]);

  const categories: { key: GuideCategory; label: string; icon: any; color: string }[] = [
    { key: "produtos", label: "Produtos", icon: "flask", color: "#00BCFF" },
    { key: "quimica", label: "Química", icon: "leaf", color: "#89D329" },
    { key: "procedimentos", label: "Procedimentos", icon: "cog", color: "#F59E0B" },
    { key: "tutorial", label: "Tutorial", icon: "play-circle", color: "#EC4899" },
    { key: "epis", label: "EPIs", icon: "shield", color: "#8B5CF6" },
    { key: "seguranca", label: "Segurança", icon: "warning", color: "#EF4444" },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>📚 Guia Prático</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Tudo o que você precisa saber
        </Text>
      </View>

      {/* SEARCH BAR */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar informações..."
          placeholderTextColor={colors.textTertiary}
          style={[styles.searchInput, { color: colors.textPrimary }]}
        />
        {search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORY TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              onPress={() => {
                setActiveCategory(cat.key);
                setExpandedId(null);
                setSearch("");
              }}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: isActive ? cat.color : colors.surface,
                  borderColor: isActive ? cat.color : colors.border,
                },
              ]}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={isActive ? "#FFFFFF" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: isActive ? "#FFFFFF" : colors.textSecondary,
                    fontWeight: isActive ? "700" : "600",
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentScroll}>
          {/* PRODUTOS */}
          {activeCategory === "produtos" && (
            <View>
              {filteredRecipes.length === 0 && (
                <EmptyState icon="flask" title="Nenhum produto encontrado" colors={colors} />
              )}
              {filteredRecipes.map((r, i) => {
                const id = `p-${r.product}-${i}`;
                const isOpen = expandedId === id;
                return (
                  <VisualCard
                    key={id}
                    id={id}
                    icon="flask"
                    title={r.product}
                    subtitle={r.recipe}
                    color="#00BCFF"
                    isOpen={isOpen}
                    onPress={() => toggleExpand(id)}
                    colors={colors}
                  >
                    <DetailRow label="Ativo" value={r.active_ingredient} />
                    <DetailRow label="Categoria" value={r.category} />
                    <DetailRow label="Função" value={r.func} />
                    <DetailRow label="Aplicação" value={r.application} />
                    <DetailRow label="Observações" value={r.notes} />
                  </VisualCard>
                );
              })}
            </View>
          )}

          {/* QUÍMICA */}
          {activeCategory === "quimica" && (
            <View>
              {filteredChem.length === 0 && (
                <EmptyState icon="leaf" title="Nenhum ingrediente encontrado" colors={colors} />
              )}
              {filteredChem.map((c, i) => {
                const id = `c-${c.name}-${i}`;
                const isOpen = expandedId === id;
                return (
                  <VisualCard
                    key={id}
                    id={id}
                    icon="leaf"
                    title={c.name}
                    subtitle={c.alias}
                    color="#89D329"
                    isOpen={isOpen}
                    onPress={() => toggleExpand(id)}
                    colors={colors}
                  >
                    <DetailRow label="Classe" value={c.className} />
                    <DetailRow label="Função" value={c.func} />
                    <DetailRow label="Aplicações" value={c.applications} />
                    <DetailRow label="Segurança" value={c.safety} />
                  </VisualCard>
                );
              })}
            </View>
          )}

          {/* PROCEDIMENTOS */}
          {activeCategory === "procedimentos" && (
            <View>
              {filteredProc.length === 0 && (
                <EmptyState icon="cog" title="Nenhum procedimento encontrado" colors={colors} />
              )}
              {filteredProc.map((p, i) => {
                const id = `proc-${p.title}-${i}`;
                const isOpen = expandedId === id;
                return (
                  <VisualCard
                    key={id}
                    id={id}
                    icon={p.icon}
                    title={p.title}
                    subtitle=""
                    color="#F59E0B"
                    isOpen={isOpen}
                    onPress={() => toggleExpand(id)}
                    colors={colors}
                  >
                    <Text style={{ color: colors.textPrimary, lineHeight: 20 }}>
                      {p.content}
                    </Text>
                  </VisualCard>
                );
              })}
            </View>
          )}

          {/* TUTORIAL */}
          {activeCategory === "tutorial" && (
            <View>
              <TutorialSection colors={colors} expandedId={expandedId} onToggle={toggleExpand} />
            </View>
          )}

          {/* EPIs */}
          {activeCategory === "epis" && (
            <View>
              <EPISSection colors={colors} expandedId={expandedId} onToggle={toggleExpand} />
            </View>
          )}

          {/* SEGURANÇA */}
          {activeCategory === "seguranca" && (
            <View>
              <SecuritySection colors={colors} expandedId={expandedId} onToggle={toggleExpand} />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ========== COMPONENTS ========== */

interface VisualCardProps {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  isOpen: boolean;
  onPress: () => void;
  colors: any;
  children: React.ReactNode;
}

function VisualCard({ id, icon, title, subtitle, color, isOpen, onPress, colors, children }: VisualCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.visualCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* HEADER COM GRADIENT */}
        <View style={[styles.cardHeader, { backgroundColor: color }]}>
          <View style={styles.cardIconContainer}>
            <Ionicons name={icon} size={24} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
          </View>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#FFFFFF"
          />
        </View>

        {/* CONTENT */}
        {isOpen && (
          <View style={[styles.cardContent, { borderTopColor: colors.border }]}>
            {children}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

function EmptyState({ icon, title, colors }: any) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={48} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );
}

function TutorialSection({ colors, expandedId, onToggle }: any) {
  const tutorialItems = [
    {
      id: "tut-intro",
      icon: "book",
      title: "Como Massagear Corretamente",
      subtitle: "Guia passo a passo",
      color: "#EC4899",
      content: (
        <>
          <DetailRow label="Equipamento" value="National Bulk Equipment - Massageador industrial" />
          <DetailRow
            label="Objetivo"
            value="Homogeneizar completamente a mistura de ingredientes ativos"
          />
          <DetailRow label="Dica importante" value="Não abra antes do tempo! Aguarde a homogeneidade total." />
        </>
      ),
    },
    {
      id: "tut-fox",
      icon: "flask",
      title: "FOX XPRO",
      subtitle: "Massagem completa • ~8-10 minutos",
      color: "#00BCFF",
      badge: "8-10 min",
      content: (
        <>
          <DetailRow label="O que faz" value="Massageia TUDO - ingredientes ativos + auxiliares" />
          <DetailRow label="Composição" value="Trifloxystrobin + Prothioconazole + Bixafen" />
          <DetailRow label="Tempo" value="8 a 10 minutos" />
          <DetailRow label="Passo 1" value="Carregue a máquina com os ingredientes" />
          <DetailRow label="Passo 2" value="Inicie a sessão de massagem" />
          <DetailRow label="Passo 3" value="Aguarde 8-10 min até homogeneidade" />
          <DetailRow label="Passo 4" value="Abra quando estiver completamente misturado" />
        </>
      ),
    },
    {
      id: "tut-nativo",
      icon: "flask",
      title: "NATIVO WG 75",
      subtitle: "Massagem completa • ~6-8 minutos",
      color: "#89D329",
      badge: "6-8 min",
      content: (
        <>
          <DetailRow label="Composição" value="Tebuconazole (50%) + Trifloxystrobin (25%)" />
          <DetailRow label="Tipo" value="Dual-action - preventivo e curativo" />
          <DetailRow label="Tempo" value="6 a 8 minutos" />
          <DetailRow label="Passo 1" value="Adicione a água ao recipiente" />
          <DetailRow label="Passo 2" value="Coloque o pó WG" />
          <DetailRow label="Passo 3" value="Inicie a massagem" />
          <DetailRow label="Passo 4" value="Aguarde homogeneidade completa" />
        </>
      ),
    },
    {
      id: "tut-trifloxy",
      icon: "flask",
      title: "TRIFLOXY 500",
      subtitle: "Massagem específica • 6:40",
      color: "#F59E0B",
      badge: "6:40 exato",
      content: (
        <>
          <DetailRow label="O que faz" value="Apenas TRIFLOXYSTROBIN - massageia só o ativo" />
          <DetailRow label="Tempo Exato" value="6 minutos e 40 segundos (CRÍTICO!)" />
          <DetailRow label="Dica" value="Use cronômetro! Este é um componente crítico para a formulação." />
          <DetailRow label="Passo 1" value="Prepare o recipiente" />
          <DetailRow label="Passo 2" value="Carregue o trifloxystrobin" />
          <DetailRow label="Passo 3" value="Ative temporizador (6:40)" />
          <DetailRow label="Passo 4" value="Mantenha temperatura controlada" />
        </>
      ),
    },
    {
      id: "tut-belt",
      icon: "flask",
      title: "Produtos SEM Massagem",
      subtitle: "Apenas descascador",
      color: "#06B6D4",
      badge: "Pré-processamento",
      content: (
        <>
          <DetailRow label="BELT" value="Apenas DESCASCAR - não precisa massagear" />
          <DetailRow label="Processo" value="Direto - remove camadas/cascas da matéria-prima" />
          <DetailRow label="Tempo" value="Varia conforme o volume (3-5 min tipicamente)" />
          <DetailRow label="Resultado" value="Após descascar, está pronto para as próximas etapas" />
        </>
      ),
    },
  ];

  return (
    <View>
      {tutorialItems.map((item) => (
        <VisualCard
          key={item.id}
          id={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          color={item.color}
          isOpen={expandedId === item.id}
          onPress={() => onToggle(item.id)}
          colors={colors}
        >
          {item.badge && (
            <View
              style={[
                styles.badge,
                { backgroundColor: item.color },
              ]}
            >
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          {item.content}
        </VisualCard>
      ))}
    </View>
  );
}

function EPISSection({ colors, expandedId, onToggle }: any) {
  const episItems = [
    {
      id: "epis-intro",
      icon: "shield",
      title: "EPIs Obrigatórios",
      subtitle: "Proteção pessoal ESSENCIAL",
      color: "#8B5CF6",
      content: (
        <>
          <DetailRow
            label="Regra"
            value="Todos que trabalham com formulação DEVEM usar EPI completo"
          />
          <DetailRow label="Importância" value="Protege SUA SAÚDE e a de sua equipe" />
        </>
      ),
    },
    {
      id: "epis-uniform",
      icon: "shirt",
      title: "👕 Uniforme / Vestuário",
      subtitle: "Proteção básica",
      color: "#A78BFA",
      content: (
        <>
          <DetailRow label="Tipo" value="Macacão ou uniforme de manga comprida" />
          <DetailRow label="Cor" value="Branco ou cores claras preferencialmente" />
          <DetailRow label="Estado" value="Limpo, sem rasgos, sem bolsos abertos" />
          <DetailRow label="Padrão Bayer" value="Uniforme corporativo, mangas até punho" />
        </>
      ),
    },
    {
      id: "epis-gloves",
      icon: "hand-left",
      title: "🧤 Luvas",
      subtitle: "Proteção das mãos",
      color: "#A78BFA",
      content: (
        <>
          <DetailRow label="Material" value="Nitrilo ou PVC (resistente a químicos)" />
          <DetailRow label="Troca" value="A cada 2 horas ou se danificadas" />
          <DetailRow label="Tamanho" value="Ajuste correto - nem folgadas, nem apertadas" />
          <DetailRow label="Boas práticas" value="Retire quando sair da área e lave as mãos" />
        </>
      ),
    },
    {
      id: "epis-shoes",
      icon: "footsteps",
      title: "🦶 Calçados de Segurança",
      subtitle: "Proteção dos pés",
      color: "#A78BFA",
      content: (
        <>
          <DetailRow label="Obrigatório" value="Sapato fechado com biqueira reforçada (steel toe)" />
          <DetailRow label="Sola" value="Antideslizante com boa aderência" />
          <DetailRow label="Limpeza" value="Remova toda poeira/líquido ao sair" />
          <DetailRow label="Durabilidade" value="Substitua quando desgastados (máx 12 meses)" />
        </>
      ),
    },
    {
      id: "epis-glasses",
      icon: "eye",
      title: "🥽 Óculos de Proteção",
      subtitle: "Proteção dos olhos",
      color: "#A78BFA",
      content: (
        <>
          <DetailRow label="Tipo" value="Óculos panorâmicos (protegem laterais)" />
          <DetailRow label="Lentes" value="Policarbonato resistente a impacto" />
          <DetailRow label="Uso" value="SEMPRE durante processamento" />
          <DetailRow
            label="Emergência"
            value="Se espirrar nos olhos: lave com água 15 min"
          />
        </>
      ),
    },
    {
      id: "epis-mask",
      icon: "lungs",
      title: "😷 Máscara Respiratória",
      subtitle: "Proteção das vias aéreas",
      color: "#A78BFA",
      content: (
        <>
          <DetailRow label="Tipo" value="N95 ou máscara com filtro para pós químicos" />
          <DetailRow label="Quando usar" value="Durante descascamento e operações com poeira" />
          <DetailRow label="Substituição" value="Quando desgastar ou após 40 horas" />
          <DetailRow label="Ajuste" value="Deve cobrir nariz e boca completamente" />
        </>
      ),
    },
    {
      id: "epis-helmet",
      icon: "shield-checkmark",
      title: "👷 Capacete",
      subtitle: "Proteção da cabeça",
      color: "#A78BFA",
      content: (
        <>
          <DetailRow label="Obrigatoriedade" value="SIM - em todas as áreas de operação" />
          <DetailRow label="Cor" value="Amarelo ou cor corporativa Bayer" />
          <DetailRow label="Inspeção" value="Revise trincas antes de usar" />
          <DetailRow label="Limpeza" value="Limpe a banda interna regularmente" />
        </>
      ),
    },
  ];

  return (
    <View>
      {episItems.map((item) => (
        <VisualCard
          key={item.id}
          id={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          color={item.color}
          isOpen={expandedId === item.id}
          onPress={() => onToggle(item.id)}
          colors={colors}
        >
          {item.content}
        </VisualCard>
      ))}
    </View>
  );
}

function SecuritySection({ colors, expandedId, onToggle }: any) {
  const securityItems = [
    {
      id: "seg-velocidade",
      icon: "speedometer",
      title: "🚗 Velocidade Máxima",
      subtitle: "20 km/h com veículos",
      color: "#EF4444",
      content: (
        <>
          <DetailRow label="Limite" value="Máximo 20 km/h nas áreas de operação" />
          <DetailRow label="Zona" value="Especialmente importante na zona amarela demarcada" />
          <DetailRow label="Por quê" value="Respeita a segurança e preserva o pavimento" />
          <DetailRow label="Multa" value="Repreensão e possível desligamento" />
        </>
      ),
    },
    {
      id: "seg-celular",
      icon: "phone",
      title: "📵 Proibido Celular",
      subtitle: "Em áreas críticas",
      color: "#EF4444",
      content: (
        <>
          <DetailRow
            label="Restrição"
            value="Em áreas de máquinas e operação, celular é proibido"
          />
          <DetailRow label="Motivo" value="Concentração essencial para segurança" />
          <DetailRow label="Localização" value="Use apenas em áreas designadas" />
          <DetailRow label="Consequência" value="Advertência e possível suspensão" />
        </>
      ),
    },
    {
      id: "seg-padrão",
      icon: "footsteps",
      title: "🟨 Siga o Padrão Demarcado",
      subtitle: "Rotas de segurança",
      color: "#EF4444",
      content: (
        <>
          <DetailRow
            label="Obrigação"
            value="Caminhe sempre pelas rotas demarcadas com fita amarela"
          />
          <DetailRow label="Limite" value="Não saia dos limites estabelecidos" />
          <DetailRow label="Motivo" value="Evita áreas com riscos de acidentes" />
          <DetailRow label="Monitoramento" value="Supervisores verificam conformidade" />
        </>
      ),
    },
    {
      id: "seg-fone",
      icon: "volume-mute",
      title: "🎧 Sem Fone de Ouvido",
      subtitle: "Alerta e comunicação",
      color: "#EF4444",
      content: (
        <>
          <DetailRow label="Regra" value="Fone de ouvido é proibido em áreas de operação" />
          <DetailRow
            label="Razão"
            value="Precisa ouvir alertas e avisos de máquinas"
          />
          <DetailRow label="Emergência" value="Sinais sonoros são críticos para reações" />
          <DetailRow label="Penalidade" value="Advertência escrita" />
        </>
      ),
    },
    {
      id: "seg-pausas",
      icon: "cafe",
      title: "☕ Faça Pausas",
      subtitle: "Saúde é prioridade",
      color: "#EF4444",
      content: (
        <>
          <DetailRow label="Importância" value="Pausas regulares evitam fadiga" />
          <DetailRow label="Frequência" value="A cada 2 horas (conforme protocolo)" />
          <DetailRow label="Cobertura" value="Solicite cobertura antes de pausar" />
          <DetailRow label="Limite" value="Máximo 15 minutos por pausa" />
        </>
      ),
    },
    {
      id: "seg-emergencia",
      icon: "alert-circle",
      title: "🚨 Procedimento de Acidente",
      subtitle: "Ação rápida",
      color: "#EF4444",
      content: (
        <>
          <DetailRow label="1º Passo" value="PARE imediatamente sua atividade" />
          <DetailRow label="2º Passo" value="Avise um supervisor/responsável" />
          <DetailRow label="3º Passo" value="Dirija-se à sala de primeiros socorros" />
          <DetailRow label="4º Passo" value="Reporte o incidente no formulário" />
          <DetailRow
            label="Emergência"
            value="Ligue para segurança do site imediatamente"
          />
        </>
      ),
    },
    {
      id: "seg-quimico",
      icon: "water",
      title: "💧 Exposição a Químicos",
      subtitle: "Protocolos de segurança",
      color: "#EF4444",
      content: (
        <>
          <DetailRow label="Contato com pele" value="Lave com água corrente por 15 minutos" />
          <DetailRow label="Contato com olhos" value="Lave por 15 min e procure médico" />
          <DetailRow label="Inalação" value="Saia da área e respire ar fresco" />
          <DetailRow label="Se sentir mal" value="Procure médico imediatamente" />
        </>
      ),
    },
  ];

  return (
    <View>
      {securityItems.map((item) => (
        <VisualCard
          key={item.id}
          id={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          color={item.color}
          isOpen={expandedId === item.id}
          onPress={() => onToggle(item.id)}
          colors={colors}
        >
          {item.content}
        </VisualCard>
      ))}
    </View>
  );
}

/* ========== STYLES ========== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  categoriesList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },

  categoryText: {
    fontSize: 12,
  },

  contentScroll: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 100,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  visualCard: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },

  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },

  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },

  cardContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
  },

  detailRow: {
    marginBottom: 10,
  },

  detailLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 13,
    lineHeight: 18,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
