import { Text, TextInput, View } from "react-native";
import { styles } from "./styles";

type NameFormProps = {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
};

export default function NameForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange
}: NameFormProps) {
  return (
    <View>
      <Text style={styles.title}>What’s your name?</Text>

      <Text style={styles.description}>
        Enter your first and last name to get started.
      </Text>

      <Text style={styles.fieldLabel}>First name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={onFirstNameChange}
        placeholder="First name"
        placeholderTextColor="#666666"
        autoCapitalize="words"
        autoCorrect={false}
        accessibilityLabel="First name, required"
      />

      <Text style={styles.fieldLabel}>Last name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={onLastNameChange}
        placeholder="Last name"
        placeholderTextColor="#666666"
        autoCapitalize="words"
        autoCorrect={false}
        accessibilityLabel="Last name, required"
      />
    </View>
  );
}
