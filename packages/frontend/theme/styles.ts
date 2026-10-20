import { StyleSheet } from "react-native";

import {
  colors,
  control,
  radius,
  space,
  typography
} from "./tokens";

/**
 * Shared stylesheet.
 *
 * React Native has no CSS cascade and no class names, so the closest
 * thing to a global stylesheet is one `StyleSheet.create` that every
 * screen imports. The groups below cover the patterns that show up on
 * more than one screen: page scaffolding, text, buttons, cards, form
 * fields, modals, banners and the tab bar.
 *
 * Anything specific to a single screen stays in that screen's own
 * stylesheet, but reaches for these tokens for color, spacing and
 * type so the screens still look like one app.
 */

/** Page scaffolding shared by every screen. */
export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  scrollContent: {
    padding: space.xl,
    paddingTop: space.md,
    paddingBottom: space.huge
  },
  section: {
    marginBottom: space.xxl
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  stack: {
    gap: space.md
  }
});

/** Text styles that pair the type scale with a color. */
export const text = StyleSheet.create({
  screenTitle: {
    ...typography.screenTitle,
    color: colors.ink
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.inkMuted,
    marginTop: space.xs
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.sage
  },
  sectionTitle: {
    ...typography.title,
    color: colors.ink
  },
  sectionCount: {
    ...typography.captionStrong,
    color: colors.sage
  },
  fieldLabel: {
    ...typography.fieldLabel,
    color: colors.ink
  },
  body: {
    ...typography.body,
    color: colors.ink
  },
  bodyMuted: {
    ...typography.body,
    color: colors.inkMuted
  },
  caption: {
    ...typography.caption,
    color: colors.inkMuted
  },
  cardTitle: {
    ...typography.body,
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink
  },
  hint: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: 4
  },
  exerciseName: {
    ...typography.body,
    fontWeight: "700",
    color: colors.ink
  },
  exerciseCategory: {
    ...typography.caption,
    color: colors.sage,
    marginTop: 2
  },
  placeholder: {
    ...typography.body,
    color: colors.inkPlaceholder
  },
  error: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.danger,
    textAlign: "center",
    marginTop: space.md
  }
});

/** Buttons. */
export const buttons = StyleSheet.create({
  base: {
    minHeight: control.buttonHeight,
    borderRadius: radius.lg,
    paddingHorizontal: space.xl,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  primary: {
    backgroundColor: colors.forest
  },
  primaryText: {
    ...typography.bodyStrong,
    fontSize: 16,
    fontWeight: "800",
    color: colors.onDark
  },
  secondary: {
    backgroundColor: colors.surfaceSage
  },
  secondaryText: {
    ...typography.bodyStrong,
    fontSize: 16,
    fontWeight: "800",
    color: colors.forest
  },
  ghost: {
    backgroundColor: "transparent"
  },
  ghostText: {
    ...typography.bodyStrong,
    fontSize: 16,
    fontWeight: "700",
    color: colors.forest
  },
  danger: {
    backgroundColor: colors.danger
  },
  dangerText: {
    ...typography.bodyStrong,
    fontSize: 16,
    fontWeight: "800",
    color: colors.onDark
  },
  backLink: {
    minHeight: control.minTouch,
    justifyContent: "center"
  },
  backText: {
    ...typography.body,
    fontWeight: "700",
    color: colors.forest
  },
  pressed: {
    opacity: 0.75
  },
  disabled: {
    opacity: 0.45
  }
});

/** Cards and list rows. */
export const cards = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: space.lg
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: space.xl,
    alignItems: "center"
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.lg,
    flexDirection: "row",
    alignItems: "center"
  },
  row: {
    backgroundColor: colors.surfaceRow,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    marginBottom: 10
  },
  iconBox: {
    width: control.avatarMd,
    height: control.avatarMd,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center"
  }
});

/** Form fields. */
export const form = StyleSheet.create({
  input: {
    minHeight: control.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceInput,
    color: colors.ink,
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 12
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft
  },
  select: {
    minHeight: control.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceInput,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  selectValue: {
    ...typography.body,
    color: colors.ink
  },
  selectPlaceholder: {
    ...typography.body,
    color: colors.inkPlaceholder
  },
  selectChevron: {
    ...typography.body,
    fontSize: 18,
    color: colors.ink,
    marginTop: -4
  }
});

/** Centered modal dialogs. */
export const modal = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: space.xxl
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: space.lg
  },
  title: {
    ...typography.heading,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: space.sm
  },
  option: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  optionText: {
    ...typography.body,
    color: colors.ink
  },
  optionTextActive: {
    ...typography.body,
    fontWeight: "800",
    color: colors.ink
  }
});

/** The exercise library bottom sheet. */
export const sheet = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    height: "88%",
    flex: 1,
    marginTop: "auto"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: space.xl,
    paddingBottom: 10
  },
  close: {
    ...typography.body,
    fontSize: 20,
    color: colors.ink,
    paddingHorizontal: space.sm
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingTop: space.sm,
    paddingBottom: space.xxl,
    gap: 10
  },
  link: {
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSage,
    alignItems: "center"
  },
  linkText: {
    ...typography.bodySmall,
    fontWeight: "800",
    color: colors.ink
  },
  done: {
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.forest,
    alignItems: "center"
  },
  doneText: {
    ...typography.bodySmall,
    fontWeight: "800",
    color: colors.onDark
  }
});

/** Small filter chips. */
export const chips = StyleSheet.create({
  chip: {
    minHeight: 36,
    backgroundColor: colors.surfaceSage,
    borderRadius: radius.sm,
    paddingVertical: space.sm,
    paddingHorizontal: 14,
    justifyContent: "center"
  },
  chipActive: {
    backgroundColor: colors.forest
  },
  chipText: {
    ...typography.caption,
    fontWeight: "700",
    color: colors.ink
  },
  chipTextActive: {
    ...typography.caption,
    fontWeight: "700",
    color: colors.onDark
  }
});

/**
 * Inline banners for errors and hints. The message is announced by
 * the screen reader, so it must sit next to the thing it describes
 * rather than in a toast.
 */
export const banner = StyleSheet.create({
  error: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: space.md
  },
  errorIcon: {
    marginTop: 1
  },
  errorText: {
    ...typography.caption,
    flex: 1,
    color: colors.danger
  }
});

/** Bottom tab bar. */
export const tabBar = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border
  },
  label: {
    fontSize: 11,
    fontWeight: "600"
  }
});
