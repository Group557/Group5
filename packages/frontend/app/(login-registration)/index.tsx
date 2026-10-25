import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { supabase } from "../../../../utils/supabase";

async function Login() {
  //pass
}
export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  //route user to either onboarding or dashboard depending on their onboarded status
  async function routeUser(userID: string) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", userID)
      .single();

    if (error) {
      console.error(error.message);
      setMessage(error.message);
      return;
    }
    if (profile?.onboarded) {
      router.replace("/homepage");
    } else {
      router.replace("/(onboarding)/onboard");
    }
  }
  //registering user
  async function handleRegister() {
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password
      });
      if (error) {
        setMessage(error.message);
        console.log("You got a supabase Error");

        return;
      }
      if (!data.session) {
        setMessage(
          "Check your email to confirm your account, then sign in."
        );
      } else {
        setMessage("Account created! You are signed in.");
      }
    } catch {
      setMessage("Unable to Register");
    }
  }

  async function handleSignIn() {
    setMessage("");

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

    if (error) {
      setMessage(error.message);
      console.log("You got a supabase Error");
      return;
    }

    await routeUser(data.user.id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.login_text}>
          Account Login/Create an Account
        </Text>
        <Text>Enter your Cal poly Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />
        <Pressable
          style={styles.button}

          onPress={handleRegister}>
          <Text>Register(first time users)</Text>
        </Pressable>
        <Pressable onPress={handleSignIn} style={styles.button}>
          <Text>Sign in</Text>
        </Pressable>
        <Text>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#234636"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignSelf: "center",
    marginTop: 100,
    width: "100%",
    height: "auto",
    maxWidth: 400
  },
  login_text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222222"
  },
  input: {
    width: "100%",
    minHeight: 40,
    backgroundColor: "#E5E4D7",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#222222"
  },
  button: {
    width: "100%",
    minHeight: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#222222",
    backgroundColor: "#84AA9E",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  }
});
