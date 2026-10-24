import { Ionicons } from "@expo/vector-icons";
import { Link, router, Stack, type Href } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type SettingsRow = {
  label: string;
  href: Href;
};

const ACCOUNT_ROWS: SettingsRow[] = [
  { label: "Edit profile", href: "/settings/edit_profile" },
  { label: "Change password", href: "/settings/change_password" },
  { label: "Change measurements", href: "/settings/change_measurements" },
];

export default function Settings() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Settings" }} />

      <Text style={styles.title}>Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {ACCOUNT_ROWS.map((row) => (
          <Pressable
            key={row.label}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => router.push(row.href)}
            accessibilityRole="button"
          >
            <Text style={styles.rowText}>{row.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flex: 1, padding: 24, paddingTop: 60 }}>
      <Link href="/settings" asChild>
        <Pressable style={{ alignSelf: "flex-end" }} accessibilityLabel="Settings">
          <Ionicons name="settings-outline" size={26} color="#4B4B4B" />
        </Pressable>
      </Link>

      <Text style={{ fontSize: 30 }}>Profile</Text>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E4E3D3",
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontFamily: "SourceSans3Bold",
    fontSize: 30,
    marginBottom: 28,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: "SourceSans3Bold",
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  pressed: {
    opacity: 0.6,
  },
  rowText: {
    fontFamily: "SourceSans3",
    fontSize: 16,
  },
  chevron: {
    fontSize: 20,
    color: "#999",
  },
});
