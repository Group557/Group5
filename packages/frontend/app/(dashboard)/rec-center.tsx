import { StyleSheet, Text, View } from "react-native";

export default function RecCenterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rec Center</Text>

      <Text style={styles.sectionHeading}>Activity Tracker</Text>
      <Text style={styles.placeholder}>Gym activity will show here.</Text>

      <Text style={styles.sectionHeading}>Scan QR Code</Text>
      <Text style={styles.placeholder}>QR code will show here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8F6F0",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#154734",
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#154734",
    marginTop: 16,
  },
  placeholder: {
    fontSize: 14,
    color: "#555555",
    marginTop: 4,
  },
});
