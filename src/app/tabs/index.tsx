import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View>
      <Text>Tela inicial</Text>
      <TouchableOpacity onPress={() => router.push("/tabs/notification")}>
        <MaterialIcons name="notifications" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
