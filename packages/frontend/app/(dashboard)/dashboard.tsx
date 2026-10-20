import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { supabase } from "../../../../utils/supabase";
import { useAuth } from "../../context/AuthProvider";
import {
  BrandMark,
  Button,
  Icon,
  Screen,
  colors,
  space,
  typography
} from "../../theme";

export default function AccountScreen() {
  const { session } = useAuth();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setMessage("");
    setBusy(true);

    try {
      const { error } = await supabase.auth.signOut({
        scope: "local"
      });

      if (error) {
        setMessage(error.message);
      }
    } catch {
      setMessage("Unable to log out. Please try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll>
      <View style={styles.brand}>
        <BrandMark />
      </View>

      <Text style={styles.title}>Account</Text>

      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Icon
            name={{
              ios: "person.fill",
              android: "person",
              web: "person"
            }}
            size={22}
            color={colors.forest}
          />
        </View>

        <View style={styles.cardText}>
          <Text style={styles.cardLabel}>Signed in as</Text>
          <Text style={styles.cardValue} numberOfLines={1}>
            {session?.user.email ?? "Not signed in"}
          </Text>
        </View>
      </View>

      {message ? (
        <View
          style={styles.message}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert">
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      <Button
        label="Log out"
        variant="secondary"
        onPress={() => {
          void handleLogout();
        }}
        loading={busy}
        style={styles.logout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    paddingTop: space.md,
    paddingBottom: space.xxl
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink,
    marginBottom: space.lg
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: space.lg
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceSage,
    alignItems: "center",
    justifyContent: "center",
    marginRight: space.md
  },
  cardText: {
    flex: 1,
    minWidth: 0
  },
  cardLabel: {
    ...typography.caption,
    color: colors.inkMuted
  },
  cardValue: {
    ...typography.bodyStrong,
    color: colors.ink,
    marginTop: 2
  },
  message: {
    marginTop: space.lg,
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    padding: space.md
  },
  messageText: {
    ...typography.caption,
    color: colors.danger
  },
  logout: {
    marginTop: space.xxl
  }
});
