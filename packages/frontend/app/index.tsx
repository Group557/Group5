import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthProvider";

export default function Index() {
  const { session, onboarded } = useAuth();

  if (!session) return <Redirect href="/login" />;
  if (!onboarded) return <Redirect href="/onboard" />;
  return <Redirect href="/home" />;
}
