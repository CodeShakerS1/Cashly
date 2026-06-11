import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LoadingCoin } from "@/src/components/login/login";
import { useAuth } from "@/src/contexts/auth";
import { Ionicons } from "@expo/vector-icons";

type NotificationType =
  | "income_sucess"
  | "limit_warning_80"
  | "limit_exceeded_100"
  | string;

interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  userId: number;
}

function getTypeConfig(type: NotificationType): {
  color: string;
  bg: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  tag: string;
} {
  switch (type) {
    case "income_sucess":
      return {
        color: "#6CFF2B",
        bg: "#6CFF2B18",
        icon: "wallet",
        tag: "Receita",
      };
    case "limit_warning_80":
      return {
        color: "#FFD600",
        bg: "#FFD60018",
        icon: "warning",
        tag: "Alerta",
      };
    case "limit_exceeded_100":
      return {
        color: "#FF4D4D",
        bg: "#FF4D4D18",
        icon: "alert-circle",
        tag: "Excedido",
      };
    default:
      return {
        color: "#AAAAAA",
        bg: "#AAAAAA18",
        icon: "notifications",
        tag: "Info",
      };
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Agora";
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffH < 24) return `${diffH}h atrás`;
  if (diffD === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

const NotificationCard = React.memo(function NotificationCard({
  item,
  onMarkRead,
}: {
  item: Notification;
  onMarkRead: (id: number) => void;
}) {
  const cfg = getTypeConfig(item.type);

  return (
    <Pressable
      onPress={() => !item.isRead && onMarkRead(item.id)}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: cfg.color, backgroundColor: cfg.bg },
        !item.isRead && styles.cardUnread,
        pressed && styles.cardPressed,
      ]}
    >
      {!item.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />
      )}

      <View style={styles.cardHeader}>
        <View style={[styles.iconWrap, { borderColor: cfg.color }]}>
          <Ionicons name={cfg.icon} size={18} color={cfg.color} />
        </View>

        <View style={styles.cardMeta}>
          <View style={[styles.tag, { backgroundColor: cfg.color + "28" }]}>
            <Text style={[styles.tagText, { color: cfg.color }]}>
              {cfg.tag}
            </Text>
          </View>
          <Text style={styles.timeText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.message}</Text>
    </Pressable>
  );
});

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <View style={styles.emptyWrap}>
      <Ionicons
        name={
          filtered ? "checkmark-circle-outline" : "notifications-off-outline"
        }
        size={48}
        color="#3A3A3A"
      />
      <Text style={styles.emptyTitle}>
        {filtered ? "Tudo lido!" : "Sem notificações"}
      </Text>
      <Text style={styles.emptyText}>
        {filtered
          ? "Nenhuma notificação não lida no momento."
          : "Quando algo acontecer, você verá aqui."}
      </Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(
    async (unreadOnly = showUnreadOnly) => {
      try {
        setLoading(true);
        setError(null);
        const endpoint = unreadOnly
          ? `http://localhost:8080/notification/user/${user?.id}/unread`
          : `http://localhost:8080/notification/user/${user?.id}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Erro ${res.status}`);

        const data: Notification[] = await res.json();
        setNotifications(data.sort((a, b) => b.id - a.id));
      } catch (e: any) {
        setError(e.message ?? "Falha ao carregar notificações");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showUnreadOnly],
  );

  useEffect(() => {
    setLoading(true);
    fetchNotifications(showUnreadOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUnreadOnly]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications(showUnreadOnly);
  }, [showUnreadOnly, fetchNotifications]);

  const handleMarkRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

    fetch(`http://localhost:8080/notification/${id}/read`, {
      method: "PATCH",
    }).catch(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
      );
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return <LoadingCoin />;
  }

  if (error) {
    return (
      <View style={styles.emptyWrap}>
        <Ionicons name="cloud-offline-outline" size={48} color="#FF4D4D" />
        <Text style={[styles.emptyTitle, { color: "#FF4D4D" }]}>Ops!</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <Pressable style={styles.retryBtn} onPress={() => fetchNotifications()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notificações</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>
              {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
            </Text>
          )}
        </View>
        <Ionicons name="notifications" size={22} color="#FFFFFF" />
      </View>
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setShowUnreadOnly(false)}
          style={[styles.filterTab, !showUnreadOnly && styles.filterTabActive]}
        >
          <Text
            style={[
              styles.filterText,
              !showUnreadOnly && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowUnreadOnly(true)}
          style={[styles.filterTab, showUnreadOnly && styles.filterTabActive]}
        >
          <Text
            style={[
              styles.filterText,
              showUnreadOnly && styles.filterTextActive,
            ]}
          >
            Não lidas
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NotificationCard item={item} onMarkRead={handleMarkRead} />
        )}
        contentContainerStyle={
          notifications.length === 0
            ? styles.flatListEmpty
            : styles.flatListContent
        }
        ListEmptyComponent={<EmptyState filtered={showUnreadOnly} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6CFF2B"
            colors={["#6CFF2B"]}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },
  headerSub: {
    fontSize: 12,
    color: "#6CFF2B",
    marginTop: 2,
    fontWeight: "500",
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "#0D0D0D",
    gap: 6,
  },
  filterTabActive: {
    borderColor: "#6CFF2B",
    backgroundColor: "#6CFF2B18",
  },
  filterText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#6CFF2B",
    fontWeight: "700",
  },

  badge: {
    backgroundColor: "#6CFF2B",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000000",
  },

  card: {
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 20,
    borderLeftWidth: 3,
    position: "relative",
    overflow: "hidden",
  },
  cardUnread: {
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: "#2A2A2A",
  },
  cardPressed: {
    opacity: 0.75,
  },
  unreadDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D0D0D40",
  },
  cardMeta: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardText: {
    color: "#D9D9D9",
    fontSize: 14,
    lineHeight: 20,
  },

  flatListContent: {
    paddingTop: 4,
  },
  flatListEmpty: {
    flex: 1,
    justifyContent: "center",
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#555",
    fontSize: 14,
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#FF4D4D18",
    borderWidth: 1,
    borderColor: "#FF4D4D",
  },
  retryText: {
    color: "#FF4D4D",
    fontWeight: "700",
    fontSize: 13,
  },
});
