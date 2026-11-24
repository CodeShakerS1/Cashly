import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { themas } from "@/src/theme/themes";

const STORE_COLORS = ["#5BBF26", "#00BFFF", "#FF8C00", "#A78BFA", "#FF4D4D", "#FFD600"];

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

const DEMO_COUPONS: Coupon[] = [
  {
    id: 1,
    externalId: "demo-1",
    store: "Magalu",
    title: "R$ 50 OFF em compras acima de R$ 299",
    description: "Válido para produtos selecionados no site. Não cumulativo com outras promoções.",
    code: "CASHLY50",
    discount: "R$ 50 OFF",
    category: "Eletrônicos",
    imageUrl: null,
    affiliateUrl: "https://www.magalu.com/",
    expiresAt: daysFromNow(5),
    uses: 1240,
    featured: true,
    source: "demo",
  },
  {
    id: 2,
    externalId: "demo-2",
    store: "Amazon",
    title: "Até 40% OFF em produtos selecionados",
    description: "Desconto aplicado no checkout em itens participantes.",
    code: "CASHLY40",
    discount: "40% OFF",
    category: "Eletrônicos",
    imageUrl: null,
    affiliateUrl: "https://www.amazon.com.br/",
    expiresAt: daysFromNow(3),
    uses: 980,
    featured: true,
    source: "demo",
  },
  {
    id: 3,
    externalId: "demo-3",
    store: "Nike",
    title: "30% OFF em tênis selecionados",
    description: "Cupom válido para a linha de corrida.",
    code: "CORRIDA30",
    discount: "30% OFF",
    category: "Moda",
    imageUrl: null,
    affiliateUrl: "https://www.nike.com.br/",
    expiresAt: daysFromNow(2),
    uses: 2110,
    featured: true,
    source: "demo",
  },
  {
    id: 4,
    externalId: "demo-4",
    store: "Renner",
    title: "20% OFF na primeira compra do app",
    description: "Para novos clientes, válido em peças selecionadas.",
    code: "PRIMEIRA20",
    discount: "20% OFF",
    category: "Moda",
    imageUrl: null,
    affiliateUrl: "https://www.renner.com.br/",
    expiresAt: daysFromNow(7),
    uses: 756,
    featured: false,
    source: "demo",
  },
  {
    id: 5,
    externalId: "demo-5",
    store: "iFood",
    title: "R$ 25 OFF no seu próximo pedido",
    description: "Válido para pedidos acima de R$ 60 em restaurantes parceiros.",
    code: "FOOD25",
    discount: "R$ 25 OFF",
    category: "Alimentação",
    imageUrl: null,
    affiliateUrl: "https://www.ifood.com.br/",
    expiresAt: daysFromNow(4),
    uses: 3420,
    featured: true,
    source: "demo",
  },
  {
    id: 6,
    externalId: "demo-6",
    store: "Casas Bahia",
    title: "R$ 100 OFF em eletrodomésticos",
    description: "Oferta válida em geladeiras, fogões e máquinas de lavar.",
    code: "CASA100",
    discount: "R$ 100 OFF",
    category: "Casa",
    imageUrl: null,
    affiliateUrl: "https://www.casasbahia.com.br/",
    expiresAt: daysFromNow(6),
    uses: 612,
    featured: false,
    source: "demo",
  },
  {
    id: 7,
    externalId: "demo-7",
    store: "Sephora",
    title: "15% OFF em perfumaria",
    description: "Desconto em marcas selecionadas, enquanto durar o estoque.",
    code: "BELEZA15",
    discount: "15% OFF",
    category: "Beleza",
    imageUrl: null,
    affiliateUrl: "https://www.sephora.com.br/",
    expiresAt: daysFromNow(8),
    uses: 845,
    featured: false,
    source: "demo",
  },
  {
    id: 8,
    externalId: "demo-8",
    store: "Booking.com",
    title: "10% OFF em hotéis selecionados",
    description: "Reserve sua próxima viagem com desconto em acomodações participantes.",
    code: "VIAGEM10",
    discount: "10% OFF",
    category: "Viagem",
    imageUrl: null,
    affiliateUrl: "https://www.booking.com/",
    expiresAt: daysFromNow(10),
    uses: 1320,
    featured: false,
    source: "demo",
  },
  {
    id: 9,
    externalId: "demo-9",
    store: "Samsung",
    title: "R$ 200 OFF em smartphones",
    description: "Válido nos modelos Galaxy selecionados, por tempo limitado.",
    code: "GALAXY200",
    discount: "R$ 200 OFF",
    category: "Eletrônicos",
    imageUrl: null,
    affiliateUrl: "https://www.samsung.com/br/",
    expiresAt: daysFromNow(1),
    uses: 1870,
    featured: false,
    source: "demo",
  },
  {
    id: 10,
    externalId: "demo-10",
    store: "Natural",
    title: "25% OFF em kits de cuidados",
    description: "Kits selecionados com desconto exclusivo para o app.",
    code: "NATURAL25",
    discount: "25% OFF",
    category: "Beleza",
    imageUrl: null,
    affiliateUrl: "https://www.natural.com.br/",
    expiresAt: daysFromNow(9),
    uses: 490,
    featured: false,
    source: "demo",
  },
];

type Coupon = {
  id: number;
  externalId?: string;
  store: string;
  title: string;
  description: string;
  code: string | null;
  discount: string | null;
  category: string | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  expiresAt: string | null;
  uses: number;
  featured: boolean;
  source: string;
};

function storeColor(store: string): string {
  let hash = 0;
  for (let i = 0; i < store.length; i++) {
    hash = (hash * 31 + store.charCodeAt(i)) | 0;
  }
  return STORE_COLORS[Math.abs(hash) % STORE_COLORS.length];
}

function formatExpiry(iso: string | null): string {
  if (!iso) return "Validade não informada";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Validade não informada";
  if (date.getTime() < Date.now()) return "Cupom expirado";

  const days = Math.ceil((date.getTime() - Date.now()) / 86400000);
  if (days <= 1) return "Expira hoje";
  return `Até ${date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;
}

const CouponCard = React.memo(function CouponCard({
  coupon,
  copied,
  compact,
  onCopy,
  onOpen,
}: {
  coupon: Coupon;
  copied: boolean;
  compact: boolean;
  onCopy: (coupon: Coupon) => void;
  onOpen: (coupon: Coupon) => void;
}) {
  const color = storeColor(coupon.store);

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      {coupon.featured && (
        <View style={[styles.featuredBadge, { backgroundColor: color }]}>
          <Ionicons name="flash" size={11} color="#000" />
          <Text style={styles.featuredText}>DESTAQUE</Text>
        </View>
      )}

      <View style={[styles.cardTop, compact && styles.cardTopCompact]}>
        {coupon.imageUrl ? (
          <Image
            source={{ uri: coupon.imageUrl }}
            style={[styles.logo, compact && styles.logoCompact, styles.logoImage]}
          />
        ) : (
          <View style={[styles.logo, compact && styles.logoCompact, { backgroundColor: color }]}>
            <Text style={[styles.logoText, compact && styles.logoTextCompact]}>
              {coupon.store.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, compact && styles.storeNameCompact]} numberOfLines={1}>
            {coupon.store}
          </Text>
          <Text style={styles.categoryText}>{coupon.category ?? "Ofertas"}</Text>
        </View>
        {coupon.discount ? (
          <View
            style={[
              styles.discountPill,
              compact && styles.discountPillCompact,
              { borderColor: color },
            ]}
          >
            <Text
              style={[styles.discountText, compact && styles.discountTextCompact, { color }]}
              numberOfLines={1}
            >
              {coupon.discount}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.cardTitle, compact && styles.cardTitleCompact]} numberOfLines={2}>
        {coupon.title}
      </Text>
      <Text
        style={[styles.cardDescription, compact && styles.cardDescriptionCompact]}
        numberOfLines={2}
      >
        {coupon.description}
      </Text>

      {coupon.code ? (
        <Pressable
          onPress={() => onCopy(coupon)}
          style={({ pressed }) => [
            styles.codeBox,
            compact && styles.codeBoxCompact,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.codeTextWrap}>
            <Text style={styles.codeLabel}>CÓDIGO DO CUPOM</Text>
            <Text
              style={[styles.codeValue, compact && styles.codeValueCompact]}
              numberOfLines={1}
            >
              {copied ? "Copiado!" : coupon.code}
            </Text>
          </View>
          <View
            style={[
              styles.copyButton,
              compact && styles.copyButtonCompact,
              copied && styles.copyButtonDone,
            ]}
          >
            <Ionicons
              name={copied ? "checkmark" : "copy-outline"}
              size={compact ? 13 : 15}
              color={copied ? "#000" : themas.colors.primary}
            />
            <Text style={[styles.copyText, copied && styles.copyTextDone]}>
              {copied ? "Copiado" : "Copiar"}
            </Text>
          </View>
        </Pressable>
      ) : (
        <View style={[styles.codeBox, compact && styles.codeBoxCompact]}>
          <Text style={styles.noCodeText}>Oferta sem código — use o link da loja</Text>
        </View>
      )}

      <View style={[styles.cardFooter, compact && styles.cardFooterCompact]}>
        <View style={styles.metaWrap}>
          <Ionicons name="time-outline" size={13} color="#777" />
          <Text style={[styles.metaText, compact && styles.metaTextCompact]}>
            {formatExpiry(coupon.expiresAt)}
          </Text>
        </View>
        <View style={styles.metaWrap}>
          <Ionicons name="people-outline" size={13} color="#777" />
          <Text style={[styles.metaText, compact && styles.metaTextCompact]}>
            {coupon.uses} usos
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onOpen(coupon)}
        disabled={!coupon.affiliateUrl}
        style={({ pressed }) => [
          styles.storeButton,
          compact && styles.storeButtonCompact,
          { borderColor: color },
          pressed && styles.pressed,
          !coupon.affiliateUrl && styles.storeButtonDisabled,
        ]}
      >
        <Text style={[styles.storeButtonText, { color }]}>Ir para a loja</Text>
        <Ionicons name="arrow-forward" size={15} color={color} />
      </Pressable>
    </View>
  );
});

export default function CouponsScreen() {
  const [coupons, setCoupons] = useState<Coupon[]>(DEMO_COUPONS);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = useMemo(
    () => [
      "Todos",
      ...Array.from(
        new Set(
          DEMO_COUPONS.map((coupon) => coupon.category).filter(
            (value): value is string => Boolean(value),
          ),
        ),
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    ],
    [],
  );

  const filteredCoupons = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return coupons.filter((coupon) => {
      if (category !== "Todos" && coupon.category !== category) return false;
      if (!query) return true;
      return [coupon.store, coupon.title, coupon.description, coupon.code, coupon.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [coupons, category, debouncedSearch]);

  const { width } = useWindowDimensions();
  const compact = width <= 420;
  const pagePadding = compact ? 14 : 20;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const registerUse = useCallback((id: number) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id ? { ...coupon, uses: coupon.uses + 1 } : coupon,
      ),
    );
  }, []);

  const handleCopy = useCallback(
    async (coupon: Coupon) => {
      if (!coupon.code) return;
      try {
        await Clipboard.setStringAsync(coupon.code);
        setCopiedId(coupon.id);
        setTimeout(() => setCopiedId(null), 2000);
        registerUse(coupon.id);
      } catch {
        setCopiedId(null);
      }
    },
    [registerUse],
  );

  const handleOpen = useCallback(
    async (coupon: Coupon) => {
      if (!coupon.affiliateUrl) return;
      registerUse(coupon.id);
      try {
        await Linking.openURL(coupon.affiliateUrl);
      } catch {
        // Link indisponível no dispositivo.
      }
    },
    [registerUse],
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, compact && styles.headerCompact, { paddingHorizontal: pagePadding }]}>
        <View>
          <Text style={[styles.title, compact && styles.titleCompact]}>Cupons</Text>
          <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
            Descontos para o seu dia a dia
          </Text>
        </View>
        <View style={[styles.headerIcon, compact && styles.headerIconCompact]}>
          <Ionicons name="pricetags" size={compact ? 19 : 22} color={themas.colors.primary} />
        </View>
      </View>

      <View
        style={[
          styles.searchRow,
          compact && styles.searchRowCompact,
          { marginHorizontal: pagePadding },
        ]}
      >
        <Ionicons name="search" size={compact ? 16 : 18} color="#777" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={compact ? "Buscar loja ou cupom" : "Buscar loja, categoria ou cupom"}
          placeholderTextColor="#666"
          style={[styles.input, compact && styles.inputCompact]}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} hitSlop={8}>
            <Ionicons name="close" size={compact ? 16 : 18} color="#777" />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.chipsList, compact && styles.chipsListCompact]}
        contentContainerStyle={[styles.chipsContent, { paddingHorizontal: pagePadding }]}
      >
        {categories.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategory(item)}
            style={({ pressed }) => [
              styles.chip,
              compact && styles.chipCompact,
              item === category && styles.chipActive,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                compact && styles.chipTextCompact,
                item === category && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View
        style={[
          styles.highlight,
          compact && styles.highlightCompact,
          { marginHorizontal: pagePadding },
        ]}
      >
        <Ionicons name="flash" size={compact ? 14 : 16} color="#0F0F0F" />
        <Text style={[styles.highlightText, compact && styles.highlightTextCompact]}>
          Cupons em alta
        </Text>
        <Text style={[styles.highlightCount, compact && styles.highlightCountCompact]}>
          {filteredCoupons.length} ofertas
        </Text>
      </View>

      <FlatList
        data={filteredCoupons}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CouponCard
            coupon={item}
            copied={copiedId === item.id}
            compact={compact}
            onCopy={handleCopy}
            onOpen={handleOpen}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          compact && styles.listContentCompact,
          filteredCoupons.length === 0 && styles.listEmpty,
          { paddingHorizontal: pagePadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={themas.colors.primary}
            colors={[themas.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="pricetag-outline" size={44} color="#3A3A3A" />
            <Text style={styles.emptyTitle}>Nenhum cupom encontrado</Text>
            <Text style={styles.emptyText}>
              Tente outra categoria ou termo de busca.
            </Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: themas.colors.bgScreen,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 14,
  },
  title: {
    color: themas.colors.secundary,
    fontSize: 25,
    fontWeight: "700",
  },
  subtitle: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themas.colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
    backgroundColor: themas.colors.bgInputs,
  },
  input: {
    flex: 1,
    color: themas.colors.secundary,
    fontSize: 14,
  },
  chipsList: {
    height: 46,
    minHeight: 46,
    flexGrow: 0,
    flexShrink: 0,
  },
  chipsListCompact: {
    height: 38,
    minHeight: 38,
  },
  chipsContent: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: themas.colors.gray,
  },
  chipActive: {
    borderColor: themas.colors.primary,
    backgroundColor: "#5BBF2620",
  },
  chipText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: themas.colors.primary,
  },
  highlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: themas.colors.primary,
  },
  highlightText: {
    color: "#0F0F0F",
    fontWeight: "700",
    fontSize: 13,
    flex: 1,
  },
  highlightCount: {
    color: "#0F0F0F99",
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  listEmpty: {
    flex: 1,
  },
  card: {
    backgroundColor: themas.colors.gray,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 10,
  },
  featuredText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    resizeMode: "contain",
    backgroundColor: "#1A1A1A",
  },
  logoText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "800",
  },
  storeInfo: {
    flex: 1,
    minWidth: 0,
  },
  storeName: {
    color: themas.colors.secundary,
    fontSize: 15,
    fontWeight: "700",
  },
  categoryText: {
    color: "#777",
    fontSize: 11,
    marginTop: 2,
  },
  discountPill: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    maxWidth: 110,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "800",
  },
  cardTitle: {
    color: themas.colors.secundary,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 14,
  },
  cardDescription: {
    color: "#999",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#3A3A3A",
    backgroundColor: "#0A0A0A",
  },
  codeTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  codeLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  codeValue: {
    color: themas.colors.secundary,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 2,
  },
  noCodeText: {
    color: "#777",
    fontSize: 12,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: themas.colors.primary,
  },
  copyButtonDone: {
    backgroundColor: themas.colors.primary,
    borderColor: themas.colors.primary,
  },
  copyText: {
    color: themas.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  copyTextDone: {
    color: "#000",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  },
  metaWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#777",
    fontSize: 11,
  },
  storeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  storeButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  storeButtonDisabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    gap: 8,
  },
  emptyTitle: {
    color: themas.colors.secundary,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  emptyText: {
    color: "#777",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },

  // Ajustes para telas estreitas (<= 420px)
  headerCompact: {
    paddingTop: 18,
    paddingBottom: 10,
    gap: 8,
  },
  titleCompact: {
    fontSize: 22,
  },
  subtitleCompact: {
    fontSize: 11,
  },
  headerIconCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  searchRowCompact: {
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
  },
  inputCompact: {
    fontSize: 13,
  },
  chipCompact: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipTextCompact: {
    fontSize: 11,
  },
  highlightCompact: {
    gap: 6,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 10,
  },
  highlightTextCompact: {
    fontSize: 12,
  },
  highlightCountCompact: {
    fontSize: 11,
  },
  listContentCompact: {
    paddingBottom: 4,
  },
  cardCompact: {
    padding: 13,
    marginBottom: 10,
    borderRadius: 14,
  },
  cardTopCompact: {
    gap: 8,
  },
  logoCompact: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  logoTextCompact: {
    fontSize: 17,
  },
  storeNameCompact: {
    fontSize: 14,
  },
  discountPillCompact: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 92,
  },
  discountTextCompact: {
    fontSize: 11,
  },
  cardTitleCompact: {
    fontSize: 14,
    marginTop: 11,
  },
  cardDescriptionCompact: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  codeBoxCompact: {
    gap: 8,
    marginTop: 11,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  codeValueCompact: {
    fontSize: 14,
  },
  copyButtonCompact: {
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
  },
  cardFooterCompact: {
    flexWrap: "wrap",
    marginTop: 10,
    gap: 6,
  },
  metaTextCompact: {
    fontSize: 10,
  },
  storeButtonCompact: {
    marginTop: 11,
    paddingVertical: 9,
    borderRadius: 10,
  },
});
