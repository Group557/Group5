import { Pressable, Text, View } from "react-native";
import { GOAL_OPTIONS } from "./options";
import { styles } from "./styles";
import type { PrimaryGoal } from "./types";

type GoalFormProps = {
  primaryGoal: PrimaryGoal | null;
  onChange: (value: PrimaryGoal) => void;
};

export default function GoalForm({
  primaryGoal,
  onChange
}: GoalFormProps) {
  return (
    <View>
      <Text style={styles.title}>
        What is your main fitness goal?
      </Text>

      <Text style={styles.description}>
        Choose one goal. You can change it later.
      </Text>

      <View style={styles.options}>
        {GOAL_OPTIONS.map((option) => {
          const selected = primaryGoal === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: selected }}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.optionPressed
              ]}>
              <Text
                style={[
                  styles.optionLabel,
                  selected && styles.optionLabelSelected
                ]}>
                {option.label}
              </Text>

              {selected && (
                <Text
                  style={styles.checkmark}
                  accessible={false}>
                  ✓
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
