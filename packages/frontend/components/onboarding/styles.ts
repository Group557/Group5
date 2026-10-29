import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#F5F4EE"
    },
    content: {
      padding: 24,
      paddingBottom: 40
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: "#234A38",
      marginBottom: 12
    },
    description: {
      fontSize: 16,
      color: "#454545",
      marginBottom: 24
    },
    options: {
      gap: 12
    },
    option: {
      minHeight: 56,
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#D1D0C5",
      backgroundColor: "#E4E2D6",
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    optionSelected: {
      backgroundColor: "#234A38",
      borderColor: "#234A38"
    },
    optionPressed: {
      opacity: 0.8
    },
    optionLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: "#1E1E1E"
    },
    optionLabelSelected: {
      color: "#FFFFFF"
    },
    checkmark: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "700"
    },
    progress: {
      fontSize: 14,
      color: "#454545",
      marginBottom: 16
    },
    fieldLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1E1E1E",
      marginBottom: 8
    },
    input: {
      minHeight: 56,
      borderWidth: 1,
      borderColor: "#666666",
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      padding: 16,
      fontSize: 16,
      color: "#1E1E1E",
      marginBottom: 20
    },
    primaryButton: {
      minHeight: 56,
      backgroundColor: "#234A38",
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      justifyContent: "center"
    },
    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700"
    },
    backButton: {
      minHeight: 48,
      padding: 12,
      alignItems: "center",
      justifyContent: "center"
    },
    backButtonText: {
      color: "#234A38",
      fontSize: 16,
      fontWeight: "600"
    },
    error: {
      color: "#A12622",
      fontSize: 16,
      marginTop: 16
    },
    navigation: {
      marginTop: 24,
      gap: 8
    },
    cardContent: {
        flex: 1,
      },
      cardDescription: {
        fontSize: 14,
        color: "#454545",
        marginTop: 6,
      },
      disabled: {
        opacity: 0.6,
      },
  });
  