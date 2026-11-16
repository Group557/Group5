import { StyleSheet } from "react-native";

import { palette, radius, space } from "./theme";

/* ------------------------------------------------------------------ *
 * Global styles
 *
 * Shared building blocks for every PolyFit screen. Use these instead
 * of redefining the same container, header, button and card styles in
 * each file, and combine them with local styles when a screen needs
 * something extra:
 *
 *   import { globalStyles } from "@/constants/globalStyles";
 *   <View style={[globalStyles.card, styles.myCard]} />
 *
 * Colors and sizes come from `theme.ts`; change them there.
 * ------------------------------------------------------------------ */

export const globalStyles = StyleSheet.create({
  /* Screen ---------------------------------------------------------- */
  screen: {
    flex: 1,
    backgroundColor: palette.canvas
  },
  /** `contentContainerStyle` for a screen's ScrollView. */
  screenContent: {
    padding: space.xl,
    paddingTop: 28,
    paddingBottom: 32
  },
  /** Logo on the left, avatar or action on the right. */
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28
  },

  /* Text ------------------------------------------------------------ */
  eyebrow: {
    color: palette.sage,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  pageTitle: {
    color: palette.ink,
    fontSize: 30,
    fontWeight: "800",
    marginTop: space.xs
  },
  subtitle: {
    color: palette.inkMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 11
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 19,
    fontWeight: "800"
  },
  bodyText: {
    color: palette.inkMuted,
    fontSize: 14,
    lineHeight: 20
  },

  /* Buttons --------------------------------------------------------- */
  primaryButton: {
    backgroundColor: palette.forest,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: space.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    color: palette.onDark,
    fontSize: 16,
    fontWeight: "800"
  },
  secondaryButton: {
    backgroundColor: palette.surfaceSage,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: space.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    color: palette.forest,
    fontSize: 16,
    fontWeight: "800"
  },
  /** Add to any Pressable's style while `pressed` is true. */
  pressed: {
    opacity: 0.75
  },

  /* Forms ----------------------------------------------------------- */
  label: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 11,
    backgroundColor: palette.field,
    color: palette.ink,
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 12
  },
  errorText: {
    color: palette.danger,
    fontSize: 13,
    marginTop: 5
  },

  /* Cards ----------------------------------------------------------- */
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: space.xl
  },
  cardDark: {
    backgroundColor: palette.forest,
    borderRadius: 18,
    padding: space.xl
  }
});
