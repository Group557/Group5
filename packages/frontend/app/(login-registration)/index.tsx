import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { supabase } from "../../../../utils/supabase";
import {
  BrandMark,
  Button,
  Icon,
  Screen,
  TextField,
  colors,
  space,
  typography
} from "../../theme";

type Mode = "sign-in" | "register";

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";

  function switchMode(next: Mode) {
    setMode(next);
    setMessage("");
    setIsError(false);
  }

  // Route the user to either onboarding or the dashboard depending
  // on their onboarded status.
  async function routeUser(userID: string) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", userID)
      .single();

    if (error) {
      console.error(error.message);
      setMessage(error.message);
      setIsError(true);
      return;
    }
    if (profile?.onboarded) {
      router.replace("/dashboard");
    } else {
      router.replace("/(onboarding)/onboard");
    }
  }

  async function handleRegister() {
    setMessage("");
    setIsError(false);
    setBusy(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password
      });

      if (error) {
        setMessage(error.message);
        setIsError(true);
        console.log("You got a supabase Error");
        return;
      }

      if (!data.session) {
        setIsError(false);
        setMessage(
          "Check your email to confirm your account, then sign in."
        );
      } else {
        setIsError(false);
        setMessage("Account created! You are signed in.");
      }
    } catch {
      setMessage("Unable to Register");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleSignIn() {
    setMessage("");
    setIsError(false);
    setBusy(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

      if (error) {
        setMessage(error.message);
        setIsError(true);
        console.log("You got a supabase Error");
        return;
      }

      await routeUser(data.user.id);
    } catch {
      setMessage("Unable to sign in. Please try again");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit() {
    if (isRegister) {
      void handleRegister();
    } else {
      void handleSignIn();
    }
  }

  return (
    <Screen scroll keyboard>
      <View style={styles.brand}>
        <BrandMark />
        <Text style={styles.tagline}>
          Your fitness, all in one place.
        </Text>
      </View>

      <View
        style={styles.segmented}
        accessibilityRole="tablist">
        <Segment
          label="Sign in"
          active={!isRegister}
          onPress={() => {
            switchMode("sign-in");
          }}
        />
        <Segment
          label="Create account"
          active={isRegister}
          onPress={() => {
            switchMode("register");
          }}
        />
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoComplete={
          isRegister ? "new-password" : "current-password"
        }
        textContentType={
          isRegister ? "newPassword" : "password"
        }
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        trailing={
          <Pressable
            onPress={() => {
              setShowPassword((current) => !current);
            }}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }>
            <Icon
              name={{
                ios: showPassword ? "eye.slash" : "eye",
                android: showPassword
                  ? "visibility_off"
                  : "visibility",
                web: showPassword
                  ? "visibility_off"
                  : "visibility"
              }}
              size={18}
              color={colors.inkMuted}
              weight="regular"
            />
          </Pressable>
        }
      />

      {message ? (
        <View
          style={[
            styles.message,
            isError ? styles.messageError : styles.messageInfo
          ]}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert">
          <Text
            style={[
              styles.messageText,
              isError
                ? styles.messageTextError
                : styles.messageTextInfo
            ]}>
            {message}
          </Text>
        </View>
      ) : null}

      <Button
        label={isRegister ? "Create account" : "Sign in"}
        onPress={handleSubmit}
        loading={busy}
        style={styles.submit}
      />
    </Screen>
  );
}

function Segment({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[
        styles.segment,
        active ? styles.segmentActive : null
      ]}>
      <Text
        style={[
          styles.segmentLabel,
          active ? styles.segmentLabelActive : null
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brand: {
    paddingTop: space.huge,
    paddingBottom: space.xxl
  },
  tagline: {
    ...typography.body,
    color: colors.inkMuted,
    marginTop: space.sm
  },

  segmented: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSage,
    borderRadius: 14,
    padding: 4,
    marginBottom: space.lg
  },
  segment: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  segmentActive: {
    backgroundColor: colors.surface
  },
  segmentLabel: {
    ...typography.bodyStrong,
    color: colors.inkMuted
  },
  segmentLabelActive: {
    color: colors.forest
  },

  message: {
    marginTop: space.lg,
    borderRadius: 12,
    padding: space.md
  },
  messageError: {
    backgroundColor: colors.dangerSoft
  },
  messageInfo: {
    backgroundColor: colors.surfaceSage
  },
  messageText: {
    ...typography.caption
  },
  messageTextError: {
    color: colors.danger
  },
  messageTextInfo: {
    color: colors.ink
  },

  submit: {
    marginTop: space.xxl
  }
});
