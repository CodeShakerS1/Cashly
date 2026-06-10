import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/auth";
import { themas } from "../../theme/themes";
const ICON_OPTIONS = [
  "restaurant",
  "directions-bus",
  "medical-services",
  "home",
  "shopping-bag",
  "school",
  "sports-esports",
  "flight",
  "trending-up",
  "payments",
  "card-giftcard",
  "pets",
  "fitness-center",
  "tv",
  "wifi",
  "smartphone",
  "directions-car",
  "local-gas-station",
  "local-pharmacy",
  "checkroom",
  "content-cut",
  "family-restroom",
  "work",
  "credit-card",
  "pix",
  "attach-money",
  "receipt-long",
  "bolt",
  "water-drop",
  "shopping-cart",
  "delivery-dining",
  "movie",
  "music-note",
  "pedal-bike",
  "two-wheeler",
  "account-balance",
  "request-quote",
  "security",
  "coffee",
  "celebration",
  "hotel",
  "computer",
  "laptop",
  "phone-iphone",
  "flag",
  "savings",
  "volunteer-activism",
  "live-tv",
  "menu-book",
  "build",
  "handyman",
  "warning",
];

export default function CategoryDetailsScreen() {
  const { user } = useAuth();
  const { categoryId, categoryName, categoryIcon, categoryLimit, refresh } =
    useLocalSearchParams();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState(String(categoryName || ""));
  const [editIcon, setEditIcon] = useState(
    String(categoryIcon || "restaurant"),
  );
  const [editLimit, setEditLimit] = useState(String(categoryLimit || "0"));
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editExpenseName, setEditExpenseName] = useState("");
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseMethod, setEditExpenseMethod] = useState(
    selectedTransaction?.method ?? "",
  );
  const [deleting, setDeleting] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);
  const [categoryData, setCategoryData] = useState({
    id: String(categoryId),
    title: String(categoryName || "Categoria"),
    icon: String(categoryIcon || "restaurant"),
    limitAmount: Number(categoryLimit || 0),
  });
  useEffect(() => {
    setCategoryData({
      id: String(categoryId),
      title: String(categoryName || "Categoria"),
      icon: String(categoryIcon || "restaurant"),
      limitAmount: Number(categoryLimit || 0),
    });
    setEditName(String(categoryName || ""));
    setEditIcon(String(categoryIcon || "restaurant"));
    setEditLimit(String(categoryLimit || "0"));
  }, [categoryId, categoryName, categoryIcon, categoryLimit]);
  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/expense/user/${user?.id}/category/${categoryData.id}`,
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar despesas");
      }

      const data = await response.json();

      const formattedExpenses = data.map((item: any) => ({
        id: String(item.id),
        title: item.name,
        type: item.method,
        value: `R$ ${Number(item.amount).toFixed(2).replace(".", ",")}`,
        date: item.date,
        userId: item.userId,
        categoryId: item.categoryId,
        amount: item.amount,
      }));

      setTransactions(formattedExpenses);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    } finally {
      setLoading(false);
    }
  };
  const openEditModal = () => {
    setEditName(categoryData.title);
    setEditIcon(categoryData.icon);
    setEditLimit(String(categoryData.limitAmount));

    setModalVisible(true);
  };

  const updateCategory = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:8080/category/${categoryData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryid: Number(categoryData.id),
            categoryname: editName,
            icon: editIcon,
            limitAmount: Number(editLimit),
            userId: Number(user?.id),
          }),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      setCategoryData((prev) => ({
        ...prev,
        title: editName,
        icon: editIcon,
        limitAmount: Number(editLimit),
      }));

      Alert.alert("Sucesso", "Categoria atualizada com sucesso!");

      setModalVisible(false);

      fetchExpenses();
    } catch (error) {
      console.error(error);

      Alert.alert("Erro", "Falha ao atualizar categoria.");
    } finally {
      setSaving(false);
    }
  };
  const openActionModal = (item: any) => {
    setSelectedTransaction(item);
    setActionModalVisible(true);
  };

  const openEditExpenseModal = () => {
    setActionModalVisible(false);
    setEditExpenseName(selectedTransaction.title);
    const raw = selectedTransaction.value
      .replace("R$", "")
      .replace(".", "")
      .replace(",", ".")
      .trim();
    setEditExpenseAmount(raw);
    setEditExpenseMethod(selectedTransaction.type);
    setEditModalVisible(true);
  };

  const deleteExpense = async () => {
    try {
      setDeleting(true);
      const response = await fetch(
        `http://localhost:8080/expense/${selectedTransaction.id}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error();
      setActionModalVisible(false);
      fetchExpenses();
      Alert.alert("Sucesso", "Despesa excluída com sucesso!");
    } catch {
      Alert.alert("Erro", "Falha ao excluir despesa.");
    } finally {
      setDeleting(false);
    }
  };

  const updateExpense = async () => {
    try {
      setSavingExpense(true);
      const response = await fetch(
        `http://localhost:8080/expense/${selectedTransaction.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editExpenseName,
            amount: Number(editExpenseAmount),
            method: editExpenseMethod,
            date: selectedTransaction.date,
            userId: selectedTransaction.userId,
            categoryId: selectedTransaction.categoryId,
          }),
        },
      );
      if (!response.ok) throw new Error();
      setEditModalVisible(false);
      fetchExpenses();
      Alert.alert("Sucesso", "Despesa atualizada com sucesso!");
    } catch {
      Alert.alert("Erro", "Falha ao atualizar despesa.");
    } finally {
      setSavingExpense(false);
    }
  };

  useEffect(() => {
    if (user?.id && categoryData.id) {
      fetchExpenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, categoryData.id, refresh]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id && categoryData.id && categoryData.id !== "undefined") {
        fetchExpenses();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, categoryData.id]),
  );

  const totalSpent = transactions.reduce((sum, item) => {
    const value = Number(
      item.value.replace("R$", "").replace(".", "").replace(",", ".").trim(),
    );

    return sum + value;
  }, 0);

  const progress =
    categoryData.limitAmount > 0
      ? Math.min((totalSpent / categoryData.limitAmount) * 100, 100)
      : 0;

  const formattedTotal = `R$ ${totalSpent.toFixed(2).replace(".", ",")}`;

  const formattedLimit = `R$ ${categoryData.limitAmount
    .toFixed(2)
    .replace(".", ",")}`;

  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionCard}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={categoryData.icon as any}
            size={20}
            color={themas.colors.primary}
          />

          <Text style={styles.date}>{item.date}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.transactionTitle}>{item.title}</Text>

          <Text style={styles.transactionType}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.transactionValue}>{item.value}</Text>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => openActionModal(item)}
        >
          <MaterialIcons
            name="more-horiz"
            size={18}
            color={themas.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { flex: 1 }]}>
        <Text
          style={{
            color: "#FFF",
            textAlign: "center",
            marginTop: 50,
          }}
        >
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <MaterialIcons
                    name={categoryData.icon as any}
                    size={28}
                    color="#FFF"
                  />
                </View>

                <Text style={styles.headerTitle}>Detalhes da Categoria</Text>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={openEditModal}
              >
                <MaterialIcons name="edit" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.categoryName}>{categoryData.title}</Text>

              <Text style={styles.categoryValue}>{formattedTotal}</Text>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` as any },
                  ]}
                />
              </View>

              <Text style={styles.limitText}>Limite : {formattedLimit}</Text>
            </View>
          </>
        }
        renderItem={renderTransaction}
        ListEmptyComponent={
          <Text
            style={{
              color: "#999",
              textAlign: "center",
              marginTop: 30,
            }}
          >
            Nenhuma despesa encontrada.
          </Text>
        }
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Editar Categoria</Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Nome da categoria"
              placeholderTextColor="#666"
              style={styles.input}
            />

            <Text style={styles.iconLabel}>Escolha um ícone</Text>

            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setEditIcon(icon)}
                  style={[
                    styles.iconOption,
                    editIcon === icon && styles.iconOptionSelected,
                  ]}
                >
                  <MaterialIcons
                    name={icon as any}
                    size={24}
                    color={editIcon === icon ? "#000" : themas.colors.primary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={editLimit}
              onChangeText={setEditLimit}
              keyboardType="numeric"
              placeholder="Limite"
              placeholderTextColor="#666"
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={updateCategory}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {actionModalVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end",
            zIndex: 999,
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{selectedTransaction?.title}</Text>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={openEditExpenseModal}
            >
              <Text style={styles.saveButtonText}>Editar despesa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "#c0392b" }]}
              onPress={deleteExpense}
              disabled={deleting}
            >
              <Text style={styles.saveButtonText}>
                {deleting ? "Excluindo..." : "Excluir despesa"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setActionModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {editModalVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end",
            zIndex: 999,
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Editar Despesa</Text>

            <TextInput
              value={editExpenseName}
              onChangeText={setEditExpenseName}
              placeholder="Nome da despesa"
              placeholderTextColor="#666"
              style={styles.input}
            />

            <TextInput
              value={editExpenseAmount}
              onChangeText={setEditExpenseAmount}
              placeholder="Valor"
              placeholderTextColor="#666"
              keyboardType="numeric"
              style={styles.input}
            />
            {(() => {
              const opcoes = [
                { label: "PIX", valor: "Pix", icone: "grid-view" },
                { label: "Débito", valor: "Debit", icone: "credit-card" },
                { label: "Crédito", valor: "Credit", icone: "credit-card" },
                { label: "Dinheiro", valor: "Cash", icone: "paid" },
              ];
              return (
                <>
                  <Text style={[styles.iconLabel, { marginBottom: 8 }]}>
                    Método de pagamento
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    {opcoes.map((op) => {
                      const selected = editExpenseMethod === op.valor;
                      return (
                        <TouchableOpacity
                          key={op.valor}
                          onPress={() => setEditExpenseMethod(op.valor)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            paddingVertical: 10,
                            paddingHorizontal: 14,
                            borderRadius: 8,
                            borderWidth: selected ? 2 : 1,
                            borderColor: selected ? "#4A90E2" : "#444",
                            backgroundColor: selected
                              ? "#1a2e4a"
                              : "transparent",
                            width: "47%",
                          }}
                        >
                          <MaterialIcons
                            name={op.icone as any}
                            size={18}
                            color={selected ? "#4A90E2" : "#888"}
                          />
                          <Text
                            style={{
                              color: selected ? "#4A90E2" : "#888",
                              fontWeight: selected ? "600" : "400",
                            }}
                          >
                            {op.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              );
            })()}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={updateExpense}
              disabled={savingExpense}
            >
              <Text style={styles.saveButtonText}>
                {savingExpense ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  listContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: themas.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "500",
  },

  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: themas.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  infoContainer: {
    marginBottom: 28,
  },

  categoryName: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "700",
  },

  categoryValue: {
    color: themas.colors.primary,
    fontSize: 38,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 18,
  },

  progressBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#1E1E1E",
    borderRadius: 99,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressFill: {
    height: 8,
    backgroundColor: themas.colors.primary,
    borderRadius: 99,
  },

  limitText: {
    color: "#8A8A8A",
    fontSize: 12,
  },

  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    position: "relative",
  },

  date: {
    position: "absolute",
    bottom: -16,
    fontSize: 9,
    color: "#8A8A8A",
  },

  textContainer: {
    flex: 1,
  },

  transactionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },

  transactionType: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },

  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  transactionValue: {
    color: themas.colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },

  moreButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#0D0D0D",
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  modalHandle: {
    width: 60,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#333",
    alignSelf: "center",
    marginBottom: 24,
  },

  modalTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#222",
    color: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 14,
  },

  saveButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: themas.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  saveButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },

  cancelButton: {
    marginTop: 16,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#888",
    fontSize: 15,
  },
  iconLabel: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
    maxHeight: 220,
  },

  iconOption: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },

  iconOptionSelected: {
    backgroundColor: themas.colors.primary,
  },
});