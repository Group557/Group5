import { useState } from "react";
import { Button, Text, View } from "react-native";
import { supabase } from "../../../../utils/supabase";

export default function DashBoard() {
  const [message, setMessage] = useState("");

  async function handleLogout() {
    // TODO: Clear the previous message.
    setMessage("");

    try {
      // TODO: Await supabase.auth.signOut({ scope: "local" }).
      const { error } = await supabase.auth.signOut({
        scope: "local"
      });
      // Destructure "error" from the result.
      if (error) {
        setMessage(error.message);
      }
      // TODO: If there is an error, display its message.
    } catch {
      // TODO: Display "Unable to log out. Please try again."
      setMessage("Unable to log out. Please try again");
    }
  }

  return (
    <View>
      <Text>Dashboard Page</Text>

      <Button
        title="Log out"
        onPress={() => {
          void handleLogout();
        }}
      />

      {message ? <Text>{message}</Text> : null}
    </View>
  );
}
