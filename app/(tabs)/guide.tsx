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

type SafetyRule = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Tab = "produtos" | "quimica" | "procedimentos" | "seguranca" | "epis" | "tutorial";

export default function GuiaScreen() {
  const { colors } = useTheme();

  const [tab, setTab] = useState<Tab>("produtos");
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [chemistry, setChemistry] = useState<Chemistry[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [safetyRules] = useState<SafetyRule[]>([
    {
      id: "velocidade",
      title: "🚗 Velocidade Máxima",
      description: "Máximo 20 km/h com veículos nas áreas de operação. Respeite a segurança e o pavimento.",
      icon: "speedometer",
    },
    {
      id: "celular",
      title: "📵 Proibido Celular",
      description:
        "Em áreas de máquinas e operação massageadora, uso de celular é proibido. Concentre-se!",
      icon: "phone",
    },
    {
      id: "padrão",
      title: "🟨 Siga o Padrão Demarcado",
      description: "Caminhe sempre pelas rotas demarcadas com fita amarela. Não saia dos limites.",
      icon: "footsteps",
    },
    {
      id: "fone",
      title: "🎧 Sem Fone de Ouvido",
      description:
        "Fone de ouvido é proibido. Você precisa ouvir alertas de segurança e avisos de máquinas.",
      icon: "volume-mute",
    },
    {
      id: "epi",
      title: "🛡️ EPI Obrigatório",
      description:
        "Use sempre o equipamento de proteção. Revise a aba de EPIs para mais detalhes.",
      icon: "shield",
    },
    {
      id: "pausas",
      title: "☕ Faça Pausas",
      description:
        "Pausas regulares evitam fadiga. Solicite cobertura e respeite os horários. Saúde em primeiro lugar!",
      icon: "cafe",
    },
  ]);

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
      `${c.name} ${c.alias} ${c.className}`
        .toLowerCase()
        .includes(q)
    );
  }, [chemistry, q]);

  const filteredProc = useMemo(() => {
    if (!q) return procedures;
    return procedures.filter((p) =>
      `${p.title} ${p.content}`.toLowerCase().includes(q)
    );
  }, [procedures, q]);

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "produtos", label: "Produtos", icon: "flask-outline" },
    { key: "quimica", label: "Química", icon: "leaf-outline" },
    { key: "procedimentos", label: "Procedimentos", icon: "cog-outline" },
    { key: "tutorial", label: "Tutorial", icon: "play-outline" },
    { key: "epis", label: "EPIs", icon: "shield-outline" },
    { key: "seguranca", label: "Segurança", icon: "warning-outline" },
  ];

  const toggle = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Guia de Formulação
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Produtos, química e procedimentos
        </Text>
      </View>

      {/* SEARCH */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={16} color={colors.textTertiary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar..."
          placeholderTextColor={colors.textTertiary}
          style={[styles.searchInput, { color: colors.textPrimary }]}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* TABS */}
      <View style={styles.tabsRow}>
        {tabs.map((t) => {
          const active = tab === t.key;

          return (
            <TouchableOpacity
              key={t.key}
              onPress={() => {
                setTab(t.key);
                setExpanded(null);
              }}
              style={[
                styles.tab,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name={t.icon}
                size={12}
                color={active ? "#000" : colors.textSecondary}
              />
              <Text
                style={{
                  color: active ? "#000" : colors.textSecondary,
                  fontSize: 11,
                  fontWeight: active ? "700" : "500",
                }}
                numberOfLines={1}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={{ padding: 30 }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          {/* PRODUTOS */}
          {tab === "produtos" &&
            filteredRecipes.map((r, i) => {
              const key = `p-${r.product}-${i}`;
              const open = expanded === key;

              return (
                <Card
                  key={key}
                  title={r.product}
                  subtitle={r.recipe}
                  icon="flask"
                  colors={colors}
                  open={open}
                  onPress={() => toggle(key)}
                >
                  <KV k="Ativo" v={r.active_ingredient} colors={colors} />
                  <KV k="Categoria" v={r.category} colors={colors} />
                  <KV k="Função" v={r.func} colors={colors} />
                  <KV k="Aplicação" v={r.application} colors={colors} />
                  <KV k="Obs" v={r.notes} colors={colors} />
                </Card>
              );
            })}

          {/* QUÍMICA */}
          {tab === "quimica" &&
            filteredChem.map((c, i) => {
              const key = `c-${c.name}-${i}`;
              const open = expanded === key;

              return (
                <Card
                  key={key}
                  title={c.name}
                  subtitle={`${c.className} · ${c.alias}`}
                  icon="leaf"
                  colors={colors}
                  open={open}
                  onPress={() => toggle(key)}
                >
                  <KV k="Função" v={c.func} colors={colors} />
                  <KV k="Aplicações" v={c.applications} colors={colors} />
                  <KV k="Segurança" v={c.safety} colors={colors} />
                </Card>
              );
            })}

          {/* PROCEDIMENTOS */}
          {tab === "procedimentos" &&
            filteredProc.map((p, i) => {
              const key = `r-${p.title}-${i}`;
              const open = expanded === key;

              return (
                <Card
                  key={key}
                  title={p.title}
                  subtitle=""
                  icon={p.icon}
                  colors={colors}
                  open={open}
                  onPress={() => toggle(key)}
                >
                  <Text style={{ color: colors.textPrimary }}>
                    {p.content}
                  </Text>
                </Card>
              );
            })}

          {/* TUTORIAL MASSAGEM */}
          {tab === "tutorial" && (
            <>
              <Card
                title="Como Massagear Corretamente"
                subtitle="Guia prático passo a passo"
                icon="book"
                colors={colors}
                open={expanded === "tutorial-intro"}
                onPress={() => toggle("tutorial-intro")}
              >
                <Text style={{ color: colors.textPrimary, marginBottom: 12 }}>
                  O equipamento de massagem é essencial para misturar e processar as receitas. Siga este guia para obter resultados ótimos:
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  ⏱️ Tempos variam conforme a receita. Veja os detalhes de cada uma abaixo.
                </Text>
              </Card>

              <Card
                title="FOX XPRO"
                subtitle="Massagem completa • ~8-10 minutos"
                icon="flask"
                colors={colors}
                open={expanded === "tutorial-fox"}
                onPress={() => toggle("tutorial-fox")}
              >
                <KV k="O que faz" v="Massageia TUDO - ingredientes ativos + auxiliares" colors={colors} />
                <KV k="Tempo" v="8 a 10 minutos" colors={colors} />
                <KV k="Passos" v="1️⃣ Carregue a máquina\n2️⃣ Inicie a sessão\n3️⃣ Aguarde 8-10 min\n4️⃣ Abra quando estiver homogêneo" colors={colors} />
                <KV k="Dica" v="Não abra antes do tempo! O produto precisa estar bem misturado." colors={colors} />
              </Card>

              <Card
                title="NATIVO WG 75"
                subtitle="Massagem completa • ~6-8 minutos"
                icon="flask"
                colors={colors}
                open={expanded === "tutorial-nativo"}
                onPress={() => toggle("tutorial-nativo")}
              >
                <KV k="O que faz" v="Tebuconazole (50%) + Trifloxystrobin (25%) - TUDO massageia" colors={colors} />
                <KV k="Tempo" v="6 a 8 minutos" colors={colors} />
                <KV k="Passos" v="1️⃣ Adicione a água\n2️⃣ Coloque o pó WG\n3️⃣ Inicie a massagem\n4️⃣ Aguarde homogeneidade" colors={colors} />
                <KV k="Dica" v="Mistura dual-action. Garanta que toda a poeira se integre." colors={colors} />
              </Card>

              <Card
                title="TRIFLOXY 500"
                subtitle="Massagem específica • ~6:40 (6min 40s)"
                icon="flask"
                colors={colors}
                open={expanded === "tutorial-trifloxy"}
                onPress={() => toggle("tutorial-trifloxy")}
              >
                <KV k="O que faz" v="Apenas TRIFLOXYSTROBIN (50%) - massageia somente o ativo" colors={colors} />
                <KV k="Tempo Exato" v="6 minutos e 40 segundos" colors={colors} />
                <KV k="Passos" v="1️⃣ Prepare o recipiente\n2️⃣ Carregue o trifloxystrobin\n3️⃣ Ative temporizador (6:40)\n4️⃣ Mantenha temperatura controlada" colors={colors} />
                <KV k="Dica" v="Este é um componente crítico. Cronometro é obrigatório!" colors={colors} />
              </Card>

              <Card
                title="Produtos SEM Massagem"
                subtitle="Apenas descascador / pré-processamento"
                icon="flask"
                colors={colors}
                open={expanded === "tutorial-belt"}
                onPress={() => toggle("tutorial-belt")}
              >
                <KV k="BELT" v="Apenas DESCASCAR - não precisa massagear. Processo direto." colors={colors} />
                <KV k="Tempo" v="Varia conforme o volume (3-5 min tipicamente)" colors={colors} />
                <KV k="O que faz" v="Remove camadas/cascas da matéria-prima. NÃO mistura." colors={colors} />
                <KV k="Dica" v="Após descascar, o material já está pronto para as próximas etapas." colors={colors} />
              </Card>
            </>
          )}

          {/* EPIs */}
          {tab === "epis" && (
            <>
              <Card
                title="EPIs Obrigatórios"
                subtitle="Proteção pessoal é ESSENCIAL"
                icon="shield"
                colors={colors}
                open={expanded === "epis-intro"}
                onPress={() => toggle("epis-intro")}
              >
                <Text style={{ color: colors.textPrimary, marginBottom: 8 }}>
                  Todos que trabalham com formulação DEVEM usar:
                </Text>
              </Card>

              <Card
                title="👕 Uniforme / Vestuário"
                subtitle="Proteção básica"
                icon="shirt"
                colors={colors}
                open={expanded === "epis-uniform"}
                onPress={() => toggle("epis-uniform")}
              >
                <KV k="O que usar" v="Macacão ou uniforme de manga comprida" colors={colors} />
                <KV k="Cor" v="Preferencialmente branco ou cores claras" colors={colors} />
                <KV k="Estado" v="Limpo, sem rasgos, sem bolsos abertos" colors={colors} />
                <KV k="Norma Bayer" v="Uniforme corporativo, mangas cobrindo punho" colors={colors} />
              </Card>

              <Card
                title="🧤 Luvas"
                subtitle="Proteção das mãos"
                icon="hand"
                colors={colors}
                open={expanded === "epis-gloves"}
                onPress={() => toggle("epis-gloves")}
              >
                <KV k="Tipo" v="Nitrilo ou PVC (resistente a químicos)" colors={colors} />
                <KV k="Troca" v="Trocar a cada 2 horas ou se danificadas" colors={colors} />
                <KV k="Tamanho" v="Ajuste correto - nem muito folgadas, nem apertadas" colors={colors} />
                <KV k="Boas práticas" v="Retire sempre que sair da área. Lave as mãos." colors={colors} />
              </Card>

              <Card
                title="🦶 Calçados de Segurança"
                subtitle="Proteção dos pés"
                icon="footsteps"
                colors={colors}
                open={expanded === "epis-shoes"}
                onPress={() => toggle("epis-shoes")}
              >
                <KV k="Obrigatório" v="Sapato fechado com biqueira reforçada (steel toe)" colors={colors} />
                <KV k="Antideslizante" v="Sola com boa aderência (prevenção de quedas)" colors={colors} />
                <KV k="Limpeza" v="Remova toda poeira/líquido químico ao sair" colors={colors} />
                <KV k="Durabilidade" v="Substitua quando desgastados (máx 12 meses)" colors={colors} />
              </Card>

              <Card
                title="🥽 Óculos de Proteção"
                subtitle="Proteção dos olhos"
                icon="eye"
                colors={colors}
                open={expanded === "epis-glasses"}
                onPress={() => toggle("epis-glasses")}
              >
                <KV k="Tipo" v="Óculos panorâmicos (protegem laterais também)" colors={colors} />
                <KV k="Lentes" v="Policarbonato resistente a impacto" colors={colors} />
                <KV k="Uso" v="Durante TODO processamento e massagem" colors={colors} />
                <KV k="Emergência" v="Se líquido espirra nos olhos: lave com água por 15 min" colors={colors} />
              </Card>

              <Card
                title="😷 Máscara/Proteção Respiratória"
                subtitle="Proteção das vias aéreas"
                icon="lungs"
                colors={colors}
                open={expanded === "epis-mask"}
                onPress={() => toggle("epis-mask")}
              >
                <KV k="Tipo" v="N95 ou máscara com filtro para pós químicos" colors={colors} />
                <KV k="Quando usar" v="Durante operações de descascamento e poeira" colors={colors} />
                <KV k="Durabilidade" v="Substitua quando desgastar ou após 40 horas" colors={colors} />
                <KV k="Ajuste" v="Deve cobrir nariz e boca completamente" colors={colors} />
              </Card>

              <Card
                title="👷 Capacete"
                subtitle="Proteção da cabeça"
                icon="hardhat"
                colors={colors}
                open={expanded === "epis-helmet"}
                onPress={() => toggle("epis-helmet")}
              >
                <KV k="Obrigatório" v="Sim, em todas as áreas de operação" colors={colors} />
                <KV k="Cor" v="Amarelo ou cor corporativa Bayer" colors={colors} />
                <KV k="Verificação" v="Revise trincas antes de usar" colors={colors} />
                <KV k="Higiene" v="Limpe a banda interna regularmente" colors={colors} />
              </Card>

              <Card
                title="⚠️ Checklist Diário"
                subtitle="Antes de começar o trabalho"
                icon="checklist"
                colors={colors}
                open={expanded === "epis-checklist"}
                onPress={() => toggle("epis-checklist")}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 13, lineHeight: 20 }}>
                  ☑️ Uniforme limpo e sem danos{"\n"}
                  ☑️ Luvas em bom estado{"\n"}
                  ☑️ Sapatos de segurança presos{"\n"}
                  ☑️ Óculos sem riscos{"\n"}
                  ☑️ Máscara (se aplicável){"\n"}
                  ☑️ Capacete bem ajustado{"\n"}
                  ☑️ Todos os EPIs acessíveis{"\n"}
                  ☑️ Certificado de treinamento em dia
                </Text>
              </Card>
            </>
          )}

          {/* SEGURANÇA */}
          {tab === "seguranca" && (
            <>
              <Card
                title="Regras de Segurança do Site"
                subtitle="Protocolo Bayer - Conformidade obrigatória"
                icon="warning"
                colors={colors}
                open={expanded === "seg-intro"}
                onPress={() => toggle("seg-intro")}
              >
                <Text style={{ color: colors.textPrimary, marginBottom: 8 }}>
                  Estas regras protegem VOCÊ e sua equipe. Cumpra rigorosamente:
                </Text>
              </Card>

              {safetyRules.map((rule) => (
                <Card
                  key={rule.id}
                  title={rule.title}
                  subtitle=""
                  icon={rule.icon}
                  colors={colors}
                  open={expanded === `seg-${rule.id}`}
                  onPress={() => toggle(`seg-${rule.id}`)}
                >
                  <Text style={{ color: colors.textPrimary }}>
                    {rule.description}
                  </Text>
                </Card>
              ))}

              <Card
                title="🚨 Procedimento em Caso de Acidente"
                subtitle="Aja rápido e com calma"
                icon="alert-circle"
                colors={colors}
                open={expanded === "seg-emergency"}
                onPress={() => toggle("seg-emergency")}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 13, lineHeight: 20 }}>
                  1️⃣ PARE imediatamente sua atividade{"\n"}
                  2️⃣ Avise um supervisor/responsável{"\n"}
                  3️⃣ Dirija-se à sala de primeiros socorros{"\n"}
                  4️⃣ Reporte o incidente no formulário{"\n"}
                  5️⃣ Só retorne após avaliação{"\n\n"}
                  <Text style={{ color: colors.primary, fontWeight: "600" }}>
                    Emergência: Ligue para segurança do site
                  </Text>
                </Text>
              </Card>

              <Card
                title="💧 Exposição a Químicos"
                subtitle="O que fazer"
                icon="water"
                colors={colors}
                open={expanded === "seg-chemical"}
                onPress={() => toggle("seg-chemical")}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 13, lineHeight: 20 }}>
                  <Text style={{ fontWeight: "600" }}>Contato com a pele:</Text>
                  {"\n"}Lave imediatamente com água corrente por 15 minutos{"\n\n"}
                  <Text style={{ fontWeight: "600" }}>Contato com os olhos:</Text>
                  {"\n"}Lave com água por 15 minutos. Procure médico.{"\n\n"}
                  <Text style={{ fontWeight: "600" }}>Inalação:</Text>
                  {"\n"}Saia da área, respire ar fresco. Se sentir mal, procure médico.
                </Text>
              </Card>

              <Card
                title="📋 Notas Importantes"
                subtitle="Conformidade Bayer"
                icon="document"
                colors={colors}
                open={expanded === "seg-notes"}
                onPress={() => toggle("seg-notes")}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 12, lineHeight: 18 }}>
                  • Não coma, beba ou fume enquanto manuseia químicos{"\n\n"}
                  • Lave as mãos antes de qualquer refeição{"\n\n"}
                  • Não leve uniforme de trabalho para casa{"\n\n"}
                  • Comunique danos/riscos imediatamente{"\n\n"}
                  • Armazene produtos conforme indicado{"\n\n"}
                  • Respeite as datas de validade
                </Text>
              </Card>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ---------- COMPONENTS ---------- */

function Card({ title, subtitle, icon, colors, open, onPress, children }: any) {
  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <TouchableOpacity style={styles.cardHeader} onPress={onPress}>
        <Ionicons name={icon} size={18} color={colors.primary} />

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {subtitle}
            </Text>
          )}
        </View>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textTertiary}
        />
      </TouchableOpacity>

      {open && <View style={styles.cardBody}>{children}</View>}
    </View>
  );
}

function KV({ k, v, colors }: any) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ color: colors.textTertiary, fontSize: 11 }}>{k}</Text>
      <Text style={{ color: colors.textPrimary }}>{v}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    padding: 16,
    borderBottomWidth: 1,
  },

  title: { fontSize: 20, fontWeight: "800" },
  subtitle: { fontSize: 12 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 16,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },

  searchInput: { flex: 1 },

  tabsRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },

  tab: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },

  card: {
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },

  cardBody: {
    padding: 12,
    borderTopWidth: 1,
  },
});
