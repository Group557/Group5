import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle
} from "react-native";
import {
  SafeAreaView,
  type Edge
} from "react-native-safe-area-context";

import { colors, space } from "../tokens";
export type ScreenProps = {
  children: React.ReactNode;
  /** Wrap the content in a ScrollView. */
  scroll?: boolean;
  /** Apply the standard screen padding. */
  padded?: boolean;
  /** Lift the content above the keyboard. */
  keyboard?: boolean;
  /**
   * Which edges to inset. Tab screens should leave the bottom edge
   * to the tab bar; pushed screens should include it.
   */
  edges?: readonly Edge[];
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * The shell every screen sits in.
 *
 * It owns the three things that are easy to get wrong per screen:
 * safe area insets, content padding and keyboard avoidance. Every
 * screen in the app uses it so the spacing between screens is
 * identical.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  keyboard = false,
  edges = ["top", "left", "right", "bottom"],
  contentStyle
}: ScreenProps) {
  const content = padded ? styles.padded : null;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.scrollContent,
        content,
        contentStyle
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={
        Platform.OS === "ios" ? "interactive" : "on-drag"
      }
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, content, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={edges}>
      {keyboard ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={
            Platform.OS === "ios" ? "padding" : undefined
          }>
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  flex: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  padded: {
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: space.huge
  }
});
