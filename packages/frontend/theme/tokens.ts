import type { TextStyle } from "react-native";

/**
 * PolyFit design tokens.
 *
 * Single source of truth for the brand, shared by every screen.
 * The palette is forest green, warm cream, burnished gold and mint.
 *
 * Contrast notes, measured against the cream canvas (`#F8F6F0`):
 * - `sage` (#4A7361) is 4.9:1, so it is safe for body copy.
 * - The old muted green `#789F90` was 2.7:1 and failed WCAG AA,
 *   so it was replaced everywhere.
 * - `inkPlaceholder` (#67737B) is 4.8:1 on the input surface, so a
 *   placeholder is still readable once the field is filled in.
 * - Gold is never used for body text: both `#BD8013` and `#E8B54A`
 *   failed WCAG AA against the cream canvas.
 */
export const colors = {
  // Brand
  forest: "#154734",
  forestDeep: "#0F3727",
  sage: "#4A7361",
  mint: "#87CDC2",
  gold: "#BD8013",
  goldText: "#8A5E08",
  goldLight: "#E8B54A",
  goldSoft: "#F6E8C8",

  // Surfaces
  canvas: "#F8F6F0",
  surface: "#FFFFFF",
  surfaceMuted: "#EEF3EF",
  surfaceSage: "#E6EFEA",
  surfaceInput: "#FAFCFA",
  surfaceRow: "#F8FAF9",
  surfaceSunken: "#EDE9DC",

  // Text
  ink: "#154734",
  inkMuted: "#5A6570",
  inkPlaceholder: "#67737B",
  onDark: "#FFFFFF",
  onDarkMuted: "#C9DDD5",
  onDarkLine: "rgba(255, 255, 255, 0.18)",

  // Lines, overlays and feedback
  border: "#DCEBE5",
  divider: "#F0F4F2",
  overlay: "rgba(21, 71, 52, 0.35)",
  danger: "#B91C1C",
  dangerSoft: "#FBEAE8",
  chartBar: "#5E8F7B"
} as const;

/** Spacing scale, 4px steps. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32
} as const;

/** Corner radius scale. */
export const radius = {
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 18,
  xxxl: 20,
  sheet: 24,
  pill: 999
} as const;

/**
 * Type scale. Every weight below is 400, 600, 700 or 800 so that
 * headings and body copy stay distinguishable at a glance.
 */
export const typography = {
  display: { fontSize: 26, lineHeight: 32, fontWeight: "700" },
  metric: { fontSize: 40, lineHeight: 46, fontWeight: "700" },
  screenTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700"
  },
  title: { fontSize: 19, lineHeight: 25, fontWeight: "700" },
  heading: { fontSize: 17, lineHeight: 23, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 21, fontWeight: "400" },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600"
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400"
  },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  captionStrong: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 1
  }
} satisfies Record<string, TextStyle>;

/**
 * Shared control metrics. `minTouch` is the WCAG 2.2 target size
 * floor, so every tappable element in the app can be checked
 * against one number.
 */
export const control = {
  minTouch: 44,
  buttonHeight: 52,
  inputHeight: 48,
  iconSm: 18,
  iconMd: 22,
  iconLg: 28,
  avatarSm: 40,
  avatarMd: 44,
  avatarLg: 56
} as const;

/**
 * A single, restrained elevation level. Shadows are used to lift one
 * primary action per screen, not to decorate containers.
 */
export const shadows = {
  raised: {
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4
  }
} as const;
