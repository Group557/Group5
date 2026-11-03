import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
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
const PILL_HEIGHT = 36;
/** Extends the pills' touch area to the platform minimum. */
const PILL_HIT_SLOP = (layout.minTouch - PILL_HEIGHT) / 2;

/* ------------------------------------------------------------------ *
 * Editable detail
 * ------------------------------------------------------------------ */

type EditableDetailProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  maxLength?: number;
};

/**
 * Same box as the Buddy Finder details, with the text swapped for
 * an input so you can see how your card will look while editing.
 */
function EditableDetail({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  maxLength
}: EditableDetailProps) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.inkMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[
          styles.detailInput,
          multiline && styles.detailInputMultiline
        ]}
        accessibilityLabel={label}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export default function BuddyMyProfileScreen() {
  // Insets come from the provider Expo Router mounts at the root.
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [majorAndYear, setMajorAndYear] = useState("");
  const [gymGoals, setGymGoals] = useState("");
  const [workoutStyle, setWorkoutStyle] = useState("");
  const [schedule, setSchedule] = useState("");
  const [bio, setBio] = useState("");

  const handleChangePhotoPress = () => {
    // TODO: pick a profile photo
  };

  const handleSavePress = () => {
    // TODO: save my buddy profile
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View
        style={[
          styles.screen,
          {
            paddingTop: Math.max(
              insets.top,
              layout.minTopInset
            ),
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
          <Text
            style={styles.title}
            numberOfLines={1}
            accessibilityRole="header">
            My Profile
          </Text>
          <Pressable
            onPress={handleSavePress}
            hitSlop={PILL_HIT_SLOP}
            style={({ pressed }) => [
              styles.pill,
              pressed && styles.pressed
            ]}
            accessibilityRole="button"
            accessibilityLabel="Save profile">
            <Text style={styles.pillText}>Save</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + space.xxl }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Profile card */}
          <View style={styles.card}>
            <Pressable
              onPress={handleChangePhotoPress}
              style={({ pressed }) => [
                styles.photo,
                pressed && styles.pressed
              ]}
              accessibilityRole="button"
              accessibilityLabel="Change photo">
              <Icon
                name={{
                  ios: "camera",
                  android: "photo_camera",
                  web: "photo_camera"
                }}
                size={24}
                color={palette.sage}
              />
              <Text style={styles.photoText}>
                Tap to add a photo
              </Text>
            </Pressable>

            <View style={styles.nameRow}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor={palette.inkMuted}
                autoCapitalize="words"
                style={[styles.nameInput, styles.flex]}
                accessibilityLabel="Name"
              />
              <TextInput
                value={age}
                onChangeText={setAge}
                placeholder="Age"
                placeholderTextColor={palette.inkMuted}
                keyboardType="number-pad"
                maxLength={2}
                style={[styles.nameInput, styles.ageInput]}
                accessibilityLabel="Age"
              />
            </View>
            <TextInput
              value={majorAndYear}
              onChangeText={setMajorAndYear}
              placeholder="Major and year"
              placeholderTextColor={palette.inkMuted}
              autoCapitalize="words"
              style={styles.subtitleInput}
              accessibilityLabel="Major and year"
            />

            <View style={styles.details}>
              <EditableDetail
                label="Gym goals"
                value={gymGoals}
                onChangeText={setGymGoals}
                placeholder="Edit"
                multiline
              />
              <EditableDetail
                label="Workout style"
                value={workoutStyle}
                onChangeText={setWorkoutStyle}
                placeholder="Edit"
                multiline
              />
              <EditableDetail
                label="Schedule"
                value={schedule}
                onChangeText={setSchedule}
                placeholder="Edit"
                multiline
              />
              <EditableDetail
                label="Bio"
                value={bio}
                onChangeText={setBio}
                placeholder="Edit"
                multiline
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  screen: {
    flex: 1,
    backgroundColor: palette.canvas
  },
  content: {
    paddingHorizontal: layout.screenGutter,
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
    paddingHorizontal: layout.screenGutter,
    marginBottom: space.sm
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    minWidth: 64,
    minHeight: layout.minTouch
  },
  backLabel: {
    ...text.bodyStrong,
    color: palette.sage
  },
  title: {
    ...text.title,
    color: palette.ink,
    textAlign: "center",
    flex: 1
  },
  pill: {
    minWidth: 64,
    height: PILL_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    backgroundColor: palette.forest
  },
  pillText: {
    ...text.label,
    color: palette.onDark
  },

  // Profile card
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.lg
  },
  photo: {
    width: "100%",
    aspectRatio: PHOTO_ASPECT_RATIO,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    marginBottom: space.lg
  },
  photoText: {
    ...text.caption,
    color: palette.inkMuted
  },
  nameRow: {
    flexDirection: "row",
    gap: space.sm
  },
  nameInput: {
    ...text.title,
    color: palette.ink,
    minHeight: layout.minTouch
  },
  ageInput: {
    width: 64,
    textAlign: "center"
  },
  subtitleInput: {
    ...text.caption,
    color: palette.ink,
    minHeight: layout.minTouch
  },
  details: {
    gap: space.sm,
    marginTop: space.md
  },
  detail: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.xs
  },
  detailLabel: {
    ...text.eyebrow,
    color: palette.sage
  },
  detailInput: {
    ...text.caption,
    color: palette.ink,
    marginTop: 2,
    paddingVertical: 2
  },
  detailInputMultiline: {
    textAlignVertical: "top"
  }
});
