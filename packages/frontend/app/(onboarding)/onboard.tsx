import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { supabase } from "../../../../utils/supabase";
import { useAuth } from "../../context/AuthProvider";

export default function Onboarding() {
  // 1. Get session and refreshProfile from useAuth.
  const { session, refreshProfile } = useAuth();

  // 2. Create state:
  // saving: boolean, initially false
  // message: string, initially empty
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    // 3. If already saving, stop.
    if (saving) {
      return;
    }

    // 4. If there is no session:
    // Show a message asking the user to sign in, then stop.
    if (!session) {
      setMessage("Please sign in to perform this action");
      return;
    }

    // 5. Start saving and clear the previous message.
    setSaving(true);
    setMessage("");

    try {
      // 6. Update the profiles table:
      // - Set onboarded to true.
      // - Match the row ID to session.user.id.
      // - Request the updated onboarded value.
      // - Expect one returned row.
      const { data: profile, error: queryError } =
        await supabase
          .from("profiles")
          .update({ onboarded: true })
          .eq("id", session.user.id)
          .select("onboarded")
          .single();

      // 7. If Supabase returns an error:
      // Show its message and stop.
      if (queryError) {
        setMessage(queryError.message);
        return;
      }

      // 8. If the returned profile doesn't confirm completion:
      // Show a failure message and stop.
      if (!profile?.onboarded) {
        setMessage("Your onboarded status could not be saved.");
        return;
      }
      await refreshProfile();

      // 9. Refresh the provider's profile information.
    } catch {
      // 10. Show a message for unexpected failures.
      setMessage("Unable to save. Please try again");
    } finally {
      // 11. Finish saving.
      setSaving(false);
    }
  }

  return (
    <View>
      <Text>Onboarding page</Text>

      {/* 12. Connect handleSubmit to onPress.
          Disable the button while saving. */}
      <Pressable
        disabled={saving}
        onPress={() => {
          void handleSubmit();
        }}>
        {/* Show "Saving..." while saving, otherwise "Submit". */}
        <Text>{saving ? "Saving..." : "Submit"}</Text>
      </Pressable>

      {message ? <Text>{message}</Text> : null}
    </View>
  );
}
