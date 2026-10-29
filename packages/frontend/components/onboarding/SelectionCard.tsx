import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";

type SelectionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  multiple?: boolean;
  disabled?: boolean;
};

export default function SelectionCard({
  label,
  description,
  selected,
  onPress,
  multiple = false,
  disabled = false
}: SelectionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={multiple ? "checkbox" : "radio"}
      accessibilityLabel={
        description ? `${label}. ${description}` : label
      }
      accessibilityState={{ checked: selected, disabled }}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.optionPressed,
        disabled && styles.disabled
      ]}>
      <View style={styles.cardContent}>
        <Text
          style={[
            styles.optionLabel,
            selected && styles.optionLabelSelected
          ]}>
          {label}
        </Text>

        {description ? (
          <Text
            style={[
              styles.cardDescription,
              selected && styles.optionLabelSelected
            ]}>
            {description}
          </Text>
        ) : null}
      </View>

      {selected && (
        <Text style={styles.checkmark} accessible={false}>
          ✓
        </Text>
      )}
    </Pressable>
  );
}
