import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  Icon,
  type IconName,
  Screen,
  colors,
  formatDate,
  formatGreeting,
  formatWait,
  radius,
  space,
  typography
} from "../../theme";

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
    occupancy_percentage: 74,
    status: "Moderate",
    estimated_wait_minutes: 15
  },
  {
    hour: 18,
    time_label: "6 PM",
    occupancy_percentage: 92,
    status: "High",
    estimated_wait_minutes: 30
  },
  {
    hour: 19,
    time_label: "7 PM",
    occupancy_percentage: 88,
    status: "High",
    estimated_wait_minutes: 25
  },
  {
    hour: 20,
    time_label: "8 PM",
    occupancy_percentage: 70,
    status: "Moderate",
    estimated_wait_minutes: 10
  },
  {
    hour: 21,
    time_label: "9 PM",
    occupancy_percentage: 48,
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

/** The center is open from 6 AM until midnight. */
const OPENING_HOUR = 6;
const CLOSING_HOUR = 24;

// FIX!!! Sundays are closed and sundays close at 10

const crowdWindow = CROWD_BY_HOUR.filter(
  (reading) =>
    reading.hour >= OPENING_HOUR && reading.hour < CLOSING_HOUR
);

function readingForHour(hour: number) {
  return (
    CROWD_BY_HOUR.find((reading) => reading.hour === hour) ??
    CROWD_BY_HOUR[0]
  );
}

/** The quietest hour of the day is the best time to visit. */
function quietestReading(readings: CrowdReading[]) {
  return readings.reduce((quietest, reading) =>
    reading.occupancy_percentage < quietest.occupancy_percentage
      ? reading
      : quietest
  );
}

function busiestReading(readings: CrowdReading[]) {
  return readings.reduce((busiest, reading) =>
    reading.occupancy_percentage > busiest.occupancy_percentage
      ? reading
      : busiest
  );
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
 * UI primitives
 * ------------------------------------------------------------------ */

type StatTileProps = {
  icon: IconName;
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
  peakHour: number,
  currentHour: number
) {
  if (reading.hour === currentHour) {
    return colors.goldText;
  }
  if (reading.hour === peakHour) {
    return colors.forest;
  }
  return colors.chartBar;
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

  return (
    <View style={styles.chart}>
      <View style={styles.chartMeta}>
        <Text style={styles.chartMetaLabel}>
          Hourly occupancy
        </Text>
        <Text style={styles.chartMetaValue}>
          {`Peak ${peak.time_label} · ${peak.occupancy_percentage}%`}
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
                    peak.hour,
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
  const now = useMemo(() => new Date(), []);
  const [recIdNote, setRecIdNote] = useState(false);

  const current = readingForHour(now.getHours());
  const best = quietestReading(crowdWindow);
  const statusTone = STATUS_TONE[current.status];

  return (
    <Screen scroll edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerEyebrow}>
            {formatDate(now)}
          </Text>
          <Text style={styles.greeting}>
            {formatGreeting(now)}
          </Text>
        </View>
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

      {/* My Rec ID */}
      <Pressable
        onPress={() => {
          setRecIdNote(true);
        }}
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
            size={20}
            color={colors.goldText}
          />
        </View>
        <View style={styles.recIdText}>
          <Text style={styles.recIdTitle}>My Rec ID</Text>
          <Text style={styles.recIdSubtitle}>
            Tap to scan in
          </Text>
        </View>
        <Icon
          name={{
            ios: "chevron.right",
            android: "chevron_right",
            web: "chevron_right"
          }}
          size={16}
          color={colors.inkMuted}
          weight="regular"
        />
      </Pressable>

      {recIdNote ? (
        <Text
          style={styles.recIdNote}
          accessibilityLiveRegion="polite">
          Rec ID scanning is not set up yet. Ask staff to check
          you in for now.
        </Text>
      ) : null}

      {/* Live crowd card */}
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroEyebrow}>
            Recreation Center
          </Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text
              style={styles.liveText}
              accessibilityLabel="Live">
              LIVE
            </Text>
          </View>
        </View>

        <Text style={styles.heroLabel}>Crowd level</Text>

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

        <View style={styles.capacityTrack}>
          <View
            style={[
              styles.capacityFill,
              {
                width: `${Math.max(2, current.occupancy_percentage)}%`,
                backgroundColor: statusTone.onDark
              }
            ]}
          />
        </View>

        <View style={styles.heroDivider} />

        <View style={styles.heroFooter}>
          <Text style={styles.heroFooterLabel}>
            Best time to go
          </Text>
          <Text style={styles.heroFooterValue}>
            {best.time_label}
          </Text>
        </View>
      </View>

      {/* Today's activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {"Today's activity"}
        </Text>
        <CrowdChart
          data={crowdWindow}
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
          iconBackground={colors.surfaceSage}
          iconColor={colors.sage}
          label="Closes at"
          value="Midnight"
        />
        <StatTile
          icon={{
            ios: "hourglass",
            android: "hourglass",
            web: "hourglass"
          }}
          iconBackground={colors.goldSoft}
          iconColor={colors.goldText}
          label="Current wait"
          value={formatWait(current.estimated_wait_minutes)}
        />
      </View>
    </Screen>
  );
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
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
  headerEyebrow: {
    ...typography.eyebrow,
    color: colors.sage,
    textTransform: "uppercase"
  },
  greeting: {
    ...typography.display,
    color: colors.ink,
    marginTop: space.xs
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
    marginLeft: space.md
  },

  // My Rec ID
  recIdRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: space.lg,
    minHeight: 64
  },
  pressed: {
    opacity: 0.75
  },
  recIdIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft
  },
  recIdText: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: space.md
  },
  recIdTitle: {
    ...typography.bodyStrong,
    fontSize: 16,
    color: colors.ink
  },
  recIdSubtitle: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: 2
  },
  recIdNote: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: space.sm
  },

  // Live crowd card
  hero: {
    backgroundColor: colors.forest,
    borderRadius: radius.xxl,
    padding: space.xl,
    marginTop: space.lg,
    marginBottom: space.xxl
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.lg
  },
  heroEyebrow: {
    ...typography.eyebrow,
    color: colors.mint,
    textTransform: "uppercase"
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.onDarkLine,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.xs
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
    marginRight: space.sm
  },
  liveText: {
    ...typography.label,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.onDark
  },
  heroLabel: {
    ...typography.caption,
    color: colors.onDarkMuted
  },
  heroValueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space.xs
  },
  heroValue: {
    ...typography.metric,
    color: colors.onDark
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
    ...typography.caption,
    fontWeight: "600"
  },
  capacityTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.onDarkLine,
    marginTop: space.lg,
    overflow: "hidden"
  },
  capacityFill: {
    height: "100%",
    borderRadius: 4
  },
  heroDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.onDarkLine,
    marginVertical: space.lg
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  heroFooterLabel: {
    ...typography.body,
    color: colors.onDarkMuted,
    marginRight: space.md,
    flexShrink: 1
  },
  heroFooterValue: {
    ...typography.bodyStrong,
    color: colors.onDark
  },

  // Today's activity
  section: {
    marginBottom: space.xxl
  },
  sectionTitle: {
    ...typography.title,
    color: colors.ink,
    marginBottom: space.md
  },

  // Chart
  chart: {
    backgroundColor: colors.surfaceMuted,
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
    ...typography.caption,
    color: colors.inkMuted
  },
  chartMetaValue: {
    ...typography.label,
    color: colors.ink
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
    color: colors.inkMuted
  },
  chartAxisLabelCurrent: {
    color: colors.ink,
    fontWeight: "700"
  },

  // Info tiles
  tiles: {
    flexDirection: "row",
    gap: space.md
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
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
    ...typography.caption,
    color: colors.inkMuted
  },
  tileValue: {
    ...typography.bodyStrong,
    color: colors.ink,
    marginTop: 2
  }
});
