import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle
} from "react-native";

import { buttons } from "../styles";
import { colors, space } from "../tokens";
import { Icon, type IconName } from "./Icon";

export type ButtonVariant =
  "primary" | "secondary" | "ghost" | "danger";

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** Optional leading glyph. */
  icon?: IconName;
  disabled?: boolean;
  /** Swaps the label for a spinner and blocks presses. */
  loading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Extra layout for the button, such as a width or margin. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const VARIANT_STYLE = {
  primary: buttons.primary,
  secondary: buttons.secondary,
  ghost: buttons.ghost,
  danger: buttons.danger
} as const;

const VARIANT_TEXT = {
  primary: buttons.primaryText,
  secondary: buttons.secondaryText,
  ghost: buttons.ghostText,
  danger: buttons.dangerText
} as const;

/**
 * The app's only button.
 *
 * Every variant shares one height and one radius so that actions
 * line up across screens, and the pressed and disabled states are
 * defined once instead of per screen.
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID
}: ButtonProps) {
  const isBlocked = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isBlocked}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isBlocked,
        busy: loading
      }}
      style={({ pressed }) => [
        buttons.base,
        VARIANT_STYLE[variant],
        pressed && !isBlocked && buttons.pressed,
        isBlocked && buttons.disabled,
        style
      ]}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === "secondary" || variant === "ghost"
              ? colors.forest
              : colors.onDark
          }
        />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Icon
              name={icon}
              size={18}
              color={
                variant === "secondary" || variant === "ghost"
                  ? colors.forest
                  : colors.onDark
              }
              style={styles.icon}
            />
          ) : null}
          <Text
            style={[
              VARIANT_TEXT[variant],
              icon ? styles.labelWithIcon : null
            ]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    marginRight: space.sm
  },
  labelWithIcon: {
    marginLeft: 0
  }
});
