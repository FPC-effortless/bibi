import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useCommerce, WishlistItem } from "@/contexts/CommerceContext";

function WishlistCard({ item, onRemove, onAddToCart }: {
  item: WishlistItem;
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, { color: colors.foreground }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.burgundy }]}>${item.price}</Text>
          {item.originalPrice && (
            <Text style={[styles.origPrice, { color: colors.mutedForeground }]}>
              ${item.originalPrice}
            </Text>
          )}
        </View>
        {!item.inStock && (
          <Text style={[styles.outOfStock, { color: colors.mutedForeground }]}>Out of stock</Text>
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.addBtn,
              { backgroundColor: item.inStock ? colors.burgundy : colors.muted },
            ]}
            onPress={onAddToCart}
            disabled={!item.inStock}
          >
            <Feather name="shopping-bag" size={14} color={item.inStock ? "#fff" : colors.mutedForeground} />
            <Text style={[styles.addBtnText, { color: item.inStock ? "#fff" : colors.mutedForeground }]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function WishlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishlist, products, toggleWishlist, addToCart } = useCommerce();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.cream }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.cream }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Wishlist</Text>
        {wishlist.length > 0 && (
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </Text>
        )}
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="heart" size={56} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nothing saved yet</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Tap the heart on any product to save it for later
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 100 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={wishlist.length > 0}
          renderItem={({ item }) => {
            const product = products.find((p) => p.id === item.productId);
            return (
              <WishlistCard
                item={item}
                onRemove={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (product) toggleWishlist(product);
                }}
                onAddToCart={async () => {
                  if (!product || !item.inStock) return;
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  addToCart(product);
                }}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 14, marginTop: 2 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 22, fontWeight: "700" },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: { width: 110, height: 130, backgroundColor: "#f0ebe5" },
  cardInfo: { flex: 1, padding: 14, justifyContent: "space-between" },
  cardName: { fontSize: 14, fontWeight: "600", lineHeight: 19 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  price: { fontSize: 16, fontWeight: "700" },
  origPrice: { fontSize: 13, textDecorationLine: "line-through" },
  outOfStock: { fontSize: 12, fontStyle: "italic" },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  addBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addBtnText: { fontSize: 12, fontWeight: "600" },
  removeBtn: { padding: 4 },
});
