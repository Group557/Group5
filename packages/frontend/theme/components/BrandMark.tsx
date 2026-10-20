import { StyleSheet, Text, View } from "react-native";

import { colors, space } from "../tokens";

/**
 * The PolyFit wordmark.
 *
 * The four spoked asterisk is the brand mark used across the app.
 * The variation selector keeps it in text presentation so it never
 * renders as a full colour emoji.
 */
export function BrandMark() {
  return (
    <View style={styles.row} accessibilityRole="header">
      <Text style={styles.mark}>{"✣\uFE0E"}</Text>
      <Text style={styles.word}>PolyFit</Text>
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  mark: {
    color: colors.forest,
    fontSize: 24,
    marginRight: space.sm
  },
  word: {
    color: colors.forest,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.2
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
    marginLeft: space.sm,
    marginTop: 5
  }
});
