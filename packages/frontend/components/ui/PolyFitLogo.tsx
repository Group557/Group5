import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

import { palette } from "@/constants/theme";

type PolyFitLogoProps = {
  /** Font size of the wordmark. */
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/** The PolyFit wordmark. */
export default function PolyFitLogo({
  size = 22,
  color = palette.forest,
  style
}: PolyFitLogoProps) {
  return (
    <Text
      accessibilityRole="header"
      style={[styles.name, { fontSize: size, color }, style]}>
      PolyFit
    </Text>
  );
}

const styles = StyleSheet.create({
  name: {
    fontWeight: "800"
  }
});
