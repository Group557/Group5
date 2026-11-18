import {
  createContext,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from "react";

import type { Exercise } from "@/components/workout/add_exercise_modal";

export type WorkoutSet = {
  id: string;
  reps: string;
  weight: string;
};

export type WorkoutExercise = Exercise & {
  sets: WorkoutSet[];
};

type StateSetter<T> = Dispatch<SetStateAction<T>>;

type WorkoutDraftContextValue = {
  workoutName: string;
  setWorkoutName: StateSetter<string>;
  category: string;
  setCategory: StateSetter<string>;
  description: string;
  setDescription: StateSetter<string>;
  addedExercises: WorkoutExercise[];
  setAddedExercises: StateSetter<WorkoutExercise[]>;
  createSet: () => WorkoutSet;
  resetDraft: () => void;
};

const WorkoutDraftContext =
  createContext<WorkoutDraftContextValue | null>(null);

export default function WorkoutDraftProvider({
  children
}: {
  children: ReactNode;
}) {
  const [workoutName, setWorkoutName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [addedExercises, setAddedExercises] = useState<
    WorkoutExercise[]
  >([]);

  const nextSetId = useRef(1);

  const createSet = (): WorkoutSet => {
    const set: WorkoutSet = {
      id: `added-${nextSetId.current}`,
      reps: "",
      weight: ""
    };

    nextSetId.current += 1;
    return set;
  };

  const resetDraft = () => {
    setWorkoutName("");
    setCategory("");
    setDescription("");
    setAddedExercises([]);
  };

  return (
    <WorkoutDraftContext.Provider
      value={{
        workoutName,
        setWorkoutName,
        category,
        setCategory,
        description,
        setDescription,
        addedExercises,
        setAddedExercises,
        createSet,
        resetDraft
      }}>
      {children}
    </WorkoutDraftContext.Provider>
  );
}

export function useWorkoutDraft() {
  const context = useContext(WorkoutDraftContext);

  if (context === null) {
    throw new Error(
      "useWorkoutDraft must be used inside WorkoutDraftProvider"
    );
  }

  return context;
}
