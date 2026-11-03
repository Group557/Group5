import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon, { type SymbolName } from "@/components/ui/Icon";
import {
  layout,
  palette,
  radius,
  space,
  text
} from "@/constants/theme";
import { supabase } from "../../../../../utils/supabase";
import { useAuth } from "../../../context/AuthProvider";

/* ------------------------------------------------------------------ *
 * Crowd data
 *
 * Mock hourly readings for the recreation center. The shape mirrors
 * the API payload (`snake_case`) so the real endpoint can replace
 * this constant without touching the rendering code.
 * ------------------------------------------------------------------ */

type CrowdStatus = "Low" | "Moderate" | "High";

type CrowdReading = {
  hour: number;
  time_label: string;
  occupancy_percentage: number;
  status: CrowdStatus;
  estimated_wait_minutes: number;
};

const CROWD_BY_HOUR: CrowdReading[] = [
  {
    hour: 0,
    time_label: "12 AM",
    occupancy_percentage: 4,
    status: "Low",
    estimated_wait_minutes: 0
  },
  {
    hour: 1,
    time_label: "1 AM",
    occupancy_percentage: 2,
    status: "Low",
    estimated_wait_minutes: 0
  },
  {
    hour: 2,
    time_label: "2 AM",
    occupancy_percentage: 0,
    status: "Low",
    estimated_wait_minutes: 0
  },
  {
    hour: 3,
    time_label: "3 AM",
    occupancy_percentage: 3,
    status: "Low",
    estimated_wait_minutes: 0
  },
  {
    hour: 4,
    time_label: "4 AM",
    occupancy_percentage: 16,
    status: "Low",
    estimated_wait_minutes: 0
  },
  {
    hour: 5,
    time_label: "5 AM",
    occupancy_percentage: 32,
    status: "Low",
    estimated_wait_minutes: 0
  },
  {
    hour: 6,
    time_label: "6 AM",
    occupancy_percentage: 72,
    status: "Moderate",
    estimated_wait_minutes: 10
  },
  {
    hour: 7,
    time_label: "7 AM",
    occupancy_percentage: 86,
    status: "High",
    estimated_wait_minutes: 25
  },
  {
    hour: 8,
    time_label: "8 AM",
    occupancy_percentage: 60,
    status: "Moderate",
    estimated_wait_minutes: 10
  },
  {
    hour: 9,
    time_label: "9 AM",
    occupancy_percentage: 50,
    status: "Moderate",
    estimated_wait_minutes: 10
  },
  {
    hour: 10,
    time_label: "10 AM",
    occupancy_percentage: 43,
    status: "Moderate",
    estimated_wait_minutes: 0
  },
  {
    hour: 11,
    time_label: "11 AM",
    occupancy_percentage: 46,
    status: "Moderate",
    estimated_wait_minutes: 0
  },
  {
    hour: 12,
    time_label: "12 PM",
    occupancy_percentage: 55,
    status: "Moderate",
    estimated_wait_minutes: 10
  },
  {
    hour: 13,
    time_label: "1 PM",
    occupancy_percentage: 45,
    status: "Moderate",
    estimated_wait_minutes: 0
  },
  {
    hour: 14,
    time_label: "2 PM",
    occupancy_percentage: 47,
    status: "Moderate",
    estimated_wait_minutes: 0
  },
  {
    hour: 15,
    time_label: "3 PM",
    occupancy_percentage: 47,
    status: "Moderate",
    estimated_wait_minutes: 0
  },
  {
    hour: 16,
    time_label: "4 PM",
    occupancy_percentage: 66,
    status: "Moderate",
    estimated_wait_minutes: 10
  },
  {
    hour: 17,
    time_label: "5 PM",
    occupancy_percentage: 87,
    status: "High",
    estimated_wait_minutes: 25
  },
  {
    hour: 18,
    time_label: "6 PM",
    occupancy_percentage: 90,
    status: "High",
    estimated_wait_minutes: 25
  },
  {
    hour: 19,
    time_label: "7 PM",
    occupancy_percentage: 82,
    status: "High",
    estimated_wait_minutes: 25
  },
  {
    hour: 20,
    time_label: "8 PM",
    occupancy_percentage: 64,
    status: "Moderate",
    estimated_wait_minutes: 10
  },
  {
    hour: 21,
    time_label: "9 PM",
    occupancy_percentage: 45,
    status: "Moderate",
    estimated_wait_minutes: 0
  },
  {
    hour: 22,
    time_label: "10 PM",
    occupancy_percentage: 25,
    status: "Low",
    estimated_wait_minutes: 0
  },
  {
    hour: 23,
    time_label: "11 PM",
    occupancy_percentage: 8,
    status: "Low",
    estimated_wait_minutes: 0
  }
];

type OpenHours = { open: number; close: number };

/** The chart always spans 6 AM until midnight. */
const CHART_START_HOUR = 6;
const CHART_END_HOUR = 24;

/**
 * Opening hours by weekday (0 = Sunday). Weekdays run 6 AM until
 * midnight, Saturdays 8 AM until 10 PM, and Sundays are closed.
 */
const HOURS_BY_DAY: (OpenHours | null)[] = [
  null,
  { open: 6, close: 24 },
  { open: 6, close: 24 },
  { open: 6, close: 24 },
  { open: 6, close: 24 },
  { open: 6, close: 24 },
  { open: 8, close: 22 }
];

type SpecialHours = {
  /** First and last day, inclusive, as `YYYY-MM-DD`. */
  start: string;
  end: string;
  hours: OpenHours | null;
};

/**
 * Holiday and break hours for the 2026–27 academic year
 * (Aug 24, 2026 to May 30, 2027). Each range replaces the weekday
 * hours on those dates; null means closed.
 */
const SPECIAL_HOURS: SpecialHours[] = [
  {
    start: "2026-06-17",
    end: "2026-06-17",
    hours: { open: 7, close: 19 }
  },
  {
    start: "2026-09-20",
    end: "2026-09-20",
    hours: { open: 12, close: 22 }
  },
  {
    start: "2026-11-23",
    end: "2026-11-25",
    hours: { open: 6, close: 19 }
  },
  {
    start: "2026-11-27",
    end: "2026-11-27",
    hours: { open: 12, close: 19 }
  },
  {
    start: "2026-12-12",
    end: "2026-12-13",
    hours: { open: 8, close: 19 }
  },
  {
    start: "2026-12-14",
    end: "2026-12-18",
    hours: { open: 6, close: 19 }
  },
  {
    start: "2026-12-19",
    end: "2026-12-20",
    hours: { open: 8, close: 19 }
  },
  {
    start: "2026-12-21",
    end: "2026-12-23",
    hours: { open: 6, close: 19 }
  },
  { start: "2026-12-24", end: "2027-01-01", hours: null },
  {
    start: "2027-01-02",
    end: "2027-01-03",
    hours: { open: 8, close: 19 }
  },
  {
    start: "2027-01-04",
    end: "2027-01-22",
    hours: { open: 6, close: 21 }
  },
  {
    start: "2027-03-15",
    end: "2027-03-19",
    hours: { open: 6, close: 19 }
  }
];

function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Holidays the center closes for every year: Independence Day
 * (Jul 4), Labor Day (first Monday of September) and Thanksgiving
 * (fourth Thursday of November).
 */
function isAnnualHoliday(date: Date) {
  const month = date.getMonth();
  const day = date.getDate();
  const weekday = date.getDay();

  if (month === 6 && day === 4) {
    return true;
  }
  if (month === 8 && weekday === 1 && day <= 7) {
    return true;
  }
  return (
    month === 10 && weekday === 4 && day >= 22 && day <= 28
  );
}

function hoursForDate(date: Date) {
  if (isAnnualHoliday(date)) {
    return null;
  }
  // `YYYY-MM-DD` strings sort the same way as the dates they name.
  const key = dateKey(date);
  const special = SPECIAL_HOURS.find(
    (range) => key >= range.start && key <= range.end
  );
  return special ? special.hours : HOURS_BY_DAY[date.getDay()];
}

function isOpenAt(hours: OpenHours | null, hour: number) {
  return (
    hours !== null && hour >= hours.open && hour < hours.close
  );
}

/** Hours the center is closed always read as empty. */
function readingsForDay(hours: OpenHours | null) {
  return CROWD_BY_HOUR.map((reading) =>
    isOpenAt(hours, reading.hour)
      ? reading
      : {
          ...reading,
          occupancy_percentage: 0,
          status: "Low" as const,
          estimated_wait_minutes: 0
        }
  );
}

function formatHour(hour: number) {
  if (hour === 0 || hour === 24) {
    return "Midnight";
  }
  if (hour === 12) {
    return "Noon";
  }
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function readingForHour(
  readings: CrowdReading[],
  hour: number
) {
  return (
    readings.find((reading) => reading.hour === hour) ??
    readings[0]
  );
}

/** The quietest hour of the day is the best time to visit. */
function quietestReading(readings: CrowdReading[]) {
  if (readings.length === 0) {
    return null;
  }
  return readings.reduce((quietest, reading) =>
    reading.occupancy_percentage < quietest.occupancy_percentage
      ? reading
      : quietest
  );
}

/** Returns null when every hour is empty, e.g. on a closed day. */
function busiestReading(readings: CrowdReading[]) {
  const busiest = readings.reduce((max, reading) =>
    reading.occupancy_percentage > max.occupancy_percentage
      ? reading
      : max
  );
  return busiest.occupancy_percentage > 0 ? busiest : null;
}

/**
 * Crowd status needs a tone for light surfaces and one for the dark
 * hero card. Every pair below clears WCAG AA for text and 3:1 for
 * graphical elements.
 */
const STATUS_TONE: Record<
  CrowdStatus,
  { onLight: string; onDark: string }
> = {
  Low: { onLight: "#4A7361", onDark: "#87CDC2" },
  Moderate: { onLight: "#8A5E08", onDark: "#E8B54A" },
  High: { onLight: "#A63A24", onDark: "#F5AEA4" }
};

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function formatDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function formatGreeting(date: Date) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

function formatWait(minutes: number) {
  return minutes > 0 ? `${minutes} min` : "No wait";
}

/* ------------------------------------------------------------------ *
 * UI primitives
 * ------------------------------------------------------------------ */

type StatTileProps = {
  icon: SymbolName;
  iconBackground: string;
  iconColor: string;
  label: string;
  value: string;
};

function StatTile({
  icon,
  iconBackground,
  iconColor,
  label,
  value
}: StatTileProps) {
  return (
    <View style={styles.tile}>
      <View
        style={[
          styles.tileIcon,
          { backgroundColor: iconBackground }
        ]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Hourly occupancy chart
 * ------------------------------------------------------------------ */

const PLOT_HEIGHT = 96;
/** Fixed width so every axis label can be centred on its bar. */
const AXIS_LABEL_WIDTH = 44;

type CrowdChartProps = {
  data: CrowdReading[];
  currentHour: number;
};

function barColor(
  reading: CrowdReading,
  peakHour: number | null,
  currentHour: number
) {
  if (reading.hour === currentHour) {
    return palette.goldText;
  }
  if (peakHour !== null && reading.hour === peakHour) {
    return palette.forest;
  }
  return palette.chartBar;
}

/**
 * Labels every third hour, but always labels the current hour and
 * clears the ticks around it so nothing collides.
 */
function axisLabelIndexes(
  data: CrowdReading[],
  currentHour: number
) {
  const indexes = new Set<number>();

  for (let index = 0; index < data.length; index += 1) {
    if (index % 3 === 0) {
      indexes.add(index);
    }
  }

  const currentIndex = data.findIndex(
    (reading) => reading.hour === currentHour
  );

  if (currentIndex >= 0) {
    for (let offset = -2; offset <= 2; offset += 1) {
      indexes.delete(currentIndex + offset);
    }
    indexes.add(currentIndex);
  }

  return indexes;
}

function CrowdChart({ data, currentHour }: CrowdChartProps) {
  const peak = busiestReading(data);
  const labelIndexes = axisLabelIndexes(data, currentHour);
  // The bars are purely visual, so screen readers get a summary.
  const summary = peak
    ? `Hourly occupancy chart. Busiest at ${peak.time_label}, ${peak.occupancy_percentage} percent full.`
    : "Hourly occupancy chart. Closed today.";

  return (
    <View
      style={styles.chart}
      accessible
      accessibilityRole="image"
      accessibilityLabel={summary}>
      <View style={styles.chartMeta}>
        <Text style={styles.chartMetaLabel}>
          Hourly occupancy
        </Text>
      </View>

      <View style={styles.chartPlot}>
        {data.map((reading) => (
          <View key={reading.hour} style={styles.chartSlot}>
            <View
              style={[
                styles.chartBar,
                {
                  height: Math.max(
                    3,
                    (reading.occupancy_percentage / 100) *
                      PLOT_HEIGHT
                  ),
                  backgroundColor: barColor(
                    reading,
                    peak?.hour ?? null,
                    currentHour
                  )
                }
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.chartAxis}>
        {data.map((reading, index) =>
          labelIndexes.has(index) ? (
            <Text
              key={reading.hour}
              numberOfLines={1}
              style={[
                styles.chartAxisLabel,
                {
                  left: `${((index + 0.5) / data.length) * 100}%`,
                  marginLeft: -AXIS_LABEL_WIDTH / 2
                },
                reading.hour === currentHour &&
                  styles.chartAxisLabelCurrent
              ]}>
              {reading.time_label}
            </Text>
          ) : null
        )}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export default function RecCenterScreen() {
  // Insets come from the provider Expo Router mounts at the root.
  const insets = useSafeAreaInsets();
  const now = new Date();
  const { session } = useAuth();
  const userId = session?.user.id;
  const [loadedName, setLoadedName] = useState<{
    userId: string;
    firstName: string | null;
  } | null>(null);
  // Ignore a name loaded for a previous user.
  const firstName =
    loadedName !== null && loadedName.userId === userId
      ? loadedName.firstName
      : null;

  // Load the first name saved during onboarding for the greeting.
  useEffect(() => {
    let cancelled = false;

    if (userId == null) {
      return;
    }

    async function loadFirstName(id: string) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", id)
        .single();

      if (!cancelled) {
        setLoadedName({
          userId: id,
          firstName: profile?.first_name?.trim() || null
        });
      }
    }
    void loadFirstName(userId);
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleRecIdPress = () => {
    // TODO: implement rec ID scan-in
  };

  const hoursToday = hoursForDate(now);
  const isOpenNow = isOpenAt(hoursToday, now.getHours());
  const readingsToday = readingsForDay(hoursToday);
  const chartWindow = readingsToday.filter(
    (reading) =>
      reading.hour >= CHART_START_HOUR &&
      reading.hour < CHART_END_HOUR
  );

  const current = readingForHour(readingsToday, now.getHours());
  const best = quietestReading(
    readingsToday.filter((reading) =>
      isOpenAt(hoursToday, reading.hour)
    )
  );
  const statusTone = STATUS_TONE[current.status];

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, layout.minTopInset),
          paddingLeft: insets.left,
          paddingRight: insets.right
        }
      ]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + space.xxl }
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>
              {formatDate(now)}
            </Text>
            <Text style={styles.greeting} numberOfLines={1}>
              {firstName
                ? `${formatGreeting(now)}, ${firstName}`
                : formatGreeting(now)}
            </Text>
          </View>
        </View>

        {/* My Rec ID */}
        <Pressable
          onPress={handleRecIdPress}
          style={({ pressed }) => [
            styles.recIdRow,
            pressed && styles.pressed
          ]}
          accessibilityRole="button"
          accessibilityLabel="My Rec ID"
          accessibilityHint="Opens the scanner to check in at the recreation center">
          <View style={styles.recIdIcon}>
            <Icon
              name={{
                ios: "qrcode.viewfinder",
                android: "qr_code_scanner",
                web: "qr_code_scanner"
              }}
              size={22}
              color={palette.goldText}
            />
          </View>
          <View style={styles.recIdText}>
            <Text style={styles.recIdTitle}>My Rec ID</Text>
            <Text style={styles.recIdSubtitle}>
              Tap to scan in
            </Text>
          </View>
        </Pressable>

        {/* Live crowd card */}
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroEyebrow}>
              Recreation Center
            </Text>
            {isOpenNow ? (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text
                  style={styles.liveText}
                  accessibilityLabel="Live">
                  LIVE
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.heroLabel}>Crowd level</Text>

          {isOpenNow ? (
            <View style={styles.heroValueRow}>
              <Text
                style={styles.heroValue}
                accessibilityLabel={`${current.occupancy_percentage} percent full, ${current.status}`}>
                {`${current.occupancy_percentage}%`}
              </Text>
              <View style={styles.statusChip}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusTone.onDark }
                  ]}
                />
                <Text
                  style={[
                    styles.statusLabel,
                    { color: statusTone.onDark }
                  ]}>
                  {current.status}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.heroValueRow}>
              <Text style={styles.heroValue}>Closed</Text>
            </View>
          )}

          <View style={styles.capacityTrack}>
            {isOpenNow ? (
              <View
                style={[
                  styles.capacityFill,
                  {
                    width: `${Math.max(2, current.occupancy_percentage)}%`,
                    backgroundColor: statusTone.onDark
                  }
                ]}
              />
            ) : null}
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterLabel}>
              Best time to go
            </Text>
            <Text style={styles.heroFooterValue}>
              {best ? best.time_label : "Closed today"}
            </Text>
          </View>
        </View>

        {/* Today's activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {"Today's activity"}
          </Text>
          <CrowdChart
            data={chartWindow}
            currentHour={now.getHours()}
          />
        </View>

        {/* Info tiles */}
        <View style={styles.tiles}>
          <StatTile
            icon={{
              ios: "clock",
              android: "schedule",
              web: "schedule"
            }}
            iconBackground={palette.surfaceSage}
            iconColor={palette.sage}
            label={hoursToday ? "Closes at" : "Today"}
            value={
              hoursToday
                ? formatHour(hoursToday.close)
                : "Closed"
            }
          />
          <StatTile
            icon={{
              ios: "hourglass",
              android: "hourglass",
              web: "hourglass"
            }}
            iconBackground={palette.goldSoft}
            iconColor={palette.goldText}
            label="Current wait"
            value={
              isOpenNow
                ? formatWait(current.estimated_wait_minutes)
                : "Closed"
            }
          />
        </View>

        {/* Remove once the real crowd endpoint is connected. */}
        <Text style={styles.mockNote}>
          Crowd levels shown are sample data based on typical
          gym traffic found online, not readings from our rec
          center. Actual crowds may be busier or quieter.
        </Text>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.canvas
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: layout.screenTop
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.lg
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  // The date sits higher; the greeting's larger margin keeps it in place.
  headerEyebrow: {
    ...text.eyebrow,
    color: palette.sage,
    marginTop: -space.lg
  },
  greeting: {
    ...text.display,
    color: palette.ink,
    marginTop: space.xs + space.lg
  },

  // My Rec ID
  recIdRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    minHeight: 64,
    marginBottom: space.lg
  },
  pressed: {
    opacity: layout.pressedOpacity
  },
  recIdIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.goldSoft
  },
  recIdText: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: space.md
  },
  recIdTitle: {
    ...text.bodyStrong,
    fontSize: 16,
    color: palette.ink
  },
  recIdSubtitle: {
    ...text.caption,
    color: palette.inkMuted,
    marginTop: 2
  },

  // Live crowd card
  hero: {
    backgroundColor: palette.forest,
    borderRadius: radius.lg,
    padding: space.xl,
    marginBottom: space.xxl
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.lg
  },
  heroEyebrow: {
    ...text.eyebrow,
    color: palette.mint
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.xs
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.gold,
    marginRight: space.sm
  },
  liveText: {
    ...text.label,
    fontSize: 11,
    letterSpacing: 0.6,
    color: palette.onDark
  },
  heroLabel: {
    ...text.caption,
    color: palette.onDarkMuted
  },
  heroValueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space.xs
  },
  heroValue: {
    ...text.metric,
    color: palette.onDark
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: space.md
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: space.sm
  },
  statusLabel: {
    ...text.caption,
    fontWeight: "600"
  },
  capacityTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    marginTop: space.lg,
    overflow: "hidden"
  },
  capacityFill: {
    height: "100%",
    borderRadius: 4
  },
  heroDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.onDarkLine,
    marginVertical: space.lg
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  heroFooterLabel: {
    ...text.body,
    color: palette.onDarkMuted,
    marginRight: space.md,
    flexShrink: 1
  },
  heroFooterValue: {
    ...text.bodyStrong,
    color: palette.onDark
  },

  // Today's activity
  section: {
    marginBottom: space.xxl
  },
  sectionTitle: {
    ...text.title,
    color: palette.ink,
    marginBottom: space.md
  },

  // Chart
  chart: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.md
  },
  chartMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.md
  },
  chartMetaLabel: {
    ...text.caption,
    color: palette.inkMuted
  },
  chartPlot: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: PLOT_HEIGHT
  },
  chartSlot: {
    flex: 1,
    height: PLOT_HEIGHT,
    justifyContent: "flex-end"
  },
  chartBar: {
    width: "100%",
    borderRadius: 3
  },
  chartAxis: {
    height: 14,
    marginTop: space.sm
  },
  chartAxisLabel: {
    position: "absolute",
    top: 0,
    width: AXIS_LABEL_WIDTH,
    textAlign: "center",
    fontSize: 11,
    lineHeight: 14,
    color: palette.inkMuted
  },
  chartAxisLabelCurrent: {
    color: palette.ink,
    fontWeight: "700"
  },

  // Info tiles
  tiles: {
    flexDirection: "row",
    gap: space.md
  },
  tile: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.lg
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md
  },
  tileLabel: {
    ...text.caption,
    color: palette.inkMuted
  },
  tileValue: {
    ...text.bodyStrong,
    color: palette.ink,
    marginTop: 2
  },

  // Sample data note
  mockNote: {
    ...text.caption,
    color: palette.inkMuted,
    textAlign: "center",
    marginTop: space.xxl
  }
});
