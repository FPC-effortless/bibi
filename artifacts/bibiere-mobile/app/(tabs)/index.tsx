import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useCommerce } from "@/contexts/CommerceContext";
import { ProductCard } from "@/components/ProductCard";

const CATEGORIES = ["All", "Dresses", "Outerwear", "Blazers", "Accessories", "Shoes"];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { products } = useCommerce();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const featured = products.filter((p) => p.featured);
  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.cream }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.cream }]}>
        <Text style={[styles.brandTagline, { color: colors.mutedForeground }]}>
          TIMELESS LUXURY
        </Text>
        <Text style={[styles.brandName, { color: colors.burgundy }]}>bibiere</Text>
      </View>

      {/* Featured Banner */}
      <View style={[styles.heroBanner, { backgroundColor: colors.burgundy }]}>
        <Text style={styles.heroTagline}>NEW COLLECTION</Text>
        <Text style={styles.heroTitle}>Made to Order{"\n"}by bibiere</Text>
        <Text style={styles.heroSub}>Tailored pieces created after your order</Text>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured</Text>
          <Text style={[styles.sectionSub, { color: colors.gold }]}>New Arrivals</Text>
        </View>
        <FlatList
          data={featured}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
          scrollEnabled={featured.length > 0}
          renderItem={({ item }) => (
            <View style={{ width: 180 }}>
              <ProductCard product={item} />
            </View>
          )}
        />
        {products.length === 0 && (
          <View style={styles.emptyCatalog}>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Catalog sync pending</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              The live made-to-order catalog is available on the web store.
            </Text>
          </View>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 14, paddingHorizontal: 20 }]}>
          Browse
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === cat ? colors.burgundy : colors.card,
                  borderColor: selectedCategory === cat ? colors.burgundy : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  { color: selectedCategory === cat ? "#fff" : colors.mutedForeground },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Grid */}
        <View style={styles.grid}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filtered.length % 2 !== 0 && <View style={{ flex: 1, margin: 6 }} />}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  brandTagline: {
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "500",
    marginBottom: 4,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 2,
  },
  heroBanner: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 32,
    marginBottom: 28,
  },
  heroTagline: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 8,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
    marginBottom: 8,
  },
  heroSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontStyle: "italic",
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
    marginTop: 16,
    justifyContent: "flex-start",
  },
  emptyCatalog: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.65)",
    gap: 6,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptyText: { fontSize: 13, lineHeight: 19 },
});
