import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useCommerce } from "@/contexts/CommerceContext";

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cart, removeFromCart, updateQty, cartTotal } = useCommerce();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.cream }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.cream }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Cart</Text>
        {cart.length > 0 && (
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {cart.reduce((s, i) => s + i.quantity, 0)} items
          </Text>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="shopping-bag" size={56} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your cart is empty</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Add items from the store to get started
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 180 }}
            showsVerticalScrollIndicator={false}
          >
            {cart.map((item) => (
              <View key={item.id} style={[styles.cartItem, { backgroundColor: colors.card }]}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.burgundy }]}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={[styles.qtyBtn, { borderColor: colors.border }]}
                      onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        updateQty(item.productId, item.quantity - 1);
                      }}
                    >
                      <Feather name="minus" size={14} color={colors.foreground} />
                    </TouchableOpacity>
                    <Text style={[styles.qty, { color: colors.foreground }]}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={[styles.qtyBtn, { borderColor: colors.border }]}
                      onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        updateQty(item.productId, item.quantity + 1);
                      }}
                    >
                      <Feather name="plus" size={14} color={colors.foreground} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        removeFromCart(item.productId);
                      }}
                    >
                      <Feather name="trash-2" size={14} color={colors.destructive} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            style={[
              styles.checkout,
              { backgroundColor: colors.card, paddingBottom: bottomPad + 20, borderTopColor: colors.border },
            ]}
          >
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>Total</Text>
              <Text style={[styles.totalAmount, { color: colors.burgundy }]}>
                ${cartTotal.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: colors.burgundy }]}
              onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
            >
              <Text style={styles.checkoutBtnText}>Checkout on Web</Text>
            </TouchableOpacity>
            <Text style={[styles.checkoutNote, { color: colors.mutedForeground }]}>
              Complete your purchase at bibiere.com
            </Text>
          </View>
        </>
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
  cartItem: {
    flexDirection: "row",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImage: { width: 100, height: 110, backgroundColor: "#f0ebe5" },
  itemInfo: { flex: 1, padding: 14, justifyContent: "space-between" },
  itemName: { fontSize: 14, fontWeight: "600", lineHeight: 19 },
  itemPrice: { fontSize: 16, fontWeight: "700" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: { fontSize: 15, fontWeight: "600", minWidth: 20, textAlign: "center" },
  removeBtn: { marginLeft: "auto" },
  checkout: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  totalLabel: { fontSize: 16, fontWeight: "500" },
  totalAmount: { fontSize: 24, fontWeight: "700" },
  checkoutBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  checkoutNote: { fontSize: 11, textAlign: "center" },
});
