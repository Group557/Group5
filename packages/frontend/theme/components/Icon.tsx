import { SymbolView } from "expo-symbols";
import bold from "expo-symbols/androidWeights/bold";
import regular from "expo-symbols/androidWeights/regular";
import semiBold from "expo-symbols/androidWeights/semiBold";
import {
  type ColorValue,
  type StyleProp,
  type ViewStyle
} from "react-native";

import { colors } from "../tokens";

type SymbolViewName = Parameters<typeof SymbolView>[0]["name"];

/**
 * A symbol name.
 *
 * Either a native symbol name, or the same name written for each
 * platform: SF Symbols on iOS and Material Symbols on Android and
 * web.
 */
export type IconName =
  | SymbolViewName
  | { ios: string; android: string; web: string };

export type IconWeight = "regular" | "semibold" | "bold";

export type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
  weight?: IconWeight;
  style?: StyleProp<ViewStyle>;
};

const ANDROID_WEIGHT = {
  regular,
  semibold: semiBold,
  bold
} as const;

/**
 * Native SF Symbols on iOS, Material Symbols on Android and web.
 *
 * Icons are decorative: the control that contains one carries the
 * accessible label, so the glyph itself is hidden from screen
 * readers.
 */
export function Icon({
  name,
  size = 20,
  color = colors.ink,
  weight = "semibold",
  style
}: IconProps) {
  return (
    <SymbolView
      name={name as SymbolViewName}
      size={size}
      tintColor={color}
      weight={{
        ios: weight,
        android: ANDROID_WEIGHT[weight]
      }}
      style={style}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}
