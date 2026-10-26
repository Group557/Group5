import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router, Stack, type Href } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const COLORS = {
  background: "#F5F4EE",
  green: "#234A38",
  card: "#E4E2D6",
  border: "#2E2E2E",
  text: "#1E1E1E",
  muted: "#A3A39A",
  accent: "#C98B2B",
  avatar: "#A8A8A8",
};

// Placeholder data.
const USER = {
  name: "John Smith",
  username: "johnsmith",
  email: "johnsmith@calpoly.edu",
  gender: "Male",
  heightFeet: 5,
  heightInches: 11,
  daysCompleted: 5,
  daysMissed: 0,
};

function Avatar({ size, ring = false }: { size: number; ring?: boolean }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        ring && styles.avatarRing,
      ]}
    >
      <Ionicons name="person" size={size * 0.6} color="#E9E9E9" />
    </View>
  );
}

type FieldProps = {
  label: string;
  href: Href;
  children: React.ReactNode;
};

function Field({ label, href, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        style={({ pressed }) => [styles.fieldBox, pressed && styles.pressed]}
        onPress={() => router.push(href)}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${label}`}
      >
        <View style={styles.fieldValueRow}>{children}</View>
        <Ionicons name="pencil-outline" size={18} color={COLORS.text} />
      </Pressable>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}


export default function Profile() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Brand */}
      <View style={styles.brandRow}>
        <MaterialCommunityIcons name="dumbbell" size={20} color={COLORS.green} />
        <Text style={styles.brandText}>PolyFit</Text>
        <View style={styles.brandDot} />
      </View>

      <Text style={styles.title}>Profile</Text>

      {/* Identity card */}
      <View style={styles.identityCard}>
        <Avatar size={60} ring />
        <View style={styles.identityText}>
          <Text style={styles.identityName}>{USER.name}</Text>
          <Text style={styles.identityHandle}>@{USER.username}</Text>
        </View>
      </View>

      {/* Account card */}
      <View style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View>
            <Avatar size={44} />
            <View style={styles.avatarEditBadge}>
              <Ionicons name="pencil" size={11} color={COLORS.text} />
            </View>
          </View>
          <View>
            <Text style={styles.accountTitle}>Account</Text>
            <Text style={styles.accountSubtitle}>Manage your saved account</Text>
          </View>
        </View>

        <View style={styles.accountBody}>
          <Field label="Name" href="/profile/edit_profile">
            <Text style={styles.fieldValue}>{USER.name}</Text>
          </Field>
          <Field label="Email" href="/profile/edit_profile">
            <Text style={styles.fieldValue}>{USER.email}</Text>
          </Field>
          <Field label="Gender" href="/profile/edit_profile">
            <Text style={styles.fieldValue}>{USER.gender}</Text>
          </Field>
          <Field label="Measurements" href="/profile/change_measurements">
            <Text style={styles.fieldValue}>{USER.heightFeet}</Text>
            <Text style={styles.fieldUnit}>feet</Text>
            <Text style={styles.fieldValue}>{USER.heightInches}</Text>
            <Text style={styles.fieldUnit}>inches</Text>
          </Field>
        </View>
      </View>

      {/* More */}
      <Text style={styles.moreHeading}>More</Text>
      <View style={styles.moreCard}>
        <Link href="/profile/settings" asChild>
          <Pressable style={styles.settingsLink} accessibilityRole="link">
            <Text style={styles.settingsText}>Settings</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.text} />
          </Pressable>
        </Link>

        <View style={styles.statsRow}>
          <Stat value={USER.daysCompleted} label="Days Completed" />
          <Stat value={USER.daysMissed} label="Days Missed" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  pressed: { opacity: 0.6 },

  // Brand + title
  brandRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  brandText: { fontFamily: "SourceSans3Bold", fontSize: 18, color: COLORS.green },
  brandDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.accent },
  title: { fontFamily: "SourceSans3Bold", fontSize: 34, color: COLORS.green, marginBottom: 16 },

  // Avatar
  avatar: { backgroundColor: COLORS.avatar, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarRing: { borderWidth: 3, borderColor: "#FFFFFF" },
  avatarEditBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },

  // Identity card
  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: COLORS.green,
    borderRadius: 6,
    padding: 18,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  identityText: { gap: 4 },
  identityName: { fontFamily: "SourceSans3Bold", fontSize: 17, color: "#FFFFFF" },
  identityHandle: { fontFamily: "SourceSans3", fontSize: 13, color: "#D4DCD7" },

  // Account card
  accountCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginBottom: 24,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  accountTitle: { fontFamily: "SourceSans3Bold", fontSize: 22, color: COLORS.green },
  accountSubtitle: { fontFamily: "SourceSans3", fontSize: 14, color: COLORS.muted },
  accountBody: { padding: 18, gap: 14 },

  // Fields
  field: { gap: 6 },
  fieldLabel: { fontFamily: "SourceSans3Bold", fontSize: 14, color: COLORS.green },
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fieldValueRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  fieldValue: { fontFamily: "SourceSans3Bold", fontSize: 13, color: COLORS.text },
  fieldUnit: { fontFamily: "SourceSans3", fontSize: 13, color: "#6B6B63" },

  // More
  moreHeading: { fontFamily: "SourceSans3Bold", fontSize: 22, color: "#5E7A6B", marginBottom: 12 },
  moreCard: { backgroundColor: COLORS.card, borderRadius: 6, padding: 16 },
  settingsLink: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  settingsText: { fontFamily: "SourceSans3Bold", fontSize: 16, color: COLORS.green },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  stat: { alignItems: "center" },
  statValue: { fontFamily: "SourceSans3Bold", fontSize: 64, color: "#111" },
  statLabel: { fontFamily: "SourceSans3Bold", fontSize: 20, color: COLORS.text },
});
