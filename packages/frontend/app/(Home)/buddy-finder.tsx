import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon from "@/components/ui/Icon";
import {
  layout,
  palette,
  radius,
  space,
  text
} from "@/constants/theme";

const ACTION_SIZE = 64;
const UNDO_SIZE = 48;
/** Photo frame is 500 wide by 530 long. */
const PHOTO_ASPECT_RATIO = 500 / 530;
const PILL_HEIGHT = 36;
/** Extends the pills' touch area to the platform minimum. */
const PILL_HIT_SLOP = (layout.minTouch - PILL_HEIGHT) / 2;

/* ------------------------------------------------------------------ *
 * Detail preview
 * ------------------------------------------------------------------ */

type DetailPreviewProps = {
  label: string;
  value: string;
};

/**
 * One line per detail so the card never needs to scroll; the
 * profile screen shows the full text.
 */
function DetailPreview({ label, value }: DetailPreviewProps) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export default function BuddyFinderScreen() {
  // Insets come from the provider Expo Router mounts at the root.
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // Undo only brings back the most recent pass.
  const [canUndo, setCanUndo] = useState(false);

  const handleFiltersPress = () => {
    router.push("/buddy-filters");
  };

  const handleMyProfilePress = () => {
    router.push("/buddy-my-profile");
  };

  const handleUndoPress = () => {
    // TODO: bring back the buddy that was just passed
    setCanUndo(false);
  };

  const handlePassPress = () => {
    // TODO: pass on this buddy
    setCanUndo(true);
  };

  const handleViewProfilePress = () => {
    router.push("/buddy-profile");
  };

  const handleMessagePress = () => {
    // TODO: message this buddy
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, layout.minTopInset),
          paddingLeft: insets.left,
          paddingRight: insets.right
        }
      ]}>
      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + space.xxl }
        ]}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={styles.title}
            numberOfLines={1}
            accessibilityRole="header">
            Buddy Finder
          </Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleFiltersPress}
              hitSlop={PILL_HIT_SLOP}
              style={({ pressed }) => [
                styles.pill,
                styles.pillOutlined,
                pressed && styles.pressed
              ]}
              accessibilityRole="button"
              accessibilityLabel="Filters">
              <Text style={styles.pillOutlinedText}>
                Filters
              </Text>
            </Pressable>
            <Pressable
              onPress={handleMyProfilePress}
              hitSlop={PILL_HIT_SLOP}
              style={({ pressed }) => [
                styles.pill,
                styles.pillSolid,
                pressed && styles.pressed
              ]}
              accessibilityRole="button"
              accessibilityLabel="My Profile">
              <Text style={styles.pillSolidText}>
                My Profile
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Profile card */}
        <View style={styles.card}>
          <View style={styles.photo}>
            <Text style={styles.photoText}>
              Photo will show here
            </Text>
          </View>

          <Text style={styles.cardTitle}>Name, Age</Text>
          <Text style={styles.cardSubtitle}>
            Major and year will show here
          </Text>

          <View style={styles.details}>
            <DetailPreview
              label="Gym goals"
              value="Gym goals will show here"
            />
            <DetailPreview
              label="Workout style"
              value="Workout style will show here"
            />
            <DetailPreview
              label="Schedule"
              value="Schedule will show here"
            />
          </View>

          {/* Full details and posts live on the profile screen. */}
          <Pressable
            onPress={handleViewProfilePress}
            style={({ pressed }) => [
              styles.viewProfile,
              pressed && styles.pressed
            ]}
            accessibilityRole="button"
            accessibilityLabel="View profile"
            accessibilityHint="Opens this person's goals, schedule and posts">
            <Text style={styles.viewProfileText}>
              View profile
            </Text>
            <Icon
              name={{
                ios: "chevron.right",
                android: "chevron_right",
                web: "chevron_right"
              }}
              size={16}
              color={palette.forest}
            />
          </Pressable>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleUndoPress}
            disabled={!canUndo}
            style={({ pressed }) => [
              styles.action,
              styles.actionUndo,
              styles.actionUndoPosition,
              styles.actionOutlined,
              !canUndo && styles.actionDisabled,
              pressed && styles.pressed
            ]}
            accessibilityRole="button"
            accessibilityLabel="Undo"
            accessibilityHint="Brings back the last person you passed"
            accessibilityState={{ disabled: !canUndo }}>
            <Icon
              name={{
                ios: "arrow.uturn.backward",
                android: "undo",
                web: "undo"
              }}
              size={20}
              color={palette.forest}
            />
          </Pressable>
          <Pressable
            onPress={handleMessagePress}
            style={({ pressed }) => [
              styles.action,
              styles.actionMessage,
              pressed && styles.pressed
            ]}
            accessibilityRole="button"
            accessibilityLabel="Message">
            <Icon
              name={{
                ios: "envelope.fill",
                android: "mail",
                web: "mail"
              }}
              size={26}
              color={palette.onDark}
            />
          </Pressable>
          <Pressable
            onPress={handlePassPress}
            style={({ pressed }) => [
              styles.action,
              styles.actionOutlined,
              pressed && styles.pressed
            ]}
            accessibilityRole="button"
            accessibilityLabel="Pass">
            <Icon
              name={{
                ios: "xmark",
                android: "close",
                web: "close"
              }}
              size={24}
              color={palette.forest}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.canvas
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenGutter,
    // Tighter than other screens so the whole card fits without scrolling.
    paddingTop: space.sm
  },
  pressed: {
    opacity: layout.pressedOpacity
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.lg
  },
  title: {
    ...text.display,
    color: palette.ink,
    flexShrink: 1,
    marginRight: space.md
  },
  headerActions: {
    flexDirection: "row",
    gap: space.sm
  },
  pill: {
    height: PILL_HEIGHT,
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    borderWidth: 1.5
  },
  pillOutlined: {
    backgroundColor: palette.surface,
    borderColor: palette.forest
  },
  pillOutlinedText: {
    ...text.label,
    color: palette.forest
  },
  pillSolid: {
    backgroundColor: palette.forest,
    borderColor: palette.forest
  },
  pillSolidText: {
    ...text.label,
    color: palette.onDark
  },

  // Profile card
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    marginBottom: space.xl
  },
  photo: {
    width: "100%",
    aspectRatio: PHOTO_ASPECT_RATIO,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.lg
  },
  photoText: {
    ...text.caption,
    color: palette.inkMuted
  },
  cardTitle: {
    ...text.title,
    color: palette.ink
  },
  cardSubtitle: {
    ...text.caption,
    color: palette.inkMuted,
    marginTop: 2
  },
  details: {
    gap: space.sm,
    marginTop: space.md
  },
  detail: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm
  },
  detailLabel: {
    ...text.eyebrow,
    color: palette.sage
  },
  detailValue: {
    ...text.caption,
    color: palette.ink,
    marginTop: 2
  },
  viewProfile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    minHeight: layout.minTouch,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceSage,
    marginTop: space.md
  },
  viewProfileText: {
    ...text.bodyStrong,
    color: palette.forest
  },

  // Actions
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxl
  },
  // Sits one gap left of the message button, measured from the
  // centre line, so message and pass stay centred on any width.
  actionUndoPosition: {
    position: "absolute",
    right: "50%",
    marginRight: ACTION_SIZE + space.xxl / 2 + space.lg
  },
  action: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5
  },
  actionOutlined: {
    backgroundColor: palette.surface,
    borderColor: palette.forest
  },
  actionUndo: {
    width: UNDO_SIZE,
    height: UNDO_SIZE,
    borderRadius: UNDO_SIZE / 2
  },
  actionDisabled: {
    opacity: 0.4
  },
  actionMessage: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  }
});
