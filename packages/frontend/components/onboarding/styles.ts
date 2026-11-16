import { palette } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: palette.canvas
    },
    content: {
      padding: 24,
      paddingBottom: 40
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: palette.ink,
      marginBottom: 12
    },
    description: {
      fontSize: 16,
      color: palette.inkMuted,
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
      borderColor: palette.chromeLine,
      backgroundColor: palette.chrome,
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    optionSelected: {
      backgroundColor: palette.forest,
      borderColor: palette.forest
    },
    optionPressed: {
      opacity: 0.8
    },
    optionLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: palette.ink
    },
    optionLabelSelected: {
      color: palette.onDark
    },
    checkmark: {
      color: palette.onDark,
      fontSize: 20,
      fontWeight: "700"
    },
    progress: {
      fontSize: 14,
      color: palette.inkMuted,
      marginBottom: 16
    },
    fieldLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: palette.ink,
      marginBottom: 8
    },
    input: {
      minHeight: 56,
      borderWidth: 1,
      borderColor: palette.line,
      borderRadius: 12,
      backgroundColor: palette.surface,
      padding: 16,
      fontSize: 16,
      color: palette.ink,
      marginBottom: 20
    },
    primaryButton: {
      minHeight: 56,
      backgroundColor: palette.forest,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      justifyContent: "center"
    },
    primaryButtonText: {
      color: palette.onDark,
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
      color: palette.ink,
      fontSize: 16,
      fontWeight: "600"
    },
    error: {
      color: palette.danger,
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
        color: palette.inkMuted,
        marginTop: 6,
      },
      disabled: {
        opacity: 0.6,
      },
  });
  