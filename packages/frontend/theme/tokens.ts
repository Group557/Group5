import type { TextStyle } from "react-native";

/**
 * PolyFit design tokens.
 *
 * Single source of truth for the brand, shared by every screen.
 * The palette is the one established on the rec center screen:
 * forest green, warm cream, burnished gold and mint.
 *
 * `#789F90` was replaced by `#4A7361` for muted text, because
 * `#789F90` only reaches 2.7:1 against the cream canvas and fails
 * WCAG AA for body text. Gold is never used for body text, because
 * both `#BD8013` and `#E8B54A` failed WCAG AA against the cream
 * canvas.
 */
export const colors = {
  // Brand
  forest: "#154734",
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
  surfaceAvatar: "#D7DDDA",

  // Text
  ink: "#154734",
  inkMuted: "#5A6570",
  inkPlaceholder: "#9CA3AF",
  onDark: "#FFFFFF",
  onDarkMuted: "#C9DDD5",
  onDarkLine: "rgba(255, 255, 255, 0.18)",

  // Lines, overlays and feedback
  border: "#DCEBE5",
  divider: "#F0F4F2",
  overlay: "rgba(21, 71, 52, 0.35)",
  danger: "#B91C1C",
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
  screenTitle: { fontSize: 30, lineHeight: 36, fontWeight: "800" },
  title: { fontSize: 19, lineHeight: 25, fontWeight: "700" },
  heading: { fontSize: 17, lineHeight: 23, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 21, fontWeight: "400" },
  bodyStrong: { fontSize: 15, lineHeight: 21, fontWeight: "600" },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  captionStrong: { fontSize: 13, lineHeight: 18, fontWeight: "700" },
  fieldLabel: { fontSize: 14, lineHeight: 20, fontWeight: "700" },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 1
  }
} satisfies Record<string, TextStyle>;
