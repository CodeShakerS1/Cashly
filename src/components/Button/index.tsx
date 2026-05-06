import { themas } from "@/src/theme/themes";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  titulo: string;
  onPress: (event: GestureResponderEvent) => void;
};

export function Button({ titulo, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: themas.colors.primary,
    justifyContent: "center",
    borderRadius: 13,
    alignItems: "center",
    marginTop: 40,
    alignSelf: "center",
    width: "80%",
    height: 50,
    padding: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: themas.colors.platinium,
  },
});
