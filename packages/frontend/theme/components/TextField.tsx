import {
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { form } from "../styles";
import { colors, space, typography } from "../tokens";
import { Icon } from "./Icon";

export type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /** Validation message. Shown under the field and announced. */
  error?: string;
  /** Optional helper text. Replaced by the error when there is one. */
  hint?: string;
  secureTextEntry?: boolean;
  keyboardType?:
    "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?:
    "none" | "sentences" | "words" | "characters";
  autoComplete?:
    | "email"
    | "name"
    | "off"
    | "password"
    | "new-password"
    | "current-password";
  textContentType?:
    | "emailAddress"
    | "name"
    | "none"
    | "password"
    | "newPassword";
  returnKeyType?: "next" | "done" | "go" | "search";
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  multiline?: boolean;
  /** Height for multiline fields. */
  minHeight?: number;
  /** Optional control rendered inside the field, on the trailing edge. */
  trailing?: React.ReactNode;
  testID?: string;
};

/**
 * A labelled text field.
 *
 * The label is always rendered, so the field still makes sense once
 * the placeholder has disappeared, and screen readers announce the
 * label rather than a placeholder that changes as you type.
 */
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  onFocus,
  onBlur,
  autoFocus,
  multiline,
  minHeight,
  trailing,
  testID
}: TextFieldProps) {
  const hasError = Boolean(error);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputRow}>
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inkPlaceholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          style={[
            form.input,
            styles.input,
            hasError ? form.inputError : null,
            multiline && minHeight ? { minHeight } : null
          ]}
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
        />

        {trailing ? (
          <View style={styles.trailing}>{trailing}</View>
        ) : null}
      </View>

      {hasError ? (
        <View
          style={styles.errorRow}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert">
          <Icon
            name={{
              ios: "exclamationmark.circle.fill",
              android: "error",
              web: "error"
            }}
            size={14}
            color={colors.danger}
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: space.lg
  },
  label: {
    ...typography.fieldLabel,
    color: colors.ink,
    marginBottom: space.sm
  },
  inputRow: {
    position: "relative",
    justifyContent: "center"
  },
  input: {
    paddingRight: space.xl
  },
  trailing: {
    position: "absolute",
    right: space.sm
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space.sm,
    gap: space.xs
  },
  errorIcon: {
    marginTop: 1
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    flex: 1
  },
  hint: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: space.sm
  }
});
