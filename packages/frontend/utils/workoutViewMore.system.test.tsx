import {
  fireEvent,
  render,
  screen
} from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WorkoutHomePage from "../app/(tabs)/workout/index";

jest.mock("@/context/AuthProvider", () => ({
  useAuth: () => ({
    session: { user: { id: "user-1" } }
  })
}));

jest.mock("expo-router", () => {
  const React = jest.requireActual<typeof import("react")>(
    "react"
  );

  return {
    router: { push: jest.fn() },
    useFocusEffect: (callback: () => void | (() => void)) => {
      React.useEffect(callback, [callback]);
    }
  };
});

jest.mock("../../../utils/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            order: jest.fn(() => ({
              returns: jest.fn(() =>
                Promise.resolve({
                  data: [
                    {
                      id: 10,
                      workout_name: "Full Body Day",
                      performed_at: "2026-11-20T12:00:00.000Z",
                      weight_unit: "lb",
                      exercises: [
                        {
                          id: 1,
                          position: 1,
                          exercise: { exercise_name: "Squat" },
                          sets: []
                        },
                        {
                          id: 2,
                          position: 2,
                          exercise: {
                            exercise_name: "Bench Press"
                          },
                          sets: []
                        },
                        {
                          id: 3,
                          position: 3,
                          exercise: { exercise_name: "Deadlift" },
                          sets: []
                        },
                        {
                          id: 4,
                          position: 4,
                          exercise: { exercise_name: "Pull-Up" },
                          sets: []
                        }
                      ]
                    }
                  ],
                  error: null
                })
              )
            }))
          }))
        }))
      }))
    }))
  }
}));

test("loads a workout and shows every exercise after View more is pressed", async () => {
  // Arrange: render the real screen, which loads the mocked workout.
  await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 }
      }}>
      <WorkoutHomePage />
    </SafeAreaProvider>
  );

  expect(await screen.findByText("Full Body Day")).toBeTruthy();
  expect(screen.getByText("Squat")).toBeTruthy();
  expect(screen.getByText("Bench Press")).toBeTruthy();
  expect(screen.getByText("Deadlift")).toBeTruthy();
  expect(screen.queryByText("Pull-Up")).toBeNull();

  // Act: press the real button shown for the fourth, hidden exercise.
  await fireEvent.press(screen.getByText("View more (1)"));

  // Assert: the screen, state, and visibility utility work together.
  expect(screen.getByText("Pull-Up")).toBeTruthy();
  expect(screen.getByText("View less")).toBeTruthy();
});
