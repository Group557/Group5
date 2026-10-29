import { Pressable, Text, View } from "react-native";
import { GENDER_OPTIONS } from "./options";
import { styles } from "./styles";
import type { Gender } from "./types";

type GenderFormProps = {
  gender: Gender | null;
  onChange: (value: Gender | null) => void;
};

export default function GenderForm({
  gender,
  onChange
}: GenderFormProps) {
  return (
    <View>
      <Text style={styles.title}>What is your gender?</Text>

      <Text style={styles.description}>
        This is optional. You can skip this question.
      </Text>

      <View style={styles.options}>
        {GENDER_OPTIONS.map((option) => {
          const selected = gender === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() =>
                onChange(
                  gender === option.value ? null : option.value
                )
              }
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
