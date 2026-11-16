import { globalStyles } from "@/constants/globalStyles";
import { palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Stack, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";

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
import { supabase } from "../../../../../utils/supabase";


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

const EMPTY_PROFILE: ProfileForm = {
  photoUri: null,
  name: "",
  username: "",
  email: "",
  gender: "",
  pronouns: "",
  heightFeet: "",
  heightInches: "",
};

type PickerField = "gender";

function Avatar({ size, uri }: { size: number; uri: string | null }) {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image
    source={{ uri }}
    style={[styles.avatar, shape]}
    resizeMode="cover"
  />;
  }
  return (
    <View style={[styles.avatar, shape]}>
      <Ionicons name="person" size={size * 0.55} color={palette.forest} />
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
      <Text style={globalStyles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [globalStyles.input, styles.selectInput, pressed && globalStyles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Choose ${label}`}
      >
        <Text style={value ? styles.selectText : styles.selectPlaceholder}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={palette.sage} />
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
                style={({ pressed }) => [styles.optionRow, pressed && globalStyles.pressed]}
                onPress={() => choose(option)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={20} color={palette.forest} />}
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

function cmToFeetInches(cm: number | null) {
  if (!cm) return { feet: "", inches: "" };
  const totalInches = Math.round(cm / 2.54);
  return {
    feet: String(Math.floor(totalInches / 12)),
    inches: String(totalInches % 12),
  };
}

function feetInchesToCm(feet: string, inches: string) {
  if (!feet && !inches) return null;
  const totalInches = Number(feet || 0) * 12 + Number(inches || 0);
  return Math.round(totalInches * 2.54);
}

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>(EMPTY_PROFILE);
  const [saved, setSaved] = useState<ProfileForm>(EMPTY_PROFILE);
  const [openPicker, setOpenPicker] = useState<PickerField | null>(null);

  // Update one field without touching the others.
  function updateField<K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const errors = getErrors(form);
  const isValid = Object.keys(errors).length === 0;
  const hasChanges = JSON.stringify(form) !== JSON.stringify(saved);
  const canSave = hasChanges && isValid;
  const [signingOut, setSigningOut] = useState(false);
  const { session } = useAuth();
const [loadingProfile, setLoadingProfile] = useState(true);

const loadProfile = useCallback(async () => {
  if (!session) return;
  setLoadingProfile(true);

  const { data, error } = await supabase
    .from("profiles")
    .select("first_name, last_name, username, picture_url, gender, height_cm")
    .eq("id", session.user.id)
    .single();

  if (error) {
    Alert.alert("Couldn't load profile", error.message);
  } else {
    const { feet, inches } = cmToFeetInches(data.height_cm);
    const loaded: ProfileForm = {
      photoUri: data.picture_url,
      name: [data.first_name, data.last_name].filter(Boolean).join(" "),
      username: data.username ?? "",
      email: session.user.email ?? "",
      gender: data.gender ?? "",
      pronouns: "",
      heightFeet: feet,
      heightInches: inches,
    };
    setForm(loaded);
    setSaved(loaded);
  }
  setLoadingProfile(false);
}, [session]);

useFocusEffect(
  useCallback(() => {
    void loadProfile();
  }, [loadProfile])
);

  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    setSigningOut(false);

    if (error) {
      Alert.alert("Sign out failed", error.message);
      return;
    }
    router.replace("/login");
}

async function pickPhoto() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert("Permission needed", "Allow photo access to change your profile photo.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 1,
  });
  if (result.canceled) return;
  
  const { uri, width } = result.assets[0];
  
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    width > 800 ? [{ resize: { width: 800 } }] : [],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  
  updateField("photoUri", resized.uri);
}

  async function uploadAvatar(localUri: string, userId: string) {
    const response = await fetch(localUri);
    const blob = await response.blob();
    const contentType = blob.type || "image/jpeg";
    const extension = contentType.split("/")[1] ?? "jpg";
    const path = `${userId}/avatar-${Date.now()}.${extension}`;
  
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, await blob.arrayBuffer(), { contentType, upsert: true });
    if (error) throw error;
  
    return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  }

  const [savingProfile, setSavingProfile] = useState(false);

async function handleSave() {
  if (!session) {
    console.log("handleSave: no session");
    return;
  }
  setSavingProfile(true);

  try {
    // Upload only if a new photo was picked (local file, not an existing URL).
    let avatarUrl = form.photoUri;
    if (form.photoUri && !form.photoUri.startsWith("http")) {
      avatarUrl = await uploadAvatar(form.photoUri, session.user.id);
    }

    const [firstName, ...rest] = form.name.trim().split(/\s+/);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName ?? "",
        last_name: rest.join(" "),
        username: form.username,
        picture_url: avatarUrl,
        gender: form.gender || null,
        height_cm: feetInchesToCm(form.heightFeet, form.heightInches),
      })
      .eq("id", session.user.id);

    if (error?.code === "23505") {
      console.log("handleSave: username taken");
      Alert.alert("Username taken", "Please choose a different username.");
      return;
    }
    if (error) throw error;

    const updated = { ...form, photoUri: avatarUrl };
    setForm(updated);
    setSaved(updated);
  } catch (err) {
    console.error("handleSave failed:", err)
    Alert.alert("Couldn't save", err instanceof Error ? err.message : "Please try again.");
  } finally {
    setSavingProfile(false);
  }
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={globalStyles.screen}
        contentContainerStyle={globalStyles.screenContent}
        keyboardShouldPersistTaps="handled"
      >
        <Stack.Screen options={{ headerShown: false }} />

        <Text style={globalStyles.eyebrow}>POLYFIT</Text>
        <Text style={globalStyles.pageTitle}>Profile</Text>
        <Text style={[globalStyles.subtitle, styles.headerGap]}>Manage your account details.</Text>

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
            style={({ pressed }) => [styles.photoRow, pressed && globalStyles.pressed]}
            onPress={pickPhoto}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
          >
            <View>
              <Avatar size={64} uri={form.photoUri} />
              <View style={styles.photoBadge}>
                <Ionicons name="camera" size={13} color={palette.onDark} />
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

          <Text style={globalStyles.label}>Name</Text>
          <TextInput
            style={globalStyles.input}
            value={form.name}
            onChangeText={(text) => updateField("name", text)}
            placeholder="Your name"
            placeholderTextColor={palette.placeholder}
            autoCapitalize="words"
          />
          {errors.name && <Text style={globalStyles.errorText}>{errors.name}</Text>}

          <Text style={globalStyles.label}>Username</Text>
          <View style={[globalStyles.input, styles.prefixInput]}>
            <Text style={styles.prefix}>@</Text>
            <TextInput
              style={styles.prefixField}
              value={form.username}
              onChangeText={(text) =>
                updateField("username", text.toLowerCase().replace(/\s/g, ""))
              }
              placeholder="username"
              placeholderTextColor={palette.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.username && <Text style={globalStyles.errorText}>{errors.username}</Text>}

          <Text style={globalStyles.label}>Email</Text>
          <TextInput
            style={globalStyles.input}
            value={form.email}
            onChangeText={(text) => updateField("email", text.trim())}
            placeholder="you@calpoly.edu"
            placeholderTextColor={palette.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email && <Text style={globalStyles.errorText}>{errors.email}</Text>}

          <SelectField
            label="Gender"
            value={form.gender}
            placeholder="Select gender"
            onPress={() => setOpenPicker("gender")}
          />

          <Text style={globalStyles.label}>Pronouns</Text>
          <TextInput
            style={globalStyles.input}
            value={form.pronouns}
            onChangeText={(text) => updateField("pronouns", text)}
            placeholder="e.g. she/her"
            placeholderTextColor={palette.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={30}
          />

          <View style={styles.smallInputsRow}>
            <View style={styles.smallInputGroup}>
              <Text style={globalStyles.label}>Height (ft)</Text>
              <TextInput
                style={globalStyles.input}
                value={form.heightFeet}
                onChangeText={(text) => updateField("heightFeet", text.replace(/\D/g, ""))}
                placeholder="5"
                placeholderTextColor={palette.placeholder}
                keyboardType="number-pad"
                maxLength={1}
              />
            </View>
            <View style={styles.smallInputGroup}>
              <Text style={globalStyles.label}>Height (in)</Text>
              <TextInput
                style={globalStyles.input}
                value={form.heightInches}
                onChangeText={(text) => updateField("heightInches", text.replace(/\D/g, ""))}
                placeholder="11"
                placeholderTextColor={palette.placeholder}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              !canSave && styles.buttonDisabled,
              pressed && canSave && globalStyles.pressed,
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

        {/* Sign out button */}
        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            (pressed || signingOut) && globalStyles.pressed,
          ]}
          onPress={handleSignOut}
          disabled={signingOut}
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={18} color={palette.danger} />
          <Text style={styles.signOutText}>
            {signingOut ? "Signing out..." : "Sign out"}
          </Text>
        </Pressable>
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
  headerGap: {
    marginBottom: 22
  },

  // Heading

  // Identity card
  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: palette.forest,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  identityText: {
    flexShrink: 1,
  },
  identityName: {
    color: palette.onDark,
    fontSize: 17,
    fontWeight: "800",
  },
  identityHandle: {
    color: palette.onDarkMuted,
    fontSize: 14,
    marginTop: 2,
  },
  avatar: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
  },

  // Cards
  formCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 18,
  },
  cardSpacing: {
    marginTop: 16,
  },
  sectionEyebrow: {
    color: palette.sage,
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
    backgroundColor: palette.forest,
    borderWidth: 2,
    borderColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  photoTitle: {
    color: palette.forest,
    fontSize: 15,
    fontWeight: "700",
  },
  photoSubtitle: {
    color: palette.inkMuted,
    fontSize: 13,
    marginTop: 2,
  },
  removePhoto: {
    color: palette.danger,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },

  // Form
  prefixInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
  },
  prefix: {
    color: palette.sage,
    fontSize: 15,
    fontWeight: "700",
    marginRight: 2,
  },
  prefixField: {
    flex: 1,
    color: palette.forest,
    fontSize: 15,
    paddingVertical: 12,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: palette.forest,
    fontSize: 15,
  },
  selectPlaceholder: {
    color: palette.placeholder,
    fontSize: 15,
  },
  smallInputsRow: {
    flexDirection: "row",
    gap: 12,
  },
  smallInputGroup: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: palette.forest,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 22,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  saveButtonText: {
    color: palette.onDark,
    fontSize: 16,
    fontWeight: "800",
  },

  // Pop-up sheet
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: palette.backdrop,
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: palette.surface,
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
    backgroundColor: palette.line,
    marginBottom: 14,
  },
  sheetTitle: {
    color: palette.forest,
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
    borderBottomColor: palette.line,
  },
  optionText: {
    color: palette.forest,
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
    backgroundColor: palette.forest,
    borderRadius: 11,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  useButtonText: {
    color: palette.onDark,
    fontSize: 15,
    fontWeight: "800",
  },

  // Sign out button
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 16,
  },
  signOutText: {
    color: palette.danger,
    fontSize: 16,
    fontWeight: "800",
  },
});