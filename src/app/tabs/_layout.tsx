import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { themas } from "../../theme/themes";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="home"
              size={24}
              color={themas.colors.bgScreen}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="sort"
              size={24}
              color={themas.colors.bgScreen}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="bar-chart"
              size={24}
              color={themas.colors.bgScreen}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
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
