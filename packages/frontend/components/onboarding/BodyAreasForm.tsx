import { Text, View } from "react-native";
import { BODY_AREA_OPTIONS } from "./options";
import SelectionCard from "./SelectionCard";
import { styles } from "./styles";
import type { BodyFocusArea } from "./types";

type BodyAreasFormProps = {
  selectedAreas: BodyFocusArea[];
  onToggle: (area: BodyFocusArea) => void;
};

export default function BodyAreasForm({
  selectedAreas,
  onToggle
}: BodyAreasFormProps) {
  return (
    <View>
      <Text style={styles.title}>
        Which areas would you like to focus on?
      </Text>

      <Text style={styles.description}>
        Choose Full body or one or more specific areas.
      </Text>

      <View style={styles.options}>
        {BODY_AREA_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={selectedAreas.includes(option.value)}
            onPress={() => onToggle(option.value)}
            multiple
          />
        ))}
      </View>
    </View>
  );
}
