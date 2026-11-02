import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  layout,
  palette,
  radius,
  space,
  text
} from "@/constants/theme";

/* ------------------------------------------------------------------ *
 * Mock QR code
 *
 * A stand-in for the real Rec ID. It only looks like a QR code: the
 * cells follow a fixed formula so the pattern never changes between
 * renders, and nothing is encoded in it.
 * ------------------------------------------------------------------ */

const QR_SIZE = 21;
const FINDER_SIZE = 7;
const CELL_SIZE = 8;

/** Top-left corners of the three finder squares. */
const FINDER_ORIGINS = [
  { row: 0, col: 0 },
  { row: 0, col: QR_SIZE - FINDER_SIZE },
  { row: QR_SIZE - FINDER_SIZE, col: 0 }
];

/**
 * Returns true, false or null when the cell sits outside a finder.
 * Each finder is a dark ring, a light ring and a dark 3x3 center,
 * with a light border separating it from the data cells.
 */
function finderCell(row: number, col: number) {
  for (const origin of FINDER_ORIGINS) {
    const r = row - origin.row;
    const c = col - origin.col;

    if (
      r < -1 ||
      r > FINDER_SIZE ||
      c < -1 ||
      c > FINDER_SIZE
    ) {
      continue;
    }
    // Light separator around the finder.
    if (
      r === -1 ||
      r === FINDER_SIZE ||
      c === -1 ||
      c === FINDER_SIZE
    ) {
      return false;
    }
    const ring = Math.min(
      r,
      c,
      FINDER_SIZE - 1 - r,
      FINDER_SIZE - 1 - c
    );
    return ring !== 1;
  }
  return null;
}

function isDarkCell(row: number, col: number) {
  const finder = finderCell(row, col);

  if (finder !== null) {
    return finder;
  }
  // Alternating timing lines between the finders.
  if (row === FINDER_SIZE - 1 || col === FINDER_SIZE - 1) {
    return (row + col) % 2 === 0;
  }
  // Deterministic pseudo-random fill.
  return (row * 31 + col * 17 + row * col * 7) % 5 < 2;
}

const QR_CELLS = Array.from(
  { length: QR_SIZE * QR_SIZE },
  (_, index) =>
    isDarkCell(Math.floor(index / QR_SIZE), index % QR_SIZE)
);

function FakeQRCode() {
  return (
    <View
      style={styles.qr}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Sample Rec ID code">
      {QR_CELLS.map((dark, index) => (
        <View
          key={index}
          style={[
            styles.qrCell,
            dark ? styles.qrCellDark : styles.qrCellLight
          ]}
        />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export default function RecIdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, layout.minTopInset),
          paddingBottom: insets.bottom + space.xxl,
          paddingLeft: insets.left + layout.screenGutter,
          paddingRight: insets.right + layout.screenGutter
        }
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back">
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          My Rec ID
        </Text>
        {/* Balances the back button so the title stays centred. */}
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        {/* ID card */}
        <View style={styles.card}>
          <FakeQRCode />
          <Text style={styles.sampleLabel}>
            SAMPLE - NOT A REAL QR CODE
          </Text>
        </View>

        <Text style={styles.note}>
          Scan this at the entrance to check in.
        </Text>
      </View>
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: layout.screenTop
  },
  backButton: {
    minWidth: 64,
    minHeight: layout.minTouch,
    justifyContent: "center"
  },
  pressed: {
    opacity: layout.pressedOpacity
  },
  backLabel: {
    ...text.bodyStrong,
    color: palette.sage
  },
  title: {
    ...text.title,
    color: palette.ink,
    textAlign: "center",
    flex: 1
  },
  headerSpacer: {
    minWidth: 64
  },

  // Body
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // Lifts the card above true centre.
    paddingBottom: space.xxl * 4
  },
  card: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.xxl
  },
  sampleLabel: {
    ...text.caption,
    color: palette.inkMuted,
    marginTop: space.xxl
  },
  note: {
    ...text.body,
    color: palette.inkMuted,
    textAlign: "center",
    marginTop: space.xxl * 2
  },

  // Mock QR code
  qr: {
    width: QR_SIZE * CELL_SIZE,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  qrCell: {
    width: CELL_SIZE,
    height: CELL_SIZE
  },
  qrCellDark: {
    backgroundColor: palette.forest
  },
  qrCellLight: {
    backgroundColor: palette.surface
  }
});
