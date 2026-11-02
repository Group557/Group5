import { SymbolView } from "expo-symbols";
import regular from "expo-symbols/androidWeights/regular";
import semiBold from "expo-symbols/androidWeights/semiBold";
import type { StyleProp, ViewStyle } from "react-native";

import { palette } from "@/constants/theme";

export type SymbolName = Parameters<
  typeof SymbolView
>[0]["name"];

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
export default function Icon({
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
