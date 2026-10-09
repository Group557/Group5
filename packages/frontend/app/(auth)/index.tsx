import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
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
      router.replace("/dashboard");
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
      return;
    }

    await routeUser(data.user.id);
  }

  return (
    <View>
      <h1>Account Login/Create an Account</h1>
      <Text>Enter your Cal poly Email</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          width: 180,
          height: 25,
          padding: 5,
          fontSize: 13,
          boxSizing: "border-box",
          borderWidth: 1
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        style={{
          width: 180,
          height: 25,
          borderWidth: 1,
          padding: 10
        }}
      />
      <button
        style={{
          width: 140,
          height: 25,
          fontSize: 13
        }}

        onClick={handleRegister}>
        Register
      </button>
      <button onClick={handleSignIn}>Sign in</button>
      <Text>{message}</Text>
    </View>
  );
}
