import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useCommerce } from "@/contexts/CommerceContext";

const MENU_ITEMS = [
  { icon: "shopping-bag" as const, label: "My Orders", sub: "Track and view orders", href: null },
  { icon: "heart" as const, label: "Wishlist", sub: "Items saved for later", href: null },
  { icon: "map-pin" as const, label: "Addresses", sub: "Shipping destinations", href: null },
  { icon: "credit-card" as const, label: "Payment Methods", sub: "Cards and billing", href: null },
  { icon: "help-circle" as const, label: "Help & FAQ", sub: "Support and answers", href: null },
  { icon: "message-circle" as const, label: "Contact Us", sub: "Get in touch with us", href: null },
];

export default function AccountScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cartCount, wishlistCount } = useCommerce();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const openWeb = (path: string) => {
    const domain = process.env.EXPO_PUBLIC_DOMAIN ?? "bibiere.replit.app";
    Linking.openURL(`https://${domain}${path}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.cream }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Account</Text>
      </View>

      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.burgundy }]}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={32} color={colors.burgundy} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Welcome to bibiere</Text>
          <Text style={styles.profileSub}>Sign in for the full experience</Text>
        </View>
        <TouchableOpacity
          style={styles.signInBtn}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            openWeb("/sign-in");
          }}
        >
          <Text style={[styles.signInBtnText, { color: colors.burgundy }]}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.burgundy }]}>{cartCount}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>In Cart</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.burgundy }]}>{wishlistCount}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Saved</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.burgundy }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Orders</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={[styles.menu, { backgroundColor: colors.card }]}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              index < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: colors.muted }]}>
              <Feather name={item.icon} size={18} color={colors.burgundy} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Brand Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerBrand, { color: colors.burgundy }]}>bibiere</Text>
        <Text style={[styles.footerTagline, { color: colors.mutedForeground }]}>
          Timeless Luxury Fashion
        </Text>
        <TouchableOpacity onPress={() => openWeb("/")}>
          <Text style={[styles.footerLink, { color: colors.gold }]}>Visit our website →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: "700" },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1 },
  profileName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  profileSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
  signInBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  signInBtnText: { fontSize: 13, fontWeight: "700" },
  statsRow: {
    marginHorizontal: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "700" },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 40 },
  menu: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: "600" },
  menuSub: { fontSize: 12, marginTop: 1 },
  footer: { marginTop: 32, alignItems: "center", gap: 6 },
  footerBrand: { fontSize: 22, fontWeight: "700", letterSpacing: 2 },
  footerTagline: { fontSize: 12, letterSpacing: 0.5 },
  footerLink: { fontSize: 13, fontWeight: "600", marginTop: 4 },
});
