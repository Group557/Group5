import { Text, TextInput, View } from "react-native";
import { styles } from "./styles";

type AgeFormProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function AgeForm({
  value,
  onChange
}: AgeFormProps) {
  return (
    <View>
      <Text style={styles.title}>How old are you?</Text>

      <Text style={styles.description}>This is optional.</Text>

      <Text style={styles.fieldLabel}>Age</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Age in years"
        placeholderTextColor="#666666"
        keyboardType="number-pad"
        accessibilityLabel="Age in years, optional"
      />
    </View>
  );
}
