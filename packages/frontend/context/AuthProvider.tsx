import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import { supabase } from "../../../utils/supabase";

type AuthConextValue = {
  session: Session | null;
  onboarded: boolean | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthConextValue | undefined>(
  undefined
);

export default function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [SessionLoading, setSessionLoading] = useState(true);
  const [onboarded, setOnboarded] = useState<boolean | null>(
    null
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ? means if session is null just return insetead of crashing
  const userId = session?.user.id;
  const refreshRequestVersion = useRef(0);

  // 4. Listen for the initial session, sign-in, and sign-out.
  useEffect(() => {
    const requestCounter = refreshRequestVersion;

    let previousUserId: string | undefined;
    const { data } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        const nextUserId = nextSession?.user.id;

        if (nextUserId !== previousUserId) {
          refreshRequestVersion.current++;
          setOnboarded(null);
          setError(null);
          setProfileLoading(Boolean(nextUserId));
          previousUserId = nextUserId;
        }
        setSession(nextSession);
        setSessionLoading(false);
      }
    );
    return () => {
      requestCounter.current++;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (userId == null) {
      return;
    }
    const requestVersion = ++refreshRequestVersion.current;

    async function loadProfile(id: string) {
      try {
        const { data: profile, error: queryError } =
          await supabase
            .from("profiles")
            .select("onboarded")
            .eq("id", id)
            .single();

        if (
          cancelled ||
          requestVersion !== refreshRequestVersion.current
        )
          return;

        if (queryError) {
          setError(queryError.message);
          return;
        }
        if (!profile) {
          setError("profile not found");
          return;
        }
        setOnboarded(profile.onboarded);
      } catch {
        if (
          !cancelled &&
          requestVersion === refreshRequestVersion.current
        ) {
          setError("Unable to load profile. Please try again");
        }
      } finally {
        if (
          !cancelled &&
          requestVersion === refreshRequestVersion.current
        ) {
          setProfileLoading(false);
        }
      }
    }
    void loadProfile(userId);
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function refreshProfile() {
    if (userId == null) {
      return;
    }

    const requestVersion = ++refreshRequestVersion.current;
    setProfileLoading(true);
    setError(null);
    setOnboarded(null);
    // TODO: Fetch this user's "onboarded" value from "profiles".
    // This is the same database query used in step 5.
    try {
      const { data: profile, error: queryError } =
        await supabase
          .from("profiles")
          .select("onboarded")
          .eq("id", userId)
          .single();

      if (requestVersion !== refreshRequestVersion.current) {
        return;
      }
      if (queryError) {
        setError(queryError.message);
        return;
      }
      if (!profile) {
        setError("Your profile could not be found.");
        return;
      }
      setOnboarded(profile.onboarded);
    } catch {
      if (requestVersion === refreshRequestVersion.current) {
        setError(
          "Your profile could not be refreshed. Please try again"
        );
      }
    } finally {
      if (requestVersion === refreshRequestVersion.current) {
        setProfileLoading(false);
      }
    }
  }

  // Step 7: Share the information with everything inside this provider.
  return (
    <AuthContext.Provider
      value={{
        session,
        onboarded,
        loading: SessionLoading || profileLoading,
        error,
        refreshProfile
      }}>
      {children}
    </AuthContext.Provider>
  );
}
// Step 8: Let components read the shared authentication information.
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
