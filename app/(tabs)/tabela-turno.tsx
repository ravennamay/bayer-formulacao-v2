import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';

const { width } = Dimensions.get('window');

// Dados simulados para tabela de turnos
const TURNO_DATA = [
  { date: '23.05.26', day: 'Sab', A: 14, B: 6, C: 'F', D: 22, E: 'F' },
  { date: '24.05.26', day: 'Dom', A: 14, B: 6, C: 'F', D: 22, E: 'F' },
  { date: '25.05.26', day: 'Seg', A: 22, B: 14, C: 'F', D: 'F', E: 6 },
  { date: '26.05.26', day: 'Ter', A: 22, B: 14, C: 'F', D: 'F', E: 6 },
  { date: '27.05.26', day: 'Qua', A: 'F', B: 22, C: 6, D: 'F', E: 14 },
  { date: '28.05.26', day: 'Qui', A: 'F', B: 22, C: 6, D: 'F', E: 14 },
  { date: '29.05.26', day: 'Sex', A: 'F', B: 'F', C: 14, D: 6, E: 22 },
  { date: '30.05.26', day: 'Sab', A: 'F', B: 'F', C: 14, D: 6, E: 22 },
  { date: '31.05.26', day: 'Dom', A: 6, B: 'F', C: 22, D: 14, E: 'F' },
  { date: '01.06.26', day: 'Seg', A: 6, B: 'F', C: 22, D: 14, E: 'F' },
  { date: '02.06.26', day: 'Ter', A: 14, B: 6, C: 'F', D: 22, E: 'F' },
  { date: '03.06.26', day: 'Qua', A: 14, B: 6, C: 'F', D: 22, E: 'F' },
  { date: '04.06.26', day: 'Qui', A: 22, B: 14, C: 'F', D: 'F', E: 6 },
  { date: '05.06.26', day: 'Sex', A: 22, B: 14, C: 'F', D: 'F', E: 6 },
  { date: '06.06.26', day: 'Sab', A: 'F', B: 22, C: 6, D: 'F', E: 14 },
];

const TURNOS = ['A', 'B', 'C', 'D', 'E'];
const TURNO_COLORS: Record<string, string> = {
  A: '#00BCFF',
  B: '#89D329',
  C: '#F59E0B',
  D: '#8B5CF6',
  E: '#10B981',
};

export default function TabelaTurnoScreen() {
  const { colors, isDark } = useTheme();
  const [selectedTurno, setSelectedTurno] = useState('C');

  // Verificar status de folga
  const isOnLeaveToday = (TURNO_DATA[0] as any)[selectedTurno] === 'F';
  const nextWorkDayOffset = TURNO_DATA.findIndex(
    (row, idx) => idx > 0 && (row as any)[selectedTurno] !== 'F'
  );
  const nextWorkDay = nextWorkDayOffset > 0 ? TURNO_DATA[nextWorkDayOffset].day : null;

  const getValueColor = (turno: string, value: any) => {
    if (turno === selectedTurno && value !== 'F') {
      return TURNO_COLORS[turno];
    }
    if (value === 'F') {
      return colors.textTertiary;
    }
    return colors.textSecondary;
  };

  const mySchedule = useMemo(() => {
    return TURNO_DATA.map((row) => ({
      ...row,
      myValue: (row as any)[selectedTurno],
    }));
  }, [selectedTurno]);

  return (
    <SafeAreaView style={[S.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* HEADER */}
      <View
        style={[
          S.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[S.headerTitle, { color: colors.textPrimary }]}>Tabela de Turnos</Text>
        <Text style={[S.headerSubtitle, { color: colors.textSecondary }]}>
          Escala 6x4 · Bayer Belford Roxo
        </Text>
      </View>

      {/* SELETOR DE TURNO */}
      <View
        style={[
          S.turnoSelector,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[S.selectorLabel, { color: colors.textSecondary }]}>MEU TURNO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.turnoChips}>
          {TURNOS.map((turno) => {
            const isSelected = selectedTurno === turno;
            return (
              <TouchableOpacity
                key={turno}
                onPress={() => setSelectedTurno(turno)}
                style={[
                  S.turnoChip,
                  {
                    backgroundColor: isSelected ? TURNO_COLORS[turno] : colors.surfaceElevated,
                    borderColor: isSelected ? TURNO_COLORS[turno] : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    S.turnoChipText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {turno}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* STATUS CARD */}
      {isOnLeaveToday && (
        <View
          style={[
            S.statusCard,
            {
              backgroundColor: TURNO_COLORS[selectedTurno] + '15',
              borderColor: TURNO_COLORS[selectedTurno],
            },
          ]}
        >
          <View style={S.statusHeader}>
            <View
              style={[
                S.statusBadge,
                { backgroundColor: TURNO_COLORS[selectedTurno] },
              ]}
            >
              <Text style={S.statusBadgeText}>TURNO {selectedTurno}</Text>
            </View>
            <View
              style={[
                S.leaveIcon,
                { borderColor: TURNO_COLORS[selectedTurno] },
              ]}
            >
              <Ionicons name="bed-outline" size={20} color={TURNO_COLORS[selectedTurno]} />
              <Text style={[S.leaveLabel, { color: TURNO_COLORS[selectedTurno] }]}>F</Text>
            </View>
          </View>
          <Text style={[S.statusTitle, { color: colors.textPrimary }]}>
            Você está em Folga
          </Text>
          {nextWorkDay && (
            <Text style={[S.statusSubtitle, { color: colors.textSecondary }]}>
              Volta ao trabalho {nextWorkDay}
            </Text>
          )}
        </View>
      )}

      {/* TABELA */}
      <ScrollView style={S.tableScroll} showsVerticalScrollIndicator={false}>
        <View style={[S.table, { borderColor: colors.border }]}>
          {/* HEADER DA TABELA */}
          <View style={[S.tableRow, S.tableHeader]}>
            <View style={[S.tableCell, S.dateCell]}>
              <Text style={[S.headerText, { color: colors.textPrimary }]}>DATA</Text>
            </View>
            <View style={[S.tableCell, S.dayCell]}>
              <Text style={[S.headerText, { color: colors.textPrimary }]}>DIA</Text>
            </View>
            {TURNOS.map((turno) => (
              <View key={turno} style={S.tableCell}>
                <Text
                  style={[
                    S.headerText,
                    {
                      color: selectedTurno === turno ? TURNO_COLORS[turno] : colors.textSecondary,
                      fontWeight: selectedTurno === turno ? '700' : '600',
                    },
                  ]}
                >
                  {turno}
                </Text>
              </View>
            ))}
          </View>

          {/* LINHAS DA TABELA */}
          {mySchedule.map((row, idx) => (
            <View
              key={row.date}
              style={[
                S.tableRow,
                {
                  backgroundColor: idx % 2 === 0 ? colors.surface : colors.surfaceElevated,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              {/* DATA */}
              <View style={[S.tableCell, S.dateCell]}>
                <Text style={[S.cellText, { color: colors.textPrimary, fontWeight: '700' }]}>
                  {row.date}
                </Text>
              </View>

              {/* DIA */}
              <View style={[S.tableCell, S.dayCell]}>
                <Text
                  style={[
                    S.cellText,
                    {
                      color:
                        row.day === 'Sab' || row.day === 'Dom' ? colors.danger : colors.textSecondary,
                      fontWeight: row.day === 'Sab' || row.day === 'Dom' ? '700' : '500',
                    },
                  ]}
                >
                  {row.day}
                </Text>
              </View>

              {/* TURNOS */}
              {TURNOS.map((turno) => {
                const value = (row as any)[turno];
                const isMy = turno === selectedTurno;
                return (
                  <View key={turno} style={S.tableCell}>
                    <View
                      style={[
                        S.valueBox,
                        {
                          backgroundColor: isMy && value !== 'F' ? TURNO_COLORS[turno] : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          S.valueText,
                          {
                            color: isMy && value !== 'F' ? '#FFFFFF' : getValueColor(turno, value),
                            fontWeight: isMy && value !== 'F' ? '700' : '600',
                            fontSize: isMy && value !== 'F' ? 14 : 12,
                          },
                        ]}
                      >
                        {value === 'F' ? 'F' : value}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* LEGENDA */}
      <View
        style={[
          S.legend,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={S.legendItem}>
          <View
            style={[
              S.legendDot,
              {
                backgroundColor: TURNO_COLORS[selectedTurno],
              },
            ]}
          />
          <Text style={[S.legendText, { color: colors.textSecondary }]}>
            Seu turno ({selectedTurno})
          </Text>
        </View>
        <View style={S.legendItem}>
          <View
            style={[
              S.legendDot,
              {
                backgroundColor: colors.textTertiary,
              },
            ]}
          />
          <Text style={[S.legendText, { color: colors.textSecondary }]}>Folga (F)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  turnoSelector: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  turnoChips: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  turnoChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  turnoChipText: {
    fontSize: 14,
  },
  statusCard: {
    marginHorizontal: 12,
    marginVertical: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  leaveIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaveLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
  },
  tableScroll: {
    flex: 1,
  },
  table: {
    marginHorizontal: 8,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tableHeader: {
    borderBottomWidth: 2,
  },
  tableCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  dateCell: {
    flex: 1.2,
  },
  dayCell: {
    flex: 0.8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 12,
    textAlign: 'center',
  },
  valueBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
});
