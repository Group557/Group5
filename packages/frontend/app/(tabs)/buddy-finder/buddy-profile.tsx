import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
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

/** Photo frame is 500 wide by 530 long, matching Buddy Finder. */
const PHOTO_ASPECT_RATIO = 500 / 530;

/* ------------------------------------------------------------------ *
 * Profile details
 * ------------------------------------------------------------------ */

type DetailProps = {
  label: string;
  value: string;
};

/** A labelled block whose value wraps, so long lists still fit. */
function Detail({ label, value }: DetailProps) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export default function BuddyProfileScreen() {
  // Insets come from the provider Expo Router mounts at the root.
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back">
          <Icon
            name={{
              ios: "chevron.left",
              android: "chevron_left",
              web: "chevron_left"
            }}
            size={18}
            color={palette.sage}
          />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + space.xxl }
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.card}>
          <View style={styles.photo}>
            <Text style={styles.photoText}>
              Photo will show here
            </Text>
          </View>

          <Text style={styles.name} accessibilityRole="header">
            Name, Age
          </Text>
          <Text style={styles.subtitle}>
            Major and year will show here
          </Text>

          <View style={styles.details}>
            <Detail
              label="Gym goals"
              value="Gym goals will show here"
            />
            <Detail
              label="Workout style"
              value="Workout style will show here"
            />
            <Detail
              label="Schedule"
              value="Schedule will show here"
            />
          </View>

          <Text style={styles.bio}>Bio will show here.</Text>
        </View>

        {/* Posts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posts</Text>
          <View style={styles.emptyPosts}>
            <Text style={styles.emptyPostsText}>
              No posts yet.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: layout.screenGutter
  },
  pressed: {
    opacity: layout.pressedOpacity
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.screenGutter,
    marginBottom: space.sm
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    minHeight: layout.minTouch
  },
  backLabel: {
    ...text.bodyStrong,
    color: palette.sage
  },

  // Profile
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    marginBottom: space.xxl
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
  name: {
    ...text.title,
    color: palette.ink
  },
  subtitle: {
    ...text.caption,
    color: palette.inkMuted,
    marginTop: 2
  },
  details: {
    gap: space.lg,
    marginTop: space.lg
  },
  detail: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    padding: space.md
  },
  detailLabel: {
    ...text.eyebrow,
    color: palette.sage
  },
  detailValue: {
    ...text.body,
    color: palette.ink,
    marginTop: space.xs
  },
  bio: {
    ...text.body,
    color: palette.inkMuted,
    marginTop: space.lg
  },

  // Posts
  section: {
    marginBottom: space.xxl
  },
  sectionTitle: {
    ...text.title,
    color: palette.ink,
    marginBottom: space.md
  },
  emptyPosts: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.xl,
    alignItems: "center"
  },
  emptyPostsText: {
    ...text.body,
    color: palette.inkMuted
  }
});
