import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { globalStyles } from "@/constants/globalStyles";
import { palette } from "@/constants/theme";

type ScreenHeaderProps = {
  /** Small sage line above the title, such as "TRAINING HUB" or today's date. */
  eyebrow: string;
  title: string;
  subtitle?: string;
};

/** The small sage POLYFIT label that sits at the top of every tab. */
export function BrandLabel() {
  return <Text style={styles.brandLabel}>POLYFIT</Text>;
}

/**
 * The header every tab screen starts with: the POLYFIT label, then
 * eyebrow, title and optional subtitle. Spacing matches the My
 * Workouts screen. Put it first inside a ScrollView whose
 * contentContainerStyle is `globalStyles.screenContent`, so every
 * screen lines up when you switch tabs.
 */
export default function ScreenHeader({
  eyebrow,
  title,
  subtitle
}: ScreenHeaderProps) {
  // Keeps the header below the notch and status bar on phones.
  // The web preview reports 0, so it looks the same there.
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { marginTop: insets.top }]}>
      <BrandLabel />
      <Text style={globalStyles.eyebrow}>{eyebrow}</Text>
      <Text
        style={globalStyles.pageTitle}
        accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? (
        <Text style={globalStyles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 22
  },
  brandLabel: {
    color: palette.sage,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 30
  }
});
