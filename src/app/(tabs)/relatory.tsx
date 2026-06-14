import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useAuth } from "../../contexts/auth";

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const CATEGORY_COLORS = [
  "#5CD338", "#00BCD4", "#FF9800", "#E91E63",
  "#9C27B0", "#FF5722", "#2196F3", "#FFEB3B",
  "#00E676", "#F06292",
];

type MonthData = {
  expense: number;
  income: number;
};

type DonutCategory = {
  id: string;
  name: string;
  value: number;
  color: string;
  pct: number;
};

type Tooltip = {
  month: string;
  expense: number;
  income: number;
  x: number;
};

function formatBRL(value: number) {
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
}

function DonutChart({
  categories,
  totalSpent,
}: {
  categories: DonutCategory[];
  totalSpent: number;
}) {
  const size = 190;
  const stroke = 30;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  if (categories.length === 0) {
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

  let accumulatedDegrees = -90;

  return (
    <View style={donutStyles.wrapper}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} stroke="#2A2A2A" strokeWidth={stroke} fill="none" />
        {categories.map((cat, i) => {
          const dash = circumference * (cat.pct / 100);
          const gap = circumference - dash;
          const rotation = accumulatedDegrees;
          accumulatedDegrees += (cat.pct / 100) * 360;
          return (
            <Circle
              key={i}
              cx={center} cy={center} r={radius}
              stroke={cat.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${dash} ${gap}`}
              transform={`rotate(${rotation}, ${center}, ${center})`}
            />
          );
        })}
      </Svg>
      <View style={donutStyles.centerLabel}>
        <Text style={donutStyles.centerVal}>{formatBRL(totalSpent)}</Text>
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

function BarChart({ monthlyData }: { monthlyData: MonthData[] }) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [chartWidth, setChartWidth] = useState(0);

  const maxValue = Math.max(
    ...monthlyData.flatMap((d) => [d.expense, d.income]),
    1,
  );

  const barWidth = chartWidth > 0 ? chartWidth / MONTHS.length / 2 - 1.5 : 0;
  const groupWidth = barWidth * 2 + 1.5;
  const gap = chartWidth > 0 ? (chartWidth - groupWidth * 12) / 11 : 0;
  const BALLOON_WIDTH = 130;

  return (
    <View
      onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      style={{ position: "relative" }}
    >
      {tooltip && chartWidth > 0 && (() => {
        const rawLeft = tooltip.x - BALLOON_WIDTH / 2;
        const clampedLeft = Math.min(Math.max(rawLeft, 0), chartWidth - BALLOON_WIDTH);
        return (
          <View style={[barStyles.balloon, { left: clampedLeft, width: BALLOON_WIDTH }]}>
            <Text style={barStyles.balloonMonth}>{tooltip.month}</Text>
            <View style={barStyles.balloonRow}>
              <View style={[barStyles.balloonDot, { backgroundColor: "#5CD338" }]} />
              <Text style={barStyles.balloonText}>Receita: {formatBRL(tooltip.income)}</Text>
            </View>
            <View style={barStyles.balloonRow}>
              <View style={[barStyles.balloonDot, { backgroundColor: "#E53935" }]} />
              <Text style={barStyles.balloonText}>Despesa: {formatBRL(tooltip.expense)}</Text>
            </View>
            <View style={barStyles.balloonArrow} />
          </View>
        );
      })()}

      <View style={barStyles.container}>
        {chartWidth > 0 && (
          <View style={barStyles.barsRow}>
            {monthlyData.map((data, i) => {
              const expenseHeight = (data.expense / maxValue) * 75;
              const incomeHeight = (data.income / maxValue) * 75;
              const isSelected = tooltip?.month === MONTHS[i];
              const xCenter = i * (groupWidth + gap) + groupWidth / 2;

              return (
                <TouchableOpacity
                  key={i}
                  style={[barStyles.group, { width: groupWidth }]}
                  onLongPress={() =>
                    setTooltip({
                      month: MONTHS[i],
                      expense: data.expense,
                      income: data.income,
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
                        height: expenseHeight || 2,
                        backgroundColor: isSelected ? "#FF6B6B" : "#E53935",
                        width: barWidth,
                      },
                    ]}
                  />
                  <View
                    style={[
                      barStyles.bar,
                      {
                        height: incomeHeight || 2,
                        backgroundColor: isSelected ? "#8EF55A" : "#5CD338",
                        width: barWidth,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={barStyles.labelsRow}>
          {MONTHS.map((m) => (
            <Text
              key={m}
              style={[
                barStyles.monthLabel,
                tooltip?.month === m && { color: "#FFF", fontWeight: "600" },
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
  monthLabel: { color: "#444", fontSize: 8, textAlign: "center", flex: 1 },

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
  balloonMonth: { color: "#FFF", fontSize: 11, fontWeight: "700", marginBottom: 5 },
  balloonRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
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

export default function RelatoryScreen() {
  const { user } = useAuth();

  const [monthlyData, setMonthlyData] = useState<MonthData[]>(
    Array.from({ length: 12 }, () => ({ expense: 0, income: 0 })),
  );
  const [categories, setCategories] = useState<DonutCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`http://localhost:8080/income/user/${user.id}`),
        fetch(`http://localhost:8080/expense/user/${user.id}`),
      ]);

      const incomes: any[] = incomeRes.ok ? await incomeRes.json() : [];
      const expenses: any[] = expenseRes.ok ? await expenseRes.json() : [];

      const data: MonthData[] = Array.from({ length: 12 }, () => ({
        expense: 0,
        income: 0,
      }));

      incomes.forEach((item) => {
        const month = new Date(item.date).getMonth();
        data[month].income += Number(item.amount) || 0;
      });

      expenses.forEach((item) => {
        const month = new Date(item.date).getMonth();
        data[month].expense += Number(item.amount) || 0;
      });

      setMonthlyData(data);

      const tI = data.reduce((sum, d) => sum + d.income, 0);
      const tE = data.reduce((sum, d) => sum + d.expense, 0);
      setTotalIncome(tI);
      setTotalExpense(tE);

      const catRes = await fetch(`http://localhost:8080/category/user/${user.id}`);
      const catData: any[] = catRes.ok ? await catRes.json() : [];

      const categoriesWithValues = await Promise.all(
        catData.map(async (item: any, i: number) => {
          let totalSpent = 0;
          try {
            const expByCatRes = await fetch(
              `http://localhost:8080/expense/user/${user.id}/category/${item.categoryid}`,
            );
            if (expByCatRes.ok) {
              const expByCat: any[] = await expByCatRes.json();
              totalSpent = expByCat.reduce((acc, e) => acc + Number(e.amount), 0);
            }
          } catch {}
          return {
            id: String(item.categoryid),
            name: item.categoryname,
            value: totalSpent,
            color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
            pct: 0,
          };
        }),
      );

      const totalCategories = categoriesWithValues.reduce((sum, c) => sum + c.value, 0) || 1;
      const finalCategories: DonutCategory[] = categoriesWithValues
        .filter((c) => c.value > 0)
        .map((c) => ({
          ...c,
          pct: Math.round((c.value / totalCategories) * 100),
        }));

      setCategories(finalCategories);
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

  const currentMonth = MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Relatórios</Text>
          <TouchableOpacity style={styles.bell}>
            <MaterialIcons name="notifications-none" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.period}>{currentMonth} {currentYear}</Text>

        {loading ? (
          <ActivityIndicator color="#5CD338" size="large" style={{ marginTop: 80 }} />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>MENSAL POR CATEGORIA</Text>
              <View style={styles.donutRow}>
                <DonutChart categories={categories} totalSpent={totalExpense} />
              </View>
              {categories.length > 0 ? (
                <View style={styles.catGrid}>
                  {categories.map((cat, i) => (
                    <View key={i} style={styles.catItem}>
                      <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                      <Text style={styles.catName} numberOfLines={1}>{cat.name}</Text>
                      <Text style={styles.catPct}>{cat.pct}%</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>Nenhuma categoria com despesas</Text>
              )}
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.sumCard}>
                <Text style={styles.sumLabel}>RECEITA</Text>
                <Text style={[styles.sumVal, { color: "#5CD338" }]}>{formatBRL(totalIncome)}</Text>
              </View>
              <View style={styles.sumCard}>
                <Text style={styles.sumLabel}>DESPESA</Text>
                <Text style={[styles.sumVal, { color: "#E53935" }]}>{formatBRL(totalExpense)}</Text>
              </View>
            </View>

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
              <BarChart monthlyData={monthlyData} />
            </View>

            <TouchableOpacity
              style={styles.btnHistory}
              onPress={() => router.push("/details")}
              activeOpacity={0.85}
            >
              <Text style={styles.btnHistoryText}>Ver Histórico</Text>
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
  period: { color: "#555", fontSize: 12, marginBottom: 20 },

  card: { backgroundColor: "#1A1A1A", borderRadius: 20, padding: 16, marginBottom: 14 },
  cardTitle: { color: "#555", fontSize: 10, letterSpacing: 1, marginBottom: 14 },

  donutRow: { alignItems: "center", marginBottom: 16 },

  catGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: 8, columnGap: 8 },
  catItem: { flexDirection: "row", alignItems: "center", gap: 6, width: "47%" },
  catDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  catName: { color: "#AAA", fontSize: 11, flex: 1 },
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

  btnHistory: {
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
  btnHistoryText: { color: "#0A0A0A", fontSize: 15, fontWeight: "700" },
});