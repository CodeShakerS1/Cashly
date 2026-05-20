import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { themas } from "../../theme/themes";

const ICON_OPTIONS = [
  { label: "Alimentação", icon: "restaurant-outline" },
  { label: "Transporte", icon: "bus-outline" },
  { label: "Saúde", icon: "medkit-outline" },
  { label: "Moradia", icon: "home-outline" },
  { label: "Compras", icon: "bag-handle-outline" },
];

const DEFAULT_CATEGORIES = [
  {
    id: "1",
    title: "Alimentação",
    value: "R$ 120,00",
    limit: "R$ 150,00",
    icon: "restaurant-outline",
    progress: "30%",
  },
  {
    id: "2",
    title: "Transporte",
    value: "R$ 250,00",
    limit: "R$ 150,00",
    icon: "bus-outline",
    progress: "60%",
  },
  {
    id: "3",
    title: "Assinaturas",
    value: "R$ 60,00",
    limit: "R$ 150,00",
    icon: "card-outline",
    progress: "30%",
  },
  {
    id: "4",
    title: "Pessoal",
    value: "R$ 150,00",
    limit: "R$ 150,00",
    icon: "bag-handle-outline",
    progress: "70%",
  },
  {
    id: "5",
    title: "Saúde",
    value: "R$ 100,00",
    limit: "R$ 150,00",
    icon: "medkit-outline",
    progress: "40%",
  },
  {
    id: "6",
    title: "Moradia",
    value: "R$ 180,00",
    limit: "R$ 150,00",
    icon: "home-outline",
    progress: "45%",
  },
];

export default function CategoriesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [limit, setLimit] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("restaurant-outline");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLimit = (text: string) => {
    setLimit(text.replace(/[^0-9]/g, ""));
  };

  const handleCreateCategory = () => {
    if (!categoryName.trim() || !limit.trim() || !selectedIcon) {
      Alert.alert("Atenção", "Preencha todas as informações.");
      return;
    }

    const formattedLimit = `R$ ${limit},00`;

    const newCategory = {
      id: String(categories.length + 1),
      title: categoryName,
      value: "R$ 0,00",
      limit: formattedLimit,
      icon: selectedIcon,
      progress: "0%",
    };

    setCategories([...categories, newCategory]);

    Alert.alert("Sucesso", "Categoria criada com sucesso!");

    setCategoryName("");
    setLimit("");
    setSelectedIcon("restaurant-outline");
    setDropdownKey((prev) => prev + 1);
    setModalVisible(false);
  };

  const handleIconChange = (item: any) => {
    setSelectedIcon(item.icon);
    setDropdownKey((prev) => prev + 1);
  };

  const renderCategoryCard = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.leftContent}>
          <View style={styles.iconBox}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={themas.colors.platinium}
            />
          </View>

          <Text style={styles.categoryName}>{item.title}</Text>
        </View>

        <View style={styles.rightContent}>
          <Text style={styles.categoryValue}>{item.value}</Text>

          <Text style={styles.categoryLimit}>
            Limite : {item.limit}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBar, { width: item.progress as any }]}
        />
      </View>
    </View>
  );

  const renderIconItem = (item: any) => (
    <View style={styles.dropdownRenderItem}>
      <View style={styles.dropdownIconBox}>
        <Ionicons
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
              <Text style={styles.greeting}>Olá, Josefa!</Text>

              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons
                  name="notifications-outline"
                  size={18}
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
            <Text style={styles.addButtonText}>
              Adicionar Categoria
            </Text>
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
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.modalTitleRow}>
                <Text style={styles.modalWhite}>Nova </Text>

                <Text style={styles.modalGreen}>Categoria</Text>
              </View>

              <View style={{ width: 24 }} />
            </View>

            <Text style={styles.subTitle}>
              Nome da Categoria
            </Text>

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
                  <Ionicons
                    name={selectedIcon as any}
                    size={20}
                    color={themas.colors.primary}
                  />
                </View>
              )}
              renderRightIcon={() => (
                <MaterialCommunityIcons
                  name="chevron-down"
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
              <Text style={styles.modalButtonText}>
                Adicionar Categoria
              </Text>
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