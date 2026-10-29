import { Text, TextInput, View } from "react-native";
import { styles } from "./styles";

type HeightFormProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function HeightForm({
  value,
  onChange
}: HeightFormProps) {
  return (
    <View>
      <Text style={styles.title}>What is your height?</Text>

      <Text style={styles.description}>
        Enter your height in centimeters. This is optional.
      </Text>

      <Text style={styles.fieldLabel}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="For example, 175.5"
        placeholderTextColor="#666666"
        keyboardType="decimal-pad"
        accessibilityLabel="Height in centimeters, optional"
      />
    </View>
  );
}
