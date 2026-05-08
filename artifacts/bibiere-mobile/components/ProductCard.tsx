import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { Product, useCommerce } from "@/contexts/CommerceContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const colors = useColors();
  const { addToCart, toggleWishlist, isWishlisted } = useCommerce();
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleWishlist(product);
  };

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await addToCart(product);
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, width: CARD_WIDTH }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.primaryImage }}
          style={styles.image}
          resizeMode="cover"
        />
        {!product.inStock && (
          <View style={[styles.outOfStockBadge, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
            <Text style={styles.outOfStockText}>Sold Out</Text>
          </View>
        )}
        {discount && (
          <View style={[styles.discountBadge, { backgroundColor: colors.burgundy }]}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.wishlistBtn, { backgroundColor: "rgba(255,255,255,0.92)" }]}
          onPress={handleWishlist}
        >
          <Feather
            name={wishlisted ? "heart" : "heart"}
            size={16}
            color={wishlisted ? colors.burgundy : "#aaa"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.brand, { color: colors.mutedForeground }]}>bibiere</Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.burgundy }]}>
            ${product.price}
          </Text>
          {product.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>
              ${product.originalPrice}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.addBtn,
            {
              backgroundColor: product.inStock ? colors.burgundy : colors.muted,
            },
          ]}
          onPress={handleAddToCart}
          disabled={!product.inStock}
        >
          <Text
            style={[
              styles.addBtnText,
              { color: product.inStock ? "#fff" : colors.mutedForeground },
            ]}
          >
            {product.inStock ? "Add to Cart" : "Sold Out"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 0.8,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0ebe5",
  },
  outOfStockBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    alignItems: "center",
  },
  outOfStockText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  wishlistBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: 12,
    gap: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  brand: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  addBtn: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
