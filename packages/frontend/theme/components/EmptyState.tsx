import { StyleSheet, Text, View } from "react-native";

import { colors, radius, space, typography } from "../tokens";
import { Icon, type IconName } from "./Icon";

export type EmptyStateProps = {
  icon: IconName;
  title: string;
  body: string;
};

/**
 * A quiet placeholder for a list with nothing in it yet.
 *
 * The icon carries no extra meaning, so it stays decorative and the
 * title and body carry the message.
 */
export function EmptyState({
  icon,
  title,
  body
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Icon
          name={icon}
          size={22}
          color={colors.sage}
          weight="regular"
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: space.xxl,
    paddingHorizontal: space.lg
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSage,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md
  },
  title: {
    ...typography.bodyStrong,
    color: colors.ink,
    textAlign: "center"
  },
  body: {
    ...typography.caption,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: space.xs,
    maxWidth: 280
  }
});
