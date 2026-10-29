import { Text, View } from "react-native";
import { EXPERIENCE_OPTIONS } from "./options";
import SelectionCard from "./SelectionCard";
import { styles } from "./styles";
import type { ExperienceLevel } from "./types";

type ExperienceFormProps = {
  value: ExperienceLevel | null;
  onChange: (value: ExperienceLevel) => void;
};

export default function ExperienceForm({
  value,
  onChange
}: ExperienceFormProps) {
  return (
    <View>
      <Text style={styles.title}>
        What is your current workout experience?
      </Text>

      <Text style={styles.description}>Choose one option.</Text>

      <View style={styles.options}>
        {EXPERIENCE_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={value === option.value}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </View>
  );
}
