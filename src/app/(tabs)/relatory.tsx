import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useAuth } from "../../contexts/auth";

const { width } = Dimensions.get("window");

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const CORES_CATEGORIAS = [
  "#5CD338", "#00BCD4", "#FF9800", "#E91E63",
  "#9C27B0", "#FF5722", "#2196F3", "#FFEB3B",
  "#00E676", "#F06292",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type DadoMes = {
  despesa: number;
  receita: number;
};

type CategoriaDonut = {
  id: string;
  nome: string;
  valor: number;
  cor: string;
  pct: number;
};

type Tooltip = {
  mes: string;
  despesa: number;
  receita: number;
  x: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBRL(val: number) {
  if (val >= 1000) return `R$ ${(val / 1000).toFixed(1)}k`;
  return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
}

// ─── DonutChart ───────────────────────────────────────────────────────────────

function DonutChart({
  categorias,
  totalGasto,
}: {
  categorias: CategoriaDonut[];
  totalGasto: number;
}) {
  const size = 190;
  const stroke = 30;
  const radius = (size - stroke) / 2;
  const circunferencia = 2 * Math.PI * radius;
  const center = size / 2;

  if (categorias.length === 0) {
    return (
      <View style={donutStyles.wrapper}>
        <Svg width={size} height={size}>
          <Circle cx={center} cy={center} r={radius} stroke="#2A2A2A" strokeWidth={stroke} fill="none" />
        </Svg>
        <View style={donutStyles.centerLabel}>
          <Text style={donutStyles.centerVal}>R$ 0</Text>
          <Text style={donutStyles.centerSub}>total gasto</Text>
        </View>
      </View>
    );
  }

  let acumuladoGraus = -90;

  return (
    <View style={donutStyles.wrapper}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} stroke="#2A2A2A" strokeWidth={stroke} fill="none" />
        {categorias.map((cat, i) => {
          const dash = circunferencia * (cat.pct / 100);
          const gap = circunferencia - dash;
          const rotacao = acumuladoGraus;
          acumuladoGraus += (cat.pct / 100) * 360;
          return (
            <Circle
              key={i}
              cx={center} cy={center} r={radius}
              stroke={cat.cor}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${dash} ${gap}`}
              transform={`rotate(${rotacao}, ${center}, ${center})`}
            />
          );
        })}
      </Svg>
      <View style={donutStyles.centerLabel}>
        <Text style={donutStyles.centerVal}>{formatBRL(totalGasto)}</Text>
        <Text style={donutStyles.centerSub}>total gasto</Text>
      </View>
    </View>
  );
}

const donutStyles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", width: 190, height: 190 },
  centerLabel: { position: "absolute", alignItems: "center", justifyContent: "center" },
  centerVal: { color: "#FFF", fontSize: 17, fontWeight: "bold" },
  centerSub: { color: "#666", fontSize: 10, marginTop: 2 },
});

// ─── BarChart ─────────────────────────────────────────────────────────────────

function BarChart({ dadosMensais }: { dadosMensais: DadoMes[] }) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const maxValor = Math.max(
    ...dadosMensais.flatMap((d) => [d.despesa, d.receita]),
    1,
  );


  const chartWidth = width - 64;
  const barWidth = chartWidth / MESES.length / 2 - 2;
  const groupWidth = barWidth * 2 + 2;
  const gap = (chartWidth - groupWidth * 12) / 11;

  const BALLOON_WIDTH = 130;

  return (
    <View style={{ position: "relative" }}>

      {/* Balão flutuante */}
      {tooltip && (() => {
        const rawLeft = tooltip.x - BALLOON_WIDTH / 2;
        const clampedLeft = Math.min(Math.max(rawLeft, 0), chartWidth - BALLOON_WIDTH);
        return (
          <View style={[barStyles.balloon, { left: clampedLeft, width: BALLOON_WIDTH }]}>
            <Text style={barStyles.balloonMes}>{tooltip.mes}</Text>
            <View style={barStyles.balloonRow}>
              <View style={[barStyles.balloonDot, { backgroundColor: "#5CD338" }]} />
              <Text style={barStyles.balloonText}>
                Receita: {formatBRL(tooltip.receita)}
              </Text>
            </View>
            <View style={barStyles.balloonRow}>
              <View style={[barStyles.balloonDot, { backgroundColor: "#E53935" }]} />
              <Text style={barStyles.balloonText}>
                Despesa: {formatBRL(tooltip.despesa)}
              </Text>
            </View>
            {/* Setinha */}
            <View style={barStyles.balloonArrow} />
          </View>
        );
      })()}

      <View style={barStyles.container}>
        <View style={barStyles.barsRow}>
          {dadosMensais.map((dado, i) => {
            const hDespesa = (dado.despesa / maxValor) * 75;
            const hReceita = (dado.receita / maxValor) * 75;
            const isSelected = tooltip?.mes === MESES[i];
            // posição X do centro do grupo em relação ao container
            const xCenter = i * (groupWidth + gap) + groupWidth / 2;

            return (
              <TouchableOpacity
                key={i}
                style={[barStyles.group, { width: groupWidth }]}
                onLongPress={() =>
                  setTooltip({
                    mes: MESES[i],
                    despesa: dado.despesa,
                    receita: dado.receita,
                    x: xCenter,
                  })
                }
                onPressOut={() => setTooltip(null)}
                delayLongPress={150}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    barStyles.bar,
                    {
                      height: hDespesa || 2,
                      backgroundColor: isSelected ? "#FF6B6B" : "#E53935",
                      width: barWidth,
                    },
                  ]}
                />
                <View
                  style={[
                    barStyles.bar,
                    {
                      height: hReceita || 2,
                      backgroundColor: isSelected ? "#8EF55A" : "#5CD338",
                      width: barWidth,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={barStyles.labelsRow}>
          {MESES.map((m) => (
            <Text
              key={m}
              style={[
                barStyles.mesLabel,
                tooltip?.mes === m && { color: "#FFF", fontWeight: "600" },
              ]}
            >
              {m}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 0, marginTop: 4 },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 85,
    justifyContent: "space-between",
  },
  group: { flexDirection: "row", alignItems: "flex-end", gap: 0.5 },
  bar: { borderRadius: 2 },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  mesLabel: { color: "#444", fontSize: 8, textAlign: "center", flex: 1 },

  // Balão
  balloon: {
    position: "absolute",
    top: -88,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 10,
  },
  balloonMes: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 5,
  },
  balloonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  balloonDot: { width: 7, height: 7, borderRadius: 4 },
  balloonText: { color: "#CCC", fontSize: 11 },
  balloonArrow: {
    position: "absolute",
    bottom: -7,
    alignSelf: "center",
    left: "50%",
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#333",
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RelatoryScreen() {
  const { user } = useAuth();

  const [dadosMensais, setDadosMensais] = useState<DadoMes[]>(
    Array.from({ length: 12 }, () => ({ despesa: 0, receita: 0 })),
  );
  const [categorias, setCategorias] = useState<CategoriaDonut[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReceita, setTotalReceita] = useState(0);
  const [totalDespesa, setTotalDespesa] = useState(0);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      // 1. Busca receitas e despesas em paralelo
      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`http://localhost:8080/income/user/${user.id}`),
        fetch(`http://localhost:8080/expense/user/${user.id}`),
      ]);

      const incomes: any[] = incomeRes.ok ? await incomeRes.json() : [];
      const expenses: any[] = expenseRes.ok ? await expenseRes.json() : [];

      // 2. Monta dados mensais
      const dados: DadoMes[] = Array.from({ length: 12 }, () => ({
        despesa: 0,
        receita: 0,
      }));

      incomes.forEach((item) => {
        const mes = new Date(item.date).getMonth();
        dados[mes].receita += Number(item.amount) || 0;
      });

      expenses.forEach((item) => {
        const mes = new Date(item.date).getMonth();
        dados[mes].despesa += Number(item.amount) || 0;
      });

      setDadosMensais(dados);

      const tR = dados.reduce((s, d) => s + d.receita, 0);
      const tD = dados.reduce((s, d) => s + d.despesa, 0);
      setTotalReceita(tR);
      setTotalDespesa(tD);

      // 3. Busca categorias do usuário
      const catRes = await fetch(`http://localhost:8080/category/user/${user.id}`);
      const catData: any[] = catRes.ok ? await catRes.json() : [];

      // 4. Para cada categoria, busca total gasto
      const catComValores = await Promise.all(
        catData.map(async (item: any, i: number) => {
          let totalGasto = 0;
          try {
            const expCatRes = await fetch(
              `http://localhost:8080/expense/user/${user.id}/category/${item.categoryid}`,
            );
            if (expCatRes.ok) {
              const expCat: any[] = await expCatRes.json();
              totalGasto = expCat.reduce((acc, e) => acc + Number(e.amount), 0);
            }
          } catch {
            // sem despesas nessa categoria
          }
          return {
            id: String(item.categoryid),
            nome: item.categoryname,
            valor: totalGasto,
            cor: CORES_CATEGORIAS[i % CORES_CATEGORIAS.length],
            pct: 0,
          };
        }),
      );

      // 5. Calcula percentuais e filtra vazios
      const totalCats = catComValores.reduce((s, c) => s + c.valor, 0) || 1;
      const catsFinal: CategoriaDonut[] = catComValores
        .filter((c) => c.valor > 0)
        .map((c) => ({
          ...c,
          pct: Math.round((c.valor / totalCats) * 100),
        }));

      setCategorias(catsFinal);
    } catch (e) {
      console.error("Erro ao buscar dados do relatório:", e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const mesAtual = MESES[new Date().getMonth()];
  const anoAtual = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatórios</Text>
          <TouchableOpacity style={styles.bell}>
            <MaterialIcons name="notifications-none" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.periodo}>{mesAtual} {anoAtual}</Text>

        {loading ? (
          <ActivityIndicator color="#5CD338" size="large" style={{ marginTop: 80 }} />
        ) : (
          <>
            {/* Card Donut */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>MENSAL POR CATEGORIA</Text>
              <View style={styles.donutRow}>
                <DonutChart categorias={categorias} totalGasto={totalDespesa} />
              </View>
              {categorias.length > 0 ? (
                <View style={styles.catGrid}>
                  {categorias.map((cat, i) => (
                    <View key={i} style={styles.catItem}>
                      <View style={[styles.catDot, { backgroundColor: cat.cor }]} />
                      <Text style={styles.catNome} numberOfLines={1}>{cat.nome}</Text>
                      <Text style={styles.catPct}>{cat.pct}%</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>Nenhuma categoria com despesas</Text>
              )}
            </View>

            {/* Cards resumo */}
            <View style={styles.summaryRow}>
              <View style={styles.sumCard}>
                <Text style={styles.sumLabel}>RECEITA</Text>
                <Text style={[styles.sumVal, { color: "#5CD338" }]}>{formatBRL(totalReceita)}</Text>
              </View>
              <View style={styles.sumCard}>
                <Text style={styles.sumLabel}>DESPESA</Text>
                <Text style={[styles.sumVal, { color: "#E53935" }]}>{formatBRL(totalDespesa)}</Text>
              </View>
            </View>

            {/* Card Barras */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>RECEITAS VS. DESPESAS</Text>
              <View style={styles.barLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#E53935" }]} />
                  <Text style={styles.legendText}>Despesa</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#5CD338" }]} />
                  <Text style={styles.legendText}>Receita</Text>
                </View>
              </View>
              <BarChart dadosMensais={dadosMensais} />
            </View>

            {/* Botão Histórico */}
            <TouchableOpacity
              style={styles.btnHistorico}
              onPress={() => router.push("/details")}
              activeOpacity={0.85}
            >
              <Text style={styles.btnHistoricoText}>Ver Histórico</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#0A0A0A" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  scroll: { paddingTop: 56, paddingBottom: 40, paddingHorizontal: 16 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  title: { color: "#FFF", fontSize: 22, fontWeight: "700" },
  bell: { backgroundColor: "#1C1C1C", padding: 10, borderRadius: 50 },
  periodo: { color: "#555", fontSize: 12, marginBottom: 20 },

  card: { backgroundColor: "#1A1A1A", borderRadius: 20, padding: 16, marginBottom: 14 },
  cardTitle: { color: "#555", fontSize: 10, letterSpacing: 1, marginBottom: 14 },

  donutRow: { alignItems: "center", marginBottom: 16 },

  catGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: 8, columnGap: 8 },
  catItem: { flexDirection: "row", alignItems: "center", gap: 6, width: "47%" },
  catDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  catNome: { color: "#AAA", fontSize: 11, flex: 1 },
  catPct: { color: "#FFF", fontSize: 11, fontWeight: "600" },
  emptyText: { color: "#555", fontSize: 12, textAlign: "center", paddingVertical: 8 },

  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  sumCard: { flex: 1, backgroundColor: "#1A1A1A", borderRadius: 16, padding: 14 },
  sumLabel: { color: "#555", fontSize: 10, letterSpacing: 0.5, marginBottom: 6 },
  sumVal: { fontSize: 18, fontWeight: "700" },

  barLegend: { flexDirection: "row", gap: 16, marginBottom: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendText: { color: "#AAA", fontSize: 11 },

  btnHistorico: {
    backgroundColor: "#5CD338",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  btnHistoricoText: { color: "#0A0A0A", fontSize: 15, fontWeight: "700" },
});