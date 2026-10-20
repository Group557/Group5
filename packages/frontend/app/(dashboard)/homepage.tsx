import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  BrandMark,
  EmptyState,
  Icon,
  Screen,
  colors,
  formatDate,
  formatGreeting,
  radius,
  space,
  typography
} from "../../theme";

const WEEKDAY_INITIALS = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * The member home screen.
 *
 * The greeting is the only thing on a dark surface, the week strip
 * is the only other accent, and everything below it is quiet. That
 * keeps the emphasis on the greeting instead of spreading it across
 * five competing blocks.
 */
export default function HomeScreen() {
  const now = useMemo(() => new Date(), []);

  // Monday first, matching the order the days are shown in.
  const week = useMemo(() => {
    const today = now.getDay();
    const daysFromMonday = (today + 6) % 7;

    return WEEKDAY_INITIALS.map((initial, index) => {
      const offset = index - daysFromMonday;
      const date = new Date(now);
      date.setDate(now.getDate() + offset);

      return {
        initial,
        state:
          offset < 0
            ? "done"
            : offset === 0
              ? "today"
              : "upcoming"
      } as const;
    });
  }, [now]);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <BrandMark />

        <View style={styles.avatar}>
          <Icon
            name={{
              ios: "person.fill",
              android: "person",
              web: "person"
            }}
            size={20}
            color={colors.onDark}
            weight="regular"
          />
        </View>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.date}>{formatDate(now)}</Text>
        <Text style={styles.greetingText}>
          {formatGreeting(now)}
        </Text>
      </View>

      <View style={styles.streak}>
        <View style={styles.streakHead}>
          <Icon
            name={{
              ios: "flame.fill",
              android: "local_fire_department",
              web: "local_fire_department"
            }}
            size={18}
            color={colors.goldText}
            weight="regular"
          />
          <Text style={styles.streakNumber}>8</Text>
          <Text style={styles.streakLabel}>DAY STREAK</Text>
        </View>

        <View style={styles.days}>
          {week.map((day, index) => (
            <View
              key={`${day.initial}-${index}`}
              style={styles.day}>
              <View
                style={[
                  styles.dayMarker,
                  day.state === "done" ? styles.dayDone : null,
                  day.state === "today" ? styles.dayToday : null
                ]}>
                {day.state === "done" ? (
                  <Icon
                    name={{
                      ios: "checkmark",
                      android: "check",
                      web: "check"
                    }}
                    size={14}
                    color={colors.forest}
                    weight="bold"
                  />
                ) : null}
              </View>
              <Text style={styles.dayLabel}>{day.initial}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          My Upcoming Bookings
        </Text>
        <View style={styles.panel}>
          <EmptyState
            icon={{
              ios: "calendar",
              android: "calendar_month",
              web: "calendar_month"
            }}
            title="No bookings yet"
            body="Your scheduled workouts will appear here."
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.panel}>
          <EmptyState
            icon={{
              ios: "bell",
              android: "notifications",
              web: "notifications"
            }}
            title="Nothing new"
            body="Updates and reminders will appear here."
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: space.sm,
    paddingBottom: space.xxl
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center"
  },

  greeting: {
    marginBottom: space.xl
  },
  date: {
    ...typography.eyebrow,
    color: colors.sage,
    textTransform: "uppercase"
  },
  greetingText: {
    ...typography.display,
    color: colors.ink,
    marginTop: space.xs
  },

  streak: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: space.lg,
    marginBottom: space.xxl
  },
  streakHead: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: space.lg
  },
  streakNumber: {
    ...typography.title,
    color: colors.ink,
    marginLeft: space.sm
  },
  streakLabel: {
    ...typography.label,
    color: colors.inkMuted,
    marginLeft: space.xs
  },
  days: {
    flexDirection: "row"
  },
  day: {
    flex: 1,
    alignItems: "center"
  },
  dayMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm
  },
  dayDone: {
    backgroundColor: colors.mint
  },
  dayToday: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sage
  },
  dayLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.inkMuted
  },

  section: {
    marginBottom: space.xxl
  },
  sectionTitle: {
    ...typography.title,
    color: colors.ink,
    marginBottom: space.md
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: space.sm
  }
});
