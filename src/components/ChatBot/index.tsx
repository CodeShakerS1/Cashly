import { MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { themas } from "../../theme/themes";

// Address of the Python chatbot API (uvicorn api:app --host 0.0.0.0 --port 8000)
const CHATBOT_URL = "http://localhost:8000";

const HISTORY_LIMIT = 6;

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    // The API keeps no state: each call carries the recent conversation
    const history = messages.slice(-HISTORY_LIMIT);

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${CHATBOT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok) {
        throw new Error("Chatbot request failed");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Não consegui responder agora. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>?</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Assistente Cashly</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={themas.colors.secundary}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(_, index) => String(index)}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() => listRef.current?.scrollToEnd()}
              ListHeaderComponent={
                <View style={[styles.bubble, styles.assistantBubble]}>
                  <Text style={styles.bubbleText}>
                    Olá! Sou o assistente do Cashly. Pergunte o que quiser sobre
                    o app.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.bubble,
                    item.role === "user"
                      ? styles.userBubble
                      : styles.assistantBubble,
                  ]}
                >
                  <Text style={styles.bubbleText}>{item.content}</Text>
                </View>
              )}
            />

            {loading && (
              <ActivityIndicator
                style={styles.loading}
                color={themas.colors.primary}
              />
            )}

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Digite sua pergunta"
                placeholderTextColor="#888"
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  loading && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={loading}
              >
                <MaterialIcons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 16,
    bottom: 100,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: themas.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    height: "75%",
    backgroundColor: themas.colors.gray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: themas.colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 8,
    paddingBottom: 8,
  },
  bubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 14,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: themas.colors.primary,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: themas.colors.bgInputs,
  },
  bubbleText: {
    color: "#fff",
    fontSize: 14,
  },
  loading: {
    marginVertical: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: themas.colors.bgInputs,
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themas.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
