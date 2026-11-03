import { useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

/* ------------------------------------------------------------------ *
 * Filter options
 *
 * Placeholder choices until buddy profiles come from the backend.
 * No option picked in a group means "any".
 * ------------------------------------------------------------------ */

const GOAL_OPTIONS = [
  "Build muscle",
  "Lose weight",
  "Get stronger",
  "Improve endurance",
  "Stay active",
  "Train for a sport"
];

const GENDER_OPTIONS = ["Women", "Men", "Non-binary"];

const AVAILABILITY_OPTIONS = [
  "Early morning",
  "Morning",
  "Afternoon",
  "Evening",
  "Late night",
  "Weekends"
];

const AGE_INPUT_WIDTH = 72;
const CHIP_HEIGHT = 36;
/** Extends the chips' touch area to the platform minimum. */
const CHIP_HIT_SLOP = (layout.minTouch - CHIP_HEIGHT) / 2;

/** Adds the option if it is missing, removes it if it is there. */
function toggle(list: string[], option: string) {
  return list.includes(option)
    ? list.filter((item) => item !== option)
    : [...list, option];
}

/* ------------------------------------------------------------------ *
 * UI primitives
 * ------------------------------------------------------------------ */

type ChipGroupProps = {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
};

function ChipGroup({
  options,
  selected,
  onToggle
}: ChipGroupProps) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Pressable
            key={option}
            onPress={() => onToggle(option)}
            hitSlop={CHIP_HIT_SLOP}
            style={({ pressed }) => [
              styles.chip,
              isSelected && styles.chipSelected,
              pressed && styles.pressed
            ]}
            accessibilityRole="checkbox"
            accessibilityLabel={option}
            accessibilityState={{ checked: isSelected }}>
            <Text
              style={[
                styles.chipText,
                isSelected && styles.chipTextSelected
              ]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type SectionProps = {
  title: string;
  hint?: string;
  children: ReactNode;
};

function Section({ title, hint, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint ? (
        <Text style={styles.sectionHint}>{hint}</Text>
      ) : null}
      {children}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export default function BuddyFiltersScreen() {
  // Insets come from the provider Expo Router mounts at the root.
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [major, setMajor] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>(
    []
  );

  const handleResetPress = () => {
    setMinAge("");
    setMaxAge("");
    setMajor("");
    setGoals([]);
    setGenders([]);
    setAvailability([]);
  };

  const handleApplyPress = () => {
    // TODO: pass the filters back to Buddy Finder
    router.back();
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerButton,
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
          <Text style={styles.headerButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          Filters
        </Text>
        <Pressable
          onPress={handleResetPress}
          style={({ pressed }) => [
            styles.headerButton,
            styles.headerButtonRight,
            pressed && styles.pressed
          ]}
          accessibilityRole="button"
          accessibilityLabel="Reset filters">
          <Text style={styles.headerButtonText}>Reset</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + space.xxl }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Section title="Age">
          <View style={styles.ageRow}>
            <TextInput
              value={minAge}
              onChangeText={setMinAge}
              placeholder="Min"
              placeholderTextColor={palette.inkMuted}
              keyboardType="number-pad"
              maxLength={2}
              style={[styles.input, styles.ageInput]}
              accessibilityLabel="Minimum age"
            />
            <Text style={styles.ageDash}>to</Text>
            <TextInput
              value={maxAge}
              onChangeText={setMaxAge}
              placeholder="Max"
              placeholderTextColor={palette.inkMuted}
              keyboardType="number-pad"
              maxLength={2}
              style={[styles.input, styles.ageInput]}
              accessibilityLabel="Maximum age"
            />
          </View>
        </Section>

        <Section title="Major">
          <TextInput
            value={major}
            onChangeText={setMajor}
            placeholder="Any major"
            placeholderTextColor={palette.inkMuted}
            autoCapitalize="words"
            style={styles.input}
            accessibilityLabel="Major"
          />
        </Section>

        <Section
          title="Gym goals"
          hint="Pick as many as you like.">
          <ChipGroup
            options={GOAL_OPTIONS}
            selected={goals}
            onToggle={(option) =>
              setGoals(toggle(goals, option))
            }
          />
        </Section>

        <Section title="Gender">
          <ChipGroup
            options={GENDER_OPTIONS}
            selected={genders}
            onToggle={(option) =>
              setGenders(toggle(genders, option))
            }
          />
        </Section>

        <Section title="Availability">
          <ChipGroup
            options={AVAILABILITY_OPTIONS}
            selected={availability}
            onToggle={(option) =>
              setAvailability(toggle(availability, option))
            }
          />
        </Section>
        {/* Sits right under the last section. */}
        <Pressable
          onPress={handleApplyPress}
          style={({ pressed }) => [
            styles.applyButton,
            pressed && styles.pressed
          ]}
          accessibilityRole="button"
          accessibilityLabel="Apply filters">
          <Text style={styles.applyText}>Apply filters</Text>
        </Pressable>
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
    paddingHorizontal: layout.screenGutter,
    marginBottom: space.sm
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    minWidth: 64,
    minHeight: layout.minTouch
  },
  headerButtonRight: {
    justifyContent: "flex-end"
  },
  headerButtonText: {
    ...text.bodyStrong,
    color: palette.sage
  },
  title: {
    ...text.title,
    color: palette.ink,
    textAlign: "center",
    flex: 1
  },

  // Sections
  section: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    marginBottom: space.md
  },
  sectionTitle: {
    ...text.eyebrow,
    color: palette.sage,
    marginBottom: space.md
  },
  sectionHint: {
    ...text.caption,
    color: palette.inkMuted,
    marginTop: -space.sm,
    marginBottom: space.md
  },

  // Inputs
  input: {
    ...text.body,
    color: palette.ink,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    minHeight: layout.minTouch
  },
  ageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md
  },
  ageInput: {
    width: AGE_INPUT_WIDTH,
    textAlign: "center"
  },
  ageDash: {
    ...text.body,
    color: palette.inkMuted
  },

  // Chips
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm
  },
  chip: {
    minHeight: CHIP_HEIGHT,
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    borderWidth: 1.5,
    borderColor: palette.forest,
    backgroundColor: palette.surface
  },
  chipSelected: {
    backgroundColor: palette.forest
  },
  chipText: {
    ...text.label,
    color: palette.forest
  },
  chipTextSelected: {
    color: palette.onDark
  },

  // Apply
  applyButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.forest,
    marginTop: space.sm
  },
  applyText: {
    ...text.bodyStrong,
    color: palette.onDark
  }
});
