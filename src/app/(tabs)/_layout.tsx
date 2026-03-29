import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { themas } from "../../theme/themes";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#0F0F0F",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => (
            <MaterialIcons
              name="home"
              size={24}
              color={themas.colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          tabBarIcon: () => (
            <MaterialIcons
              name="list"
              size={24}
              color={themas.colors.bgScreen}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions-button"
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/transactions")}
              activeOpacity={0.8}
            >
              <View style={styles.addButtonInner}>
                <MaterialIcons name="add" size={32} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="relatory"
        options={{
          tabBarIcon: () => (
            <MaterialIcons
              name="bar-chart"
              size={24}
              color={themas.colors.bgScreen}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: () => (
            <MaterialIcons
              name="settings"
              size={24}
              color={themas.colors.bgScreen}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: themas.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
