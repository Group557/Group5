import { SymbolView } from "expo-symbols";
import regular from "expo-symbols/androidWeights/regular";
import semiBold from "expo-symbols/androidWeights/semiBold";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets
} from "react-native-safe-area-context";

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

/* ------------------------------------------------------------------ *
 * Design tokens
 *
 * Single source of truth for the PolyFit brand. The palette is the
 * one already established on this screen: forest green, warm cream,
 * burnished gold and mint. `#789F90` was replaced by `#4A7361` and
 * gold is never used for body text, because both failed WCAG AA
 * against the cream canvas.
 * ------------------------------------------------------------------ */

const palette = {
  forest: "#154734",
  sage: "#4A7361",
  mint: "#87CDC2",
  gold: "#BD8013",
  goldText: "#8A5E08",
  goldLight: "#E8B54A",
  goldSoft: "#F6E8C8",
  canvas: "#F8F6F0",
  surface: "#FFFFFF",
  surfaceMuted: "#EEF3EF",
  surfaceSage: "#E6EFEA",
  ink: "#154734",
  inkMuted: "#5A6570",
  onDark: "#FFFFFF",
  onDarkMuted: "#C9DDD5",
  onDarkLine: "rgba(255, 255, 255, 0.18)",
  chartBar: "#5E8F7B"
} as const;

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

const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24
} as const;

const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999
} as const;

const text = {
  display: { fontSize: 26, lineHeight: 32, fontWeight: "700" },
  metric: { fontSize: 40, lineHeight: 46, fontWeight: "700" },
  title: { fontSize: 19, lineHeight: 25, fontWeight: "700" },
  heading: { fontSize: 17, lineHeight: 23, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 21, fontWeight: "400" },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600"
  },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  }
} as const;

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const WEEKDAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT"
];
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC"
];

function formatDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]} · ${MONTHS[date.getMonth()]} ${date.getDate()}`;
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

type SymbolName = Parameters<typeof SymbolView>[0]["name"];

type IconProps = {
  name: SymbolName;
  size?: number;
  color?: string;
  weight?: "regular" | "semibold";
  style?: StyleProp<ViewStyle>;
};

/**
 * Native SF Symbols on iOS, Material Symbols on Android and web.
 * Icons are decorative: the surrounding control carries the label.
 */
function Icon({
  name,
  size = 20,
  color = palette.ink,
  weight = "semibold",
  style
}: IconProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={{
        ios: weight,
        android: weight === "semibold" ? semiBold : regular
      }}
      style={style}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

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
  peakHour: number,
  currentHour: number
) {
  if (reading.hour === currentHour) {
    return palette.goldText;
  }
  if (reading.hour === peakHour) {
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
  return (
    <SafeAreaProvider>
      <RecCenterContent />
    </SafeAreaProvider>
  );
}

function RecCenterContent() {
  const insets = useSafeAreaInsets();
  const now = new Date();

  const handleRecIdPress = () => {
    // TODO: implement rec ID scan-in
  };

  const current = readingForHour(now.getHours());
  const best = quietestReading(crowdWindow);
  const statusTone = STATUS_TONE[current.status];

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right"]}>
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
            <Text style={styles.greeting}>
              {formatGreeting(now)}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Icon
              name={{
                ios: "person",
                android: "person",
                web: "person"
              }}
              size={32}
              color={palette.onDark}
              weight="regular"
            />
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
          <Icon
            name={{
              ios: "chevron.right",
              android: "chevron_right",
              web: "chevron_right"
            }}
            size={18}
            color={palette.inkMuted}
          />
        </Pressable>

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
            iconBackground={palette.surfaceSage}
            iconColor={palette.sage}
            label="Closes at"
            value="Midnight"
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
            value={formatWait(current.estimated_wait_minutes)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: space.xl,
    paddingTop: 70
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
  headerEyebrow: {
    ...text.eyebrow,
    color: palette.sage
  },
  greeting: {
    ...text.display,
    color: palette.ink,
    marginTop: space.xs
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.forest,
    marginLeft: space.md
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
    opacity: 0.75
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
  chartMetaValue: {
    ...text.label,
    color: palette.ink
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
  }
});
