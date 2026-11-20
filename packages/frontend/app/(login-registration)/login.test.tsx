import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { supabase } from "../../../../utils/supabase";
import LoginScreen from "./login";

// Fake Supabase so no network call happens.
// signInWithPassword succeeds, then the profile lookup says "onboarded".
jest.mock("../../../../utils/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(() =>
        Promise.resolve({ data: { user: { id: "user-1" } }, error: null })
      ),
      signUp: jest.fn()
    },
    from: jest.fn(() => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: { onboarded: true }, error: null })
        })
      })
    }))
  }
}));

// Fake router so no real navigation happens.
jest.mock("expo-router", () => ({
  router: { replace: jest.fn() }
}));

test("signs in with the typed email and password", async () => {
  // Arrange
  await render(<LoginScreen />);

  // Act
  await fireEvent.changeText(
    screen.getByPlaceholderText("Email"),
    "student@calpoly.edu"
  );
  await fireEvent.changeText(
    screen.getByPlaceholderText("Password"),
    "secret123"
  );
  await fireEvent.press(screen.getByText("Sign in"));

  // Assert
  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: "student@calpoly.edu",
    password: "secret123"
  });
  expect(router.replace).toHaveBeenCalledWith("/home");
});
