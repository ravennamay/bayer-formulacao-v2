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
  func: string; // FIX: renamed
  application: string;
  notes: string;
};

type Chemistry = {
  name: string;
  alias: string;
  className: string; // FIX: renamed
  func: string;       // FIX
  applications: string;
  safety: string;
};

type Procedure = { title: string; icon: any; content: string };

type Tab = "produtos" | "quimica" | "procedimentos";

export default function GuiaScreen() {
  const { colors } = useTheme();

  const [tab, setTab] = useState<Tab>("produtos");
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [chemistry, setChemistry] = useState<Chemistry[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

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
    { key: "procedimentos", label: "Procedimentos", icon: "shield-outline" },
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
                size={14}
                color={active ? "#000" : colors.textSecondary}
              />
              <Text style={{ color: active ? "#000" : colors.textSecondary }}>
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
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },

  tab: {
    flex: 1,
    minWidth: 90,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 999,
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
