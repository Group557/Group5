import { Text, View } from "react-native";
import { WORKOUT_DAY_OPTIONS } from "./options";
import SelectionCard from "./SelectionCard";
import { styles } from "./styles";

type AvailabilityFormProps = {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export default function AvailabilityForm({
  value,
  onChange,
  disabled = false
}: AvailabilityFormProps) {
  return (
    <View>
      <Text style={styles.title}>
        How many days per week can you realistically work out?
      </Text>

      <Text style={styles.description}>
        Choose a schedule that fits your week.
      </Text>

      <View style={styles.options}>
        {WORKOUT_DAY_OPTIONS.map((days) => (
          <SelectionCard
            key={days}
            label={`${days} ${days === 1 ? "day" : "days"}`}
            selected={value === days}
            onPress={() => onChange(days)}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
}
