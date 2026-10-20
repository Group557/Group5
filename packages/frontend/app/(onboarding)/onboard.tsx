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

export default function Onboarding() {
  const { session, refreshProfile } = useAuth();

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    // Already saving, so stop.
    if (saving) {
      return;
    }

    // No session, so ask the user to sign in.
    if (!session) {
      setMessage("Please sign in to perform this action");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      // Mark the profile as onboarded.
      const { data: profile, error: queryError } =
        await supabase
          .from("profiles")
          .update({ onboarded: true })
          .eq("id", session.user.id)
          .select("onboarded")
          .single();

      if (queryError) {
        setMessage(queryError.message);
        return;
      }

      if (!profile?.onboarded) {
        setMessage("Your onboarded status could not be saved.");
        return;
      }

      // Refresh the provider's profile information.
      await refreshProfile();
    } catch {
      setMessage("Unable to save. Please try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll>
      <View style={styles.brand}>
        <BrandMark />
      </View>

      <View style={styles.heading}>
        <Text style={styles.title}>Welcome to PolyFit</Text>
        <Text style={styles.subtitle}>
          Track your workouts, build your exercise library, and
          see how busy the recreation center is before you go.
        </Text>
      </View>

      <View style={styles.points}>
        <Point
          icon={{
            ios: "figure.run",
            android: "directions_run",
            web: "directions_run"
          }}
          title="Your workouts"
          body="Combine saved exercises into a plan you can follow."
        />
        <Point
          icon={{
            ios: "building.2",
            android: "location_city",
            web: "location_city"
          }}
          title="Live rec center crowd"
          body="See how full it is right now, and when it is quietest."
        />
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
        label="Get started"
        onPress={() => {
          void handleSubmit();
        }}
        loading={saving}
        style={styles.cta}
      />
    </Screen>
  );
}

function Point({
  icon,
  title,
  body
}: {
  icon: {
    ios: string;
    android: string;
    web: string;
  };
  title: string;
  body: string;
}) {
  return (
    <View style={styles.point}>
      <View style={styles.pointIcon}>
        <Icon name={icon} size={20} color={colors.forest} />
      </View>

      <View style={styles.pointText}>
        <Text style={styles.pointTitle}>{title}</Text>
        <Text style={styles.pointBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    paddingTop: space.md,
    paddingBottom: space.xxl
  },
  heading: {
    marginBottom: space.xxl
  },
  title: {
    ...typography.display,
    color: colors.ink
  },
  subtitle: {
    ...typography.body,
    color: colors.inkMuted,
    marginTop: space.sm,
    maxWidth: 320
  },

  points: {
    gap: space.lg
  },
  point: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  pointIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceSage,
    alignItems: "center",
    justifyContent: "center",
    marginRight: space.md
  },
  pointText: {
    flex: 1
  },
  pointTitle: {
    ...typography.bodyStrong,
    color: colors.ink
  },
  pointBody: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: 2
  },

  message: {
    marginTop: space.xl,
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    padding: space.md
  },
  messageText: {
    ...typography.caption,
    color: colors.danger
  },

  cta: {
    marginTop: space.xxl
  }
});
