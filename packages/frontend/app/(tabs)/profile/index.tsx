import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const COLORS = {
  page: "#F8F6F0",
  green: "#154734",
  sage: "#789F90",
  gray: "#6B7280",
  card: "#FFFFFF",
  inputBorder: "#DCEBE5",
  inputBg: "#FAFCFA",
  placeholder: "#A3B5AD",
  error: "#B42318",
  backdrop: "rgba(0, 0, 0, 0.35)",
};

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

type ProfileForm = {
  photoUri: string | null;
  name: string;
  username: string;
  email: string;
  gender: string;
  pronouns: string;
  heightFeet: string;
  heightInches: string;
};

const INITIAL_PROFILE: ProfileForm = {
  photoUri: null,
  name: "John Smith",
  username: "johnsmith",
  email: "johnsmith@calpoly.edu",
  gender: "Male",
  pronouns: "He/him",
  heightFeet: "5",
  heightInches: "11",
};

type PickerField = "gender";

function Avatar({ size, uri }: { size: number; uri: string | null }) {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[styles.avatar, shape]} />;
  }
  return (
    <View style={[styles.avatar, shape]}>
      <Ionicons name="person" size={size * 0.55} color={COLORS.green} />
    </View>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
};

function SelectField({ label, value, placeholder, onPress }: SelectFieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [styles.input, styles.selectInput, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Choose ${label}`}
      >
        <Text style={value ? styles.selectText : styles.selectPlaceholder}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.sage} />
      </Pressable>
    </View>
  );
}

type OptionPickerProps = {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

function OptionPicker({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: OptionPickerProps) {
  const [custom, setCustom] = useState("");

  function choose(value: string) {
    onSelect(value);
    setCustom("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{title}</Text>

          {options.map((option) => {
            const isSelected = option === selected;
            return (
              <Pressable
                key={option}
                style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
                onPress={() => choose(option)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={20} color={COLORS.green} />}
              </Pressable>
            );
          })}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getErrors(form: ProfileForm) {
  const errors: Partial<Record<keyof ProfileForm, string>> = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!/^[a-z0-9._]{3,20}$/.test(form.username)) {
    errors.username = "3–20 characters: lowercase letters, numbers, . or _";
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email.";
  return errors;
}

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>(INITIAL_PROFILE);
  const [saved, setSaved] = useState<ProfileForm>(INITIAL_PROFILE);
  const [openPicker, setOpenPicker] = useState<PickerField | null>(null);

  // Update one field without touching the others.
  function updateField<K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const errors = getErrors(form);
  const isValid = Object.keys(errors).length === 0;
  const hasChanges = JSON.stringify(form) !== JSON.stringify(saved);
  const canSave = hasChanges && isValid;

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to change your profile photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      updateField("photoUri", result.assets[0].uri);
    }
  }

  function handleSave() {
    // TODO: send `form` to your backend here (e.g. update the user's profile).
    // Upload the photo from form.photoUri, and convert heights with Number(...).
    setSaved(form);
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Stack.Screen options={{ headerShown: false }} />

        <Text style={styles.eyebrow}>POLYFIT</Text>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account details.</Text>

        {/* Identity card — shows the last saved version */}
        <View style={styles.identityCard}>
          <Avatar size={56} uri={saved.photoUri} />
          <View style={styles.identityText}>
            <Text style={styles.identityName}>{saved.name}</Text>
            <Text style={styles.identityHandle}>
              @{saved.username}
              {saved.pronouns ? ` · ${saved.pronouns}` : ""}
            </Text>
          </View>
        </View>

        {/* Editable account form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionEyebrow}>ACCOUNT</Text>

          {/* Profile photo */}
          <Pressable
            style={({ pressed }) => [styles.photoRow, pressed && styles.pressed]}
            onPress={pickPhoto}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
          >
            <View>
              <Avatar size={64} uri={form.photoUri} />
              <View style={styles.photoBadge}>
                <Ionicons name="camera" size={13} color="#FFFFFF" />
              </View>
            </View>
            <View>
              <Text style={styles.photoTitle}>Profile photo</Text>
              <Text style={styles.photoSubtitle}>Tap to choose from your library</Text>
            </View>
          </Pressable>
          {form.photoUri && (
            <Pressable onPress={() => updateField("photoUri", null)} accessibilityRole="button">
              <Text style={styles.removePhoto}>Remove photo</Text>
            </Pressable>
          )}

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => updateField("name", text)}
            placeholder="Your name"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="words"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.label}>Username</Text>
          <View style={[styles.input, styles.prefixInput]}>
            <Text style={styles.prefix}>@</Text>
            <TextInput
              style={styles.prefixField}
              value={form.username}
              onChangeText={(text) =>
                updateField("username", text.toLowerCase().replace(/\s/g, ""))
              }
              placeholder="username"
              placeholderTextColor={COLORS.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => updateField("email", text.trim())}
            placeholder="you@calpoly.edu"
            placeholderTextColor={COLORS.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <SelectField
            label="Gender"
            value={form.gender}
            placeholder="Select gender"
            onPress={() => setOpenPicker("gender")}
          />

          <Text style={styles.label}>Pronouns</Text>
          <TextInput
            style={styles.input}
            value={form.pronouns}
            onChangeText={(text) => updateField("pronouns", text)}
            placeholder="e.g. she/her"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={30}
          />

          <View style={styles.smallInputsRow}>
            <View style={styles.smallInputGroup}>
              <Text style={styles.label}>Height (ft)</Text>
              <TextInput
                style={styles.input}
                value={form.heightFeet}
                onChangeText={(text) => updateField("heightFeet", text.replace(/\D/g, ""))}
                placeholder="5"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="number-pad"
                maxLength={1}
              />
            </View>
            <View style={styles.smallInputGroup}>
              <Text style={styles.label}>Height (in)</Text>
              <TextInput
                style={styles.input}
                value={form.heightInches}
                onChangeText={(text) => updateField("heightInches", text.replace(/\D/g, ""))}
                placeholder="11"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              !canSave && styles.buttonDisabled,
              pressed && canSave && styles.pressed,
            ]}
            onPress={handleSave}
            disabled={!canSave}
            accessibilityRole="button"
          >
            <Text style={styles.saveButtonText}>
              {hasChanges ? "Save changes" : "Saved"}
            </Text>
          </Pressable>
        </View>

        {/* Settings row */}
        <Link href="/profile/settings" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.formCard,
              styles.cardSpacing,
              styles.settingsRow,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <View style={styles.settingsLeft}>
            <View style={styles.settingsIcon}>
              <Ionicons name="settings-outline" size={20} color={COLORS.green} />
            </View>
            <View style={styles.settingsTextBlock}>
              <View style={styles.settingsTitleRow}>
                <Text style={styles.settingsTitle}>Settings</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.sage} />
              </View>
              </View>
          </View>
          </Pressable>
        </Link>
      </ScrollView>

      {/* Pop-up pickers */}
      <OptionPicker
        visible={openPicker === "gender"}
        title="Gender"
        options={GENDER_OPTIONS}
        selected={form.gender}
        onSelect={(value) => updateField("gender", value)}
        onClose={() => setOpenPicker(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  pressed: {
    opacity: 0.7,
  },

  // Heading
  eyebrow: {
    color: COLORS.sage,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: COLORS.green,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 22,
  },

  // Identity card
  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.green,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  identityText: {
    flexShrink: 1,
  },
  identityName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  identityHandle: {
    color: "#BFD3CA",
    fontSize: 14,
    marginTop: 2,
  },
  avatar: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  // Cards
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
  },
  cardSpacing: {
    marginTop: 16,
  },
  sectionEyebrow: {
    color: COLORS.sage,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // Photo
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 14,
  },
  photoBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  photoTitle: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: "700",
  },
  photoSubtitle: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 2,
  },
  removePhoto: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },

  // Form
  label: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 11,
    backgroundColor: COLORS.inputBg,
    color: COLORS.green,
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  prefixInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
  },
  prefix: {
    color: COLORS.sage,
    fontSize: 15,
    fontWeight: "700",
    marginRight: 2,
  },
  prefixField: {
    flex: 1,
    color: COLORS.green,
    fontSize: 15,
    paddingVertical: 12,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: COLORS.green,
    fontSize: 15,
  },
  selectPlaceholder: {
    color: COLORS.placeholder,
    fontSize: 15,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
  },
  smallInputsRow: {
    flexDirection: "row",
    gap: 12,
  },
  smallInputGroup: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 22,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  // Pop-up sheet
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.backdrop,
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.inputBorder,
    marginBottom: 14,
  },
  sheetTitle: {
    color: COLORS.green,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  optionText: {
    color: COLORS.green,
    fontSize: 16,
  },
  optionTextSelected: {
    fontWeight: "800",
  },
  customRow: {
    flexDirection: "row",
    gap: 10,
  },
  customInput: {
    flex: 1,
  },
  useButton: {
    backgroundColor: COLORS.green,
    borderRadius: 11,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  useButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // Settings row
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsTitle: {
    color: COLORS.green,
    fontSize: 16,
    fontWeight: "800",
  },
  settingsSubtitle: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 2,
  },
  settingsLeft: {
    flex: 1,              // fill the card's width
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsTextBlock: {
    flex: 1,              // take all space next to the icon
  },
  settingsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // word left, chevron right
  },
});