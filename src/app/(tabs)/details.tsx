import { Ionicons } from "@expo/vector-icons";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { themas } from "../../theme/themes";

const transactions = [
  {
    id: "1",
    title: "Refrigerante 2L",
    type: "Pix",
    value: "R$ 10,00",
    date: "15 mar",
  },
  {
    id: "2",
    title: "Rodízio",
    type: "Débito",
    value: "R$ 80,00",
    date: "14 mar",
  },
  {
    id: "3",
    title: "Bolo de morango",
    type: "Pix",
    value: "R$ 30,00",
    date: "13 mar",
  },
];

export default function CategoryDetailsScreen() {
  // futuramente esses dados virão da categoria clicada
  const category = {
    title: "Alimentação",
    value: "R$ 120,00",
    limit: "R$ 150,00",
    icon: "restaurant-outline",
    progress: "70%",
  };

  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionCard}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={category.icon as any}
            size={20}
            color={themas.colors.primary}
          />

          <Text style={styles.date}>{item.date}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.transactionTitle}>
            {item.title}
          </Text>

          <Text style={styles.transactionType}>
            {item.type}
          </Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.transactionValue}>
          {item.value}
        </Text>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons
            name="ellipsis-horizontal"
            size={18}
            color={themas.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color="#FFF"
                  />
                </View>

                <Text style={styles.headerTitle}>
                  Detalhes da Categoria
                </Text>
              </View>

              <TouchableOpacity style={styles.editButton}>
                <Ionicons
                  name="pencil"
                  size={18}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.categoryName}>
                {category.title}
              </Text>

              <Text style={styles.categoryValue}>
                {category.value}
              </Text>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: category.progress as any },
                  ]}
                />
              </View>

              <Text style={styles.limitText}>
                Limite : {category.limit}
              </Text>
            </View>
          </>
        }
        renderItem={renderTransaction}
      />
    </SafeAreaView>
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
});
