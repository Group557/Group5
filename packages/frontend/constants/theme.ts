/* ------------------------------------------------------------------ *
 * Design tokens
 *
 * Single source of truth for the PolyFit brand: forest green, warm
 * cream, burnished gold and mint. `#789F90` was replaced by `#4A7361`
 * and gold is never used for body text, because both failed WCAG AA
 * against the cream canvas.
 * ------------------------------------------------------------------ */

export const palette = {
  forest: "#154734",
  sage: "#4A7361",
  mint: "#87CDC2",
  gold: "#BD8013",
  goldText: "#8A5E08",
  goldLight: "#E8B54A",
  goldSoft: "#F6E8C8",
  canvas: "#F8F6F0",
  surface: "#FFFFFF",
  surfaceMuted: "#EEF3EF",
  surfaceSage: "#E6EFEA",
  ink: "#154734",
  inkMuted: "#5A6570",
  onDark: "#FFFFFF",
  onDarkMuted: "#C9DDD5",
  onDarkLine: "rgba(255, 255, 255, 0.18)",
  chartBar: "#5E8F7B"
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999
} as const;

export const text = {
  display: { fontSize: 26, lineHeight: 32, fontWeight: "700" },
  metric: { fontSize: 40, lineHeight: 46, fontWeight: "700" },
  title: { fontSize: 19, lineHeight: 25, fontWeight: "700" },
  heading: { fontSize: 17, lineHeight: 23, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 21, fontWeight: "400" },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600"
  },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  }
} as const;

/** Shared layout rules so screens line up with each other. */
export const layout = {
  screenGutter: space.xxl,
  screenTop: space.xxl,
  /**
   * Floor for the top safe-area inset. The web build (including
   * browser device previews) always reports 0, so without this the
   * header would sit against the top edge.
   */
  minTopInset: 44,
  /** Minimum touch target from the platform guidelines. */
  minTouch: 44,
  pressedOpacity: 0.75
} as const;
