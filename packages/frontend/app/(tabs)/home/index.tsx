import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import PolyFitLogo from "@/components/ui/PolyFitLogo";
import { globalStyles } from "@/constants/globalStyles";
import { palette } from "@/constants/theme";
import { supabase } from "../../../../../utils/supabase";
export default function HomeScreen() {
  const [message, setMessage] = useState("");

  const todayLabel = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "2-digit"
    })
    .toUpperCase()
    .replace(",", " ·");

  async function handleLogout() {
    // TODO: Clear the previous message.
    setMessage("");

    try {
      // TODO: Await supabase.auth.signOut({ scope: "local" }).
      const { error } = await supabase.auth.signOut({
        scope: "local"
      });
      // Destructure "error" from the result.
      if (error) {
        setMessage(error.message);
      }
      // TODO: If there is an error, display its message.
    } catch {
      // TODO: Display "Unable to log out. Please try again."
      setMessage("Unable to log out. Please try again");
    }
  }
  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={globalStyles.screenContent}>
      {/* App name */}
      <PolyFitLogo style={styles.logoRow} />

      {/* Greeting */}
      <View style={styles.helloBox}>
        <Text style={styles.dateText}>{todayLabel}</Text>

        <View style={styles.greetingRow}>
          <Text style={styles.helloText}>HI GROUP5!</Text>

          <View style={styles.profileCircle}>
            <View style={styles.profileHead} />
            <View style={styles.profileBody} />
          </View>
        </View>
      </View>

      {/* Streak */}
      <View style={styles.streakBox}>
        <View style={styles.streakInfo}>
          <View>
            <Text style={styles.streakNumber}>8</Text>
            <Text style={styles.streakLabel}>DAY STREAK</Text>
          </View>
        </View>

        <View style={styles.daysRow}>
          <View style={styles.dayColumn}>
            <View
              style={[styles.dayCircle, styles.completedDay]}>
              <Text style={styles.check}>✓</Text>
            </View>
            <Text style={styles.dayLabel}>M</Text>
          </View>

          <View style={styles.dayColumn}>
            <View
              style={[styles.dayCircle, styles.completedDay]}>
              <Text style={styles.check}>✓</Text>
            </View>
            <Text style={styles.dayLabel}>T</Text>
          </View>

          <View style={styles.dayColumn}>
            <View
              style={[styles.dayCircle, styles.completedDay]}>
              <Text style={styles.check}>✓</Text>
            </View>
            <Text style={styles.dayLabel}>W</Text>
          </View>

          <View style={styles.dayColumn}>
            <View style={[styles.dayCircle, styles.currentDay]}>
              <Text style={styles.currentDot}>•</Text>
            </View>
            <Text style={styles.dayLabel}>T</Text>
          </View>

          <View style={styles.dayColumn}>
            <View style={styles.dayCircle}>
              <Text style={styles.futureDot}>•</Text>
            </View>
            <Text style={styles.dayLabel}>F</Text>
          </View>

          <View style={styles.dayColumn}>
            <View style={styles.dayCircle}>
              <Text style={styles.futureDot}>•</Text>
            </View>
            <Text style={styles.dayLabel}>S</Text>
          </View>

          <View style={styles.dayColumn}>
            <View style={styles.dayCircle}>
              <Text style={styles.futureDot}>•</Text>
            </View>
            <Text style={styles.dayLabel}>S</Text>
          </View>
        </View>
      </View>

      {/* Upcoming bookings */}
      <View style={styles.largeBox}>
        <Text style={styles.cardTitle}>
          My Upcoming Bookings
        </Text>
        <Text style={styles.cardSubtitle}>
          Your scheduled workouts will appear here.
        </Text>
      </View>

      {/* Notifications */}
      <View style={styles.largeBox}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.cardSubtitle}>
          Updates and reminders will appear here.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={handleLogout}
        style={({ pressed }) => [
          globalStyles.secondaryButton,
          styles.logoutButton,
          pressed && globalStyles.pressed
        ]}>
        <Text style={globalStyles.secondaryButtonText}>Logout</Text>
      </Pressable>

      {message ? (
        <Text
          accessibilityRole="alert"
          style={globalStyles.errorText}>
          {message}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logoRow: {
    marginBottom: 28
  },

  helloBox: {
    backgroundColor: palette.forest,
    borderRadius: 5,
    padding: 20,
    marginBottom: 20
  },
  dateText: {
    color: palette.onDark,
    fontSize: 13,
    fontWeight: "700"
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8
  },
  helloText: {
    color: palette.onDark,
    fontSize: 29,
    fontWeight: "800"
  },
  profileCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: palette.gold,
    backgroundColor: palette.avatar,
    alignItems: "center",
    justifyContent: "center"
  },
  profileHead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.onDark,
    marginBottom: 3
  },
  profileBody: {
    width: 34,
    height: 19,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: palette.onDark
  },

  streakBox: {
    backgroundColor: palette.chrome,
    borderRadius: 5,
    padding: 16,
    marginBottom: 28,
    flexDirection: "row",
    alignItems: "center"
  },
  streakInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: 135
  },
  streakNumber: {
    color: palette.inkMuted,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 28
  },
  streakLabel: {
    color: palette.inkMuted,
    fontSize: 11,
    fontWeight: "800"
  },
  daysRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dayColumn: {
    alignItems: "center"
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: palette.surfaceSage,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6
  },
  completedDay: {
    backgroundColor: palette.mint
  },
  currentDay: {
    backgroundColor: palette.canvas,
    borderWidth: 2,
    borderColor: palette.sage
  },
  check: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  currentDot: {
    color: palette.ink,
    fontSize: 22
  },
  futureDot: {
    color: palette.inkMuted,
    fontSize: 18
  },
  dayLabel: {
    color: palette.inkMuted,
    fontSize: 11,
    fontWeight: "700"
  },

  logoutButton: {
    marginTop: 20
  },

  largeBox: {
    height: 156,
    backgroundColor: palette.sage,
    borderRadius: 5,
    padding: 18,
    marginBottom: 20
  },
  cardTitle: {
    color: palette.onDark,
    fontSize: 16,
    fontWeight: "700"
  },
  cardSubtitle: {
    color: palette.onDarkMuted,
    fontSize: 13,
    marginTop: 8
  }
});
