import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useAuth } from "../../contexts/auth";
import { themas } from "../../theme/themes";

const ICON_OPTIONS = [
  { label: "Alimentação", icon: "restaurant" },
  { label: "Transporte", icon: "directions-bus" },
  { label: "Saúde", icon: "medical-services" },
  { label: "Moradia", icon: "home" },
  { label: "Compras", icon: "shopping-bag" },
  { label: "Educação", icon: "school" },
  { label: "Lazer", icon: "sports-esports" },
  { label: "Viagem", icon: "flight" },
  { label: "Investimentos", icon: "trending-up" },
  { label: "Salário", icon: "payments" },
  { label: "Presente", icon: "card-giftcard" },
  { label: "Pets", icon: "pets" },
  { label: "Academia", icon: "fitness-center" },
  { label: "Streaming", icon: "tv" },
  { label: "Internet", icon: "wifi" },
  { label: "Telefone", icon: "smartphone" },
  { label: "Carro", icon: "directions-car" },
  { label: "Combustível", icon: "local-gas-station" },
  { label: "Farmácia", icon: "local-pharmacy" },
  { label: "Roupas", icon: "checkroom" },
  { label: "Beleza", icon: "content-cut" },
  { label: "Família", icon: "family-restroom" },
  { label: "Trabalho", icon: "work" },
  { label: "Cartão", icon: "credit-card" },
  { label: "Pix", icon: "pix" },
  { label: "Dinheiro", icon: "attach-money" },
  { label: "Boleto", icon: "receipt-long" },
  { label: "Conta de Luz", icon: "bolt" },
  { label: "Água", icon: "water-drop" },
  { label: "Mercado", icon: "shopping-cart" },
  { label: "Delivery", icon: "delivery-dining" },
  { label: "Cinema", icon: "movie" },
  { label: "Música", icon: "music-note" },
  { label: "Jogos", icon: "sports-esports" },
  { label: "Bicicleta", icon: "pedal-bike" },
  { label: "Moto", icon: "two-wheeler" },
  { label: "Banco", icon: "account-balance" },
  { label: "Impostos", icon: "request-quote" },
  { label: "Segurança", icon: "security" },
  { label: "Café", icon: "coffee" },
  { label: "Eventos", icon: "celebration" },
  { label: "Hotel", icon: "hotel" },
  { label: "Tecnologia", icon: "computer" },
  { label: "Notebook", icon: "laptop" },
  { label: "Celular", icon: "phone-iphone" },
  { label: "Meta", icon: "flag" },
  { label: "Economia", icon: "savings" },
  { label: "Doações", icon: "volunteer-activism" },
  { label: "Filmes e Séries", icon: "live-tv" },
  { label: "Livros", icon: "menu-book" },
  { label: "Ferramentas", icon: "build" },
  { label: "Manutenção", icon: "handyman" },
  { label: "Emergência", icon: "warning" },
];

export default function CategoriesScreen() {
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [limit, setLimit] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("restaurant");
  const [categories, setCategories] = useState<any[]>([]);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLimit = (text: string) => {
    setLimit(text.replace(/[^0-9]/g, ""));
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/category/user/${user?.id}`,
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar categorias");
      }

      const data = await response.json();

      const formattedCategories = await Promise.all(
        data.map(async (item: any) => {
          let totalGasto = 0;

          try {
            const expenseResponse = await fetch(
              `http://localhost:8080/expense/user/${user?.id}/category/${item.categoryid}`,
            );

            if (expenseResponse.ok) {
              const expenses = await expenseResponse.json();
              totalGasto = expenses.reduce(
                (acc: number, expense: any) => acc + Number(expense.amount),
                0,
              );
            }
          } catch {
            console.error(
              `Erro ao buscar despesas para categoria ${item.categoryname}`,
            );
          }

          const limite = Number(item.limitAmount);
          const porcentagem = limite > 0 ? (totalGasto / limite) * 100 : 0;
          const progressoClamped = Math.min(porcentagem, 100).toFixed(0);

          return {
            id: String(item.categoryid),
            title: item.categoryname,
            value: `R$ ${totalGasto.toFixed(2).replace(".", ",")}`,
            limitAmount: limite,
            limit: `R$ ${limite.toFixed(2).replace(".", ",")}`,
            icon: item.icon,
            progress: `${progressoClamped}%`,
          };
        }),
      );

      setCategories(formattedCategories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]),
  );

  const handleCreateCategory = async () => {
    if (!categoryName.trim() || !limit.trim() || !selectedIcon) {
      Alert.alert("Atenção", "Preencha todas as informações.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryname: categoryName.trim(),
          icon: selectedIcon,
          limitAmount: Number(limit),
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const mensagemErro = await response.text();
        throw new Error(mensagemErro || "Erro ao criar categoria");
      }

      setCategoryName("");
      setLimit("");
      setSelectedIcon("restaurant");
      setDropdownKey((prev) => prev + 1);
      setModalVisible(false);
      await fetchCategories();

      Alert.alert("Sucesso", "Categoria criada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar categoria:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível criar a categoria.",
      );
    }
  };

  const handleIconChange = (item: any) => {
    setSelectedIcon(item.icon);
    setDropdownKey((prev) => prev + 1);
  };
  const renderCategoryCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: {
            categoryId: String(item.id),
            categoryName: item.title,
            categoryIcon: item.icon,
            categoryLimit: item.limit
              .replace("R$", "")
              .replace(".", "")
              .replace(",", ".")
              .trim(),
          },
        })
      }
    >
      <View style={styles.cardTop}>
        <View style={styles.leftContent}>
          <View style={styles.iconBox}>
            <MaterialIcons
              name={item.icon as any}
              size={20}
              color={themas.colors.platinium}
            />
          </View>

          <Text style={styles.categoryName}>{item.title}</Text>
        </View>

        <View style={styles.rightContent}>
          <Text style={styles.categoryValue}>{item.value}</Text>

          <Text style={styles.categoryLimit}>Limite : {item.limit}</Text>
        </View>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBar, { width: item.progress as any }]} />
      </View>
    </TouchableOpacity>
  );

  const renderIconItem = (item: any) => (
    <View style={styles.dropdownRenderItem}>
      <View style={styles.dropdownIconBox}>
        <MaterialIcons
          name={item.icon as any}
          size={18}
          color={themas.colors.primary}
        />
      </View>

      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity style={styles.notificationButton}>
                <MaterialIcons
                  name="notifications"
                  size={24}
                  color={themas.colors.platinium}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Categorias</Text>
          </>
        }
        renderItem={renderCategoryCard}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Adicionar Categoria</Text>
          </TouchableOpacity>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.modalTitleRow}>
                <Text style={styles.modalWhite}>Nova </Text>

                <Text style={styles.modalGreen}>Categoria</Text>
              </View>

              <View style={{ width: 24 }} />
            </View>

            <Text style={styles.subTitle}>Nome da Categoria</Text>

            <TextInput
              style={[
                styles.input,
                focusedInput === "name" && styles.inputFocused,
              ]}
              placeholder="Adicionar nome"
              placeholderTextColor="#777"
              value={categoryName}
              onChangeText={setCategoryName}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
            />

            <Text style={styles.subTitle}>Limite</Text>

            <TextInput
              style={[
                styles.input,
                focusedInput === "limit" && styles.inputFocused,
              ]}
              placeholder="Digite o limite"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={limit}
              onChangeText={handleLimit}
              maxLength={12}
              onFocus={() => setFocusedInput("limit")}
              onBlur={() => setFocusedInput(null)}
            />

            <Text style={styles.subTitle}>Ícone</Text>

            <Dropdown
              key={dropdownKey}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              itemContainerStyle={styles.dropdownItemContainer}
              activeColor="#1A1A1A"
              backgroundColor="transparent"
              data={ICON_OPTIONS}
              labelField="label"
              valueField="icon"
              value={selectedIcon}
              onChange={handleIconChange}
              renderLeftIcon={() => (
                <View style={styles.selectedIconBox}>
                  <MaterialIcons
                    name={selectedIcon as any}
                    size={20}
                    color={themas.colors.primary}
                  />
                </View>
              )}
              renderRightIcon={() => (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={22}
                  color={themas.colors.primary}
                />
              )}
              renderItem={renderIconItem}
              selectedTextStyle={styles.dropdownText}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCreateCategory}
            >
              <Text style={styles.modalButtonText}>Adicionar Categoria</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.colors.bgScreen,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  greeting: {
    color: themas.colors.platinium,
    fontSize: 28,
    fontWeight: "300",
    flex: 1,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: themas.colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: themas.colors.primary,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rightContent: {
    alignItems: "flex-end",
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: themas.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  categoryName: {
    color: themas.colors.platinium,
    fontSize: 16,
    fontWeight: "500",
    flexShrink: 1,
  },

  categoryValue: {
    color: themas.colors.platinium,
    fontSize: 16,
    fontWeight: "bold",
  },

  categoryLimit: {
    color: "#8A8A8A",
    fontSize: 11,
    marginTop: 2,
  },

  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#222",
    borderRadius: 20,
    marginTop: 14,
    overflow: "hidden",
  },

  progressBar: {
    height: 6,
    backgroundColor: themas.colors.primary,
    borderRadius: 20,
  },

  addButton: {
    backgroundColor: themas.colors.primary,
    height: 55,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  addButtonText: {
    color: themas.colors.platinium,
    fontSize: 16,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: "#000",
    borderRadius: 30,
    padding: 25,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  modalTitleRow: {
    flexDirection: "row",
  },

  modalWhite: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "400",
  },

  modalGreen: {
    color: themas.colors.primary,
    fontSize: 24,
    fontWeight: "700",
  },

  subTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },

  input: {
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 18,
    height: 58,
    paddingHorizontal: 18,
    color: "#FFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: themas.colors.primary,
  },

  inputFocused: {
    borderColor: "#FFF",
  },

  dropdown: {
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: themas.colors.primary,
    height: 58,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  selectedIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: themas.colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  dropdownContainer: {
    backgroundColor: "#111",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingVertical: 8,
  },

  dropdownItemContainer: {
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 4,
  },

  dropdownRenderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  dropdownIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: themas.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  dropdownItemText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
  },

  dropdownText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
  },

  modalButton: {
    backgroundColor: themas.colors.primary,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 35,
  },

  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
