import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/theme';

type Rotation = 'A' | 'B' | 'C' | 'D' | 'E' | 'ESP';
type Status = 'ativo' | 'ferias' | 'administrativo' | 'afastado';

interface Worker {
  id: string;
  name: string;
  rotation: Rotation;
  status: Status;
}

interface Section {
  id: string;
  name: string;
  product?: string;
  obs?: string;
  workers: Worker[];
}

const ROTATION_CFG: Record<Rotation, { color: string; label: string }> = {
  A:   { color: '#ef4444', label: 'A' },
  B:   { color: '#f97316', label: 'B' },
  C:   { color: '#f59e0b', label: 'C' },
  D:   { color: '#8b5cf6', label: 'D' },
  E:   { color: '#3b82f6', label: 'E' },
  ESP: { color: '#22c55e', label: 'ESP' },
};

const STATUS_CFG: Record<Status, { color: string; label: string; short: string }> = {
  ativo:          { color: '#10b981', label: 'Ativo',       short: 'AT' },
  ferias:         { color: '#ef4444', label: 'Férias',      short: 'FE' },
  administrativo: { color: '#8b5cf6', label: 'Adm',         short: 'AD' },
  afastado:       { color: '#64748b', label: 'Afastado',    short: 'AF' },
};

const PRODUCT_COLORS: Record<string, string> = {
  Verango: '#f59e0b',
  Belt:    '#3b82f6',
  Nativo:  '#22c55e',
};

const SECTIONS: Section[] = [
  {
    id: 'sc1', name: 'SC I', product: 'Verango',
    workers: [
      { id: 's1-1', name: 'Anderson Dias',    rotation: 'A',   status: 'ativo' },
      { id: 's1-2', name: 'Luiz Lino',        rotation: 'A',   status: 'ativo' },
      { id: 's1-3', name: 'Marcos Viana',     rotation: 'B',   status: 'ativo' },
      { id: 's1-4', name: 'Eduardo S.',        rotation: 'C',   status: 'ativo' },
      { id: 's1-5', name: 'Cristiano M.',     rotation: 'C',   status: 'ativo' },
      { id: 's1-6', name: 'Mickey Ferreira',  rotation: 'C',   status: 'ativo' },
      { id: 's1-7', name: 'Rafael Neto',      rotation: 'D',   status: 'ativo' },
      { id: 's1-8', name: 'Andre Bandez',     rotation: 'E',   status: 'ativo' },
      { id: 's1-9', name: 'Klebson Almeida',  rotation: 'E',   status: 'ativo' },
      { id: 's1-10', name: 'Cristiano',       rotation: 'ESP', status: 'ativo' },
      { id: 's1-11', name: 'Leandro M.',      rotation: 'ESP', status: 'ativo' },
      { id: 's1-12', name: 'Kiebson',         rotation: 'ESP', status: 'ativo' },
    ],
  },
  {
    id: 'sc2', name: 'SC II', product: 'Belt',
    workers: [
      { id: 's2-1', name: 'Luciano Quedes',   rotation: 'A',   status: 'ativo' },
      { id: 's2-2', name: 'Weder Chaves',     rotation: 'A',   status: 'ativo' },
      { id: 's2-3', name: 'Paulo Henrique',   rotation: 'B',   status: 'ativo' },
      { id: 's2-4', name: 'Alex Souza',       rotation: 'C',   status: 'ativo' },
      { id: 's2-5', name: 'Moasir P.',        rotation: 'C',   status: 'ativo' },
      { id: 's2-6', name: 'Regia M.',         rotation: 'C',   status: 'ativo' },
      { id: 's2-7', name: 'Carlos Rocha',     rotation: 'D',   status: 'ativo' },
      { id: 's2-8', name: 'Mario B.',         rotation: 'E',   status: 'ativo' },
      { id: 's2-9', name: 'Antonio Borges',   rotation: 'E',   status: 'ativo' },
      { id: 's2-10', name: 'Oberlando Costa', rotation: 'E',   status: 'ativo' },
      { id: 's2-11', name: 'Luiz Alberto',    rotation: 'ESP', status: 'ativo' },
      { id: 's2-12', name: 'Andre Fernandes', rotation: 'ESP', status: 'ferias' },
    ],
  },
  {
    id: 'sc3', name: 'SC III', product: 'Nativo',
    workers: [
      { id: 's3-1', name: 'Vinicius F.',      rotation: 'A',   status: 'ativo' },
      { id: 's3-2', name: 'Carlos Cosme',     rotation: 'A',   status: 'ativo' },
      { id: 's3-3', name: 'Luis Felipe',      rotation: 'A',   status: 'ativo' },
      { id: 's3-4', name: 'Jorge Lima',       rotation: 'B',   status: 'ativo' },
      { id: 's3-5', name: 'Renato Freitas',   rotation: 'C',   status: 'ativo' },
      { id: 's3-6', name: 'Paulo Ribeiro',    rotation: 'C',   status: 'ativo' },
      { id: 's3-7', name: 'Sergio Matos',     rotation: 'D',   status: 'ativo' },
      { id: 's3-8', name: 'Daniel Pimenta',   rotation: 'E',   status: 'ativo' },
      { id: 's3-9', name: 'Antonio Chales',   rotation: 'E',   status: 'ativo' },
      { id: 's3-10', name: 'Flavio F.',       rotation: 'E',   status: 'ativo' },
    ],
  },
  {
    id: 'sc4', name: 'SC IV',
    workers: [
      { id: 's4-1', name: 'Jonailton M.',     rotation: 'A',   status: 'ativo' },
      { id: 's4-2', name: 'William Ribeiro',  rotation: 'C',   status: 'ativo' },
      { id: 's4-3', name: 'Antonio Marinho',  rotation: 'C',   status: 'ativo' },
      { id: 's4-4', name: 'Felipe Costa',     rotation: 'D',   status: 'ativo' },
    ],
  },
  {
    id: 'sc5', name: 'SC V',
    workers: [
      { id: 's5-1', name: 'Eduardo Amaral',   rotation: 'A',   status: 'ativo' },
      { id: 's5-2', name: 'Felipe Segui',     rotation: 'A',   status: 'ativo' },
      { id: 's5-3', name: 'Flavio Erba',      rotation: 'A',   status: 'ativo' },
      { id: 's5-4', name: 'Bruno Alves',      rotation: 'B',   status: 'ativo' },
      { id: 's5-5', name: 'Aureliano R.',     rotation: 'C',   status: 'ativo' },
      { id: 's5-6', name: 'Carlos M.',        rotation: 'C',   status: 'ativo' },
      { id: 's5-7', name: 'Anderson L.',      rotation: 'C',   status: 'ativo' },
      { id: 's5-8', name: 'Diego Santos',     rotation: 'D',   status: 'ativo' },
      { id: 's5-9', name: 'Blazio Texeira',   rotation: 'E',   status: 'ativo' },
      { id: 's5-10', name: 'Nilton Cesar',    rotation: 'E',   status: 'ativo' },
      { id: 's5-11', name: 'Jorran Venzel',   rotation: 'E',   status: 'ativo' },
      { id: 's5-12', name: 'Odirlur Caldes',  rotation: 'E',   status: 'administrativo' },
    ],
  },
  {
    id: 'sc6', name: 'SC VI',
    workers: [
      { id: 's6-1', name: 'Sergio Juvenal',   rotation: 'C',   status: 'ativo' },
      { id: 's6-2', name: 'Luciano N.',       rotation: 'C',   status: 'ativo' },
      { id: 's6-3', name: 'Sergio F.',        rotation: 'E',   status: 'ativo' },
      { id: 's6-4', name: 'Tiago Barros',     rotation: 'B',   status: 'ativo' },
    ],
  },
  {
    id: 'sc7', name: 'SC VII', product: 'Verango', obs: 'HA',
    workers: [
      { id: 's7-1', name: 'Alessandro A.',    rotation: 'A',   status: 'ativo' },
      { id: 's7-2', name: 'Mario Pereira',    rotation: 'A',   status: 'ativo' },
      { id: 's7-3', name: 'Fabio Pareira',    rotation: 'A',   status: 'ativo' },
      { id: 's7-4', name: 'Roberto Lima',     rotation: 'B',   status: 'ativo' },
      { id: 's7-5', name: 'Joao G.',          rotation: 'C',   status: 'ativo' },
      { id: 's7-6', name: 'Daniel A.',        rotation: 'C',   status: 'ativo' },
      { id: 's7-7', name: 'Marcos Dutra',     rotation: 'D',   status: 'ativo' },
      { id: 's7-8', name: 'Ampuri Junior',    rotation: 'E',   status: 'ativo' },
      { id: 's7-9', name: 'Mario Duarte',     rotation: 'E',   status: 'ativo' },
      { id: 's7-10', name: 'Alexandre Rios',  rotation: 'E',   status: 'ativo' },
      { id: 's7-11', name: 'Washington M.',   rotation: 'E',   status: 'ativo' },
    ],
  },
  {
    id: 'cefito', name: 'C.E FITO',
    workers: [
      { id: 'cf-1', name: 'Operador A',       rotation: 'A',   status: 'ativo' },
      { id: 'cf-2', name: 'Operador B',       rotation: 'B',   status: 'ativo' },
    ],
  },
  {
    id: 'herb', name: 'Herbicidas',
    workers: [
      { id: 'hb-1', name: 'Operador C',       rotation: 'C',   status: 'ativo' },
      { id: 'hb-2', name: 'Operador D',       rotation: 'D',   status: 'ativo' },
    ],
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function WorkerAvatar({ worker }: { worker: Worker }) {
  const rot = ROTATION_CFG[worker.rotation];
  const st = STATUS_CFG[worker.status];
  return (
    <View style={styles.avatarWrap}>
      <View style={[styles.avatarCircle, { borderColor: rot.color }]}>
        <Text style={[styles.avatarInitials, { color: rot.color }]}>
          {getInitials(worker.name)}
        </Text>
        {worker.status !== 'ativo' && (
          <View style={[styles.statusDot, { backgroundColor: st.color }]} />
        )}
      </View>
      <Text style={styles.avatarName} numberOfLines={1}>
        {worker.name.split(' ')[0]}
      </Text>
    </View>
  );
}

function SectionCard({ section, expanded, onToggle }: {
  section: Section;
  expanded: boolean;
  onToggle: () => void;
}) {
  const rotations: Rotation[] = ['A', 'B', 'C', 'D', 'E', 'ESP'];
  const prodColor = section.product ? (PRODUCT_COLORS[section.product] ?? '#64748b') : '#1e293b';
  const totalWorkers = section.workers.length;

  if (totalWorkers === 0) {
    return (
      <View style={[styles.card, { opacity: 0.5 }]}>
        <View style={[styles.cardStripe, { backgroundColor: '#1e293b' }]} />
        <View style={styles.cardEmptyRow}>
          <Text style={styles.cardTitle}>{section.name}</Text>
          <Text style={styles.cardEmpty}>Sem alocação</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={[styles.cardStripe, { backgroundColor: prodColor }]} />
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle}>{section.name}</Text>
            {section.product && (
              <View style={[styles.productBadge, { backgroundColor: prodColor + '22' }]}>
                <Text style={[styles.productBadgeText, { color: prodColor }]}>{section.product}</Text>
              </View>
            )}
            {section.obs && (
              <View style={styles.obsBadge}>
                <Text style={styles.obsBadgeText}>{section.obs}</Text>
              </View>
            )}
          </View>
          <View style={styles.cardHeaderRight}>
            <View style={styles.countBadge}>
              <Ionicons name="people-outline" size={12} color="#64748b" />
              <Text style={styles.countText}>{totalWorkers}</Text>
            </View>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#475569"
            />
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.cardBody}>
            {rotations.map(rot => {
              const workers = section.workers.filter(w => w.rotation === rot);
              if (workers.length === 0) return null;
              const cfg = ROTATION_CFG[rot];
              return (
                <View key={rot} style={styles.rotRow}>
                  <View style={[styles.rotBadge, { backgroundColor: cfg.color }]}>
                    <Text style={styles.rotLabel}>{cfg.label}</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.workerRow}
                  >
                    {workers.map(w => <WorkerAvatar key={w.id} worker={w} />)}
                  </ScrollView>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

type TabKey = 'quadro' | 'ausencias' | 'legenda';

export default function TurnoScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('quadro');
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map(s => [s.id, true]))
  );

  const allWorkers = SECTIONS.flatMap(s => s.workers);
  const totalWorkers = allWorkers.length;
  const totalAtivos = allWorkers.filter(w => w.status === 'ativo').length;
  const totalFerias = allWorkers.filter(w => w.status === 'ferias').length;
  const totalAdm = allWorkers.filter(w => w.status === 'administrativo').length;
  const ausencias = allWorkers.filter(w => w.status !== 'ativo');

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short',
  });

  const toggleSection = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const TABS: { key: TabKey; label: string; icon: string }[] = [
    { key: 'quadro',    label: 'Quadro',    icon: 'people' },
    { key: 'ausencias', label: 'Ausências', icon: 'calendar-clear' },
    { key: 'legenda',   label: 'Legenda',   icon: 'information-circle' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B1620' }} edges={['top']}>

      {/* Gradient Header */}
      <LinearGradient
        colors={['#1A3A25', '#0B1620']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Formulação</Text>
            <View style={styles.headerBadge}>
              <View style={styles.headerBadgeDot} />
              <Text style={styles.headerBadgeText}>GESTÃO DE TURNO</Text>
            </View>
          </View>
          <View style={styles.dateBubble}>
            <Ionicons name="time-outline" size={16} color="#94a3b8" />
            <Text style={styles.dateText}>{today}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total',  value: totalWorkers, color: '#89D329' },
            { label: 'Ativos', value: totalAtivos,  color: '#10b981' },
            { label: 'Férias', value: totalFerias,  color: '#ef4444' },
            { label: 'Adm',    value: totalAdm,     color: '#8b5cf6' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statBar, { backgroundColor: s.color }]} />
              <Text style={styles.statLbl}>{s.label}</Text>
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Segmented Control */}
      <View style={[styles.segmentWrap, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          const hasBadge = tab.key === 'ausencias' && ausencias.length > 0;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.segmentBtn, active && styles.segmentBtnActive]}
              activeOpacity={0.7}
            >
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name={(active ? tab.icon : tab.icon + '-outline') as any}
                  size={18}
                  color={active ? '#89D329' : colors.textTertiary}
                />
                {hasBadge && (
                  <View style={styles.badgeDot}>
                    <Text style={styles.badgeDotText}>{ausencias.length}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.segmentLabel, { color: active ? '#89D329' : colors.textTertiary }]}>
                {tab.label}
              </Text>
              {active && <View style={styles.segmentUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 14, paddingBottom: 32, gap: 10 }}
        style={{ backgroundColor: colors.background }}
      >
        {activeTab === 'quadro' && SECTIONS.map(section => (
          <SectionCard
            key={section.id}
            section={section}
            expanded={!!expanded[section.id]}
            onToggle={() => toggleSection(section.id)}
          />
        ))}

        {activeTab === 'ausencias' && (
          <>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
              Registros de Ausência
            </Text>
            {ausencias.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="checkmark-circle-outline" size={40} color="#10b981" />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Nenhuma ausência</Text>
                <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                  Todos os colaboradores estão ativos hoje.
                </Text>
              </View>
            ) : (
              ausencias.map(worker => {
                const section = SECTIONS.find(s => s.workers.includes(worker));
                const st = STATUS_CFG[worker.status];
                const rot = ROTATION_CFG[worker.rotation];
                return (
                  <View
                    key={worker.id}
                    style={[styles.ausenciaRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <View style={[styles.ausenciaAvatar, { borderColor: rot.color }]}>
                      <Text style={[styles.ausenciaInitials, { color: rot.color }]}>
                        {getInitials(worker.name)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.ausenciaName, { color: colors.textPrimary }]}>{worker.name}</Text>
                      <Text style={[styles.ausenciaSub, { color: colors.textTertiary }]}>
                        {section?.name} · Letra {worker.rotation}
                      </Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: st.color + '22', borderColor: st.color + '44' }]}>
                      <Text style={[styles.statusPillText, { color: st.color }]}>{st.label}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {activeTab === 'legenda' && (
          <>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Rotações</Text>
            <View style={[styles.legendCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {Object.entries(ROTATION_CFG).map(([key, cfg]) => (
                <View key={key} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: cfg.color }]}>
                    <Text style={styles.legendDotText}>{cfg.label}</Text>
                  </View>
                  <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>
                    {key === 'ESP' ? 'Especialistas' : `Letra ${cfg.label}`}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Status</Text>
            <View style={[styles.legendCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <View key={key} style={styles.legendRow}>
                  <View style={[styles.legendSmallDot, { backgroundColor: cfg.color }]} />
                  <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{cfg.label}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Produtos</Text>
            <View style={[styles.legendCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {Object.entries(PRODUCT_COLORS).map(([name, color]) => (
                <View key={name} style={styles.legendRow}>
                  <View style={[styles.legendStripe, { backgroundColor: color }]} />
                  <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{name}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  headerBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5, backgroundColor: '#89D32915', borderWidth: 1, borderColor: '#89D32930', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  headerBadgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#89D329' },
  headerBadgeText: { fontSize: 10, fontWeight: '800', color: '#89D329', letterSpacing: 1 },
  dateBubble: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#13212C', borderWidth: 1, borderColor: '#1e293b', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  dateText: { fontSize: 11, color: '#94a3b8', fontWeight: '600', textTransform: 'capitalize' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: '#13212C', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden' },
  statBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: 1 },
  statLbl: { fontSize: 9, color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginTop: 4 },
  statNum: { fontSize: 22, fontWeight: '800', marginTop: 2 },

  segmentWrap: { flexDirection: 'row', borderBottomWidth: 1 },
  segmentBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 3, position: 'relative' },
  segmentBtnActive: {},
  segmentLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  segmentUnderline: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2.5, backgroundColor: '#89D329', borderRadius: 2 },
  badgeDot: { position: 'absolute', top: -4, right: -6, backgroundColor: '#ef4444', borderRadius: 8, minWidth: 14, height: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  badgeDotText: { fontSize: 8, color: '#fff', fontWeight: '800' },

  card: { flexDirection: 'row', backgroundColor: '#13212C', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  cardStripe: { width: 4 },
  cardEmptyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, flex: 1 },
  cardEmpty: { fontSize: 12, color: '#475569' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'wrap' },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#e2e8f0', letterSpacing: -0.3 },
  productBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  productBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  obsBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: '#ef444420' },
  obsBadgeText: { fontSize: 10, fontWeight: '800', color: '#ef4444', letterSpacing: 0.3 },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1e293b', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  countText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  cardBody: { paddingHorizontal: 14, paddingBottom: 14, gap: 12 },
  rotRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rotBadge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 8, flexShrink: 0 },
  rotLabel: { fontSize: 10, fontWeight: '800', color: '#fff' },
  workerRow: { gap: 10, paddingVertical: 4 },

  avatarWrap: { alignItems: 'center', gap: 4, width: 46 },
  avatarCircle: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, backgroundColor: '#1C2D3D', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarInitials: { fontSize: 11, fontWeight: '800' },
  statusDot: { position: 'absolute', bottom: -2, right: -2, width: 11, height: 11, borderRadius: 6, borderWidth: 1.5, borderColor: '#13212C' },
  avatarName: { fontSize: 9, color: '#94a3b8', textAlign: 'center', width: 46 },

  sectionHeading: { fontSize: 15, fontWeight: '800', marginBottom: 4, marginTop: 4 },
  emptyBox: { borderRadius: 16, padding: 32, alignItems: 'center', gap: 8, borderWidth: 1 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptyDesc: { fontSize: 12, textAlign: 'center' },

  ausenciaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  ausenciaAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, backgroundColor: '#1C2D3D', alignItems: 'center', justifyContent: 'center' },
  ausenciaInitials: { fontSize: 12, fontWeight: '800' },
  ausenciaName: { fontSize: 13, fontWeight: '700' },
  ausenciaSub: { fontSize: 11, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  statusPillText: { fontSize: 11, fontWeight: '700' },

  legendCard: { borderRadius: 14, padding: 16, gap: 12, borderWidth: 1, marginBottom: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  legendDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  legendDotText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  legendSmallDot: { width: 10, height: 10, borderRadius: 5 },
  legendStripe: { width: 4, height: 22, borderRadius: 2 },
  legendLabel: { fontSize: 13 },
});
