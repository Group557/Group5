import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { useAuth } from "../context/AuthProvider";
import { supabase } from "../../../utils/supabase";

/**
 * The signed-in user's first name from their profile, or null while
 * it loads or when none is saved. Reloads each time the screen comes
 * into focus, so a name changed on the Profile tab shows up right
 * away on the other tabs.
 */
export function useFirstName(): string | null {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [loadedName, setLoadedName] = useState<{
    userId: string;
    firstName: string | null;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      if (userId == null) {
        return;
      }

      async function loadFirstName(id: string) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", id)
          .single();

        if (!cancelled) {
          setLoadedName({
            userId: id,
            firstName: profile?.first_name?.trim() || null
          });
        }
      }
      void loadFirstName(userId);
      return () => {
        cancelled = true;
      };
    }, [userId])
  );

  // Ignore a name loaded for a previous user.
  return loadedName !== null && loadedName.userId === userId
    ? loadedName.firstName
    : null;
}
