import AgeForm from "@/components/onboarding/AgeForm";
import GenderForm from "@/components/onboarding/GenderForm";
import GoalForm from "@/components/onboarding/GoalForm";
import HeightForm from "@/components/onboarding/HeightForm";
import NameForm from "@/components/onboarding/NameForm";

import AvailabilityForm from "@/components/onboarding/AvailabilityForm";
import BodyAreasForm from "@/components/onboarding/BodyAreasForm";
import ExperienceForm from "@/components/onboarding/ExperienceForm";

import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  View,
  type ScrollViewInstance
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../../../utils/supabase";
import { styles } from "../../components/onboarding/styles";
import { useAuth } from "../../context/AuthProvider";

import type {
  BodyFocusArea,
  ExperienceLevel,
  Gender,
  OnboardingStep,
  PrimaryGoal
} from "@/components/onboarding/types";

import {
  BODY_AREA_OPTIONS,
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS
} from "@/components/onboarding/options";

export default function Onboarding() {
  const [primaryGoal, setPrimaryGoal] =
    useState<PrimaryGoal | null>(null);
  // 1. Get session and refreshProfile from useAuth.
  const { session, refreshProfile } = useAuth();

  // 2. Create state:
  // saving: boolean, initially false
  // message: string, initially empty
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("name");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [heightInput, setHeightInput] = useState("");

  const [gender, setGender] = useState<Gender | null>(null);

  const [bodyFocusAreas, setBodyFocusAreas] = useState<
    BodyFocusArea[]
  >([]);

  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);

  const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState<
    number | null
  >(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const submittingRef = useRef(false);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentStep]);

  const needsBodyAreas =
    primaryGoal === "build_muscle" ||
    primaryGoal === "improve_strength";

  const steps: OnboardingStep[] = [
    "name",
    "age",
    "height",
    "gender",
    "goal"
  ];

  if (needsBodyAreas) {
    steps.push("bodyAreas");
  }

  steps.push("experience", "availability");

  const currentStepIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isOptionalStep =
    currentStep === "age" ||
    currentStep === "height" ||
    currentStep === "gender";

  const isPersonalInfoStep =
    currentStep === "name" || isOptionalStep;

  function goToStep(step: OnboardingStep) {
    Keyboard.dismiss();
    setMessage("");
    setCurrentStep(step);
  }

  function handleBack() {
    if (submittingRef.current) return;

    const previousStep = steps[currentStepIndex - 1];

    if (previousStep) {
      goToStep(previousStep);
    }
  }
  function handleGoalSelect(goal: PrimaryGoal) {
    setPrimaryGoal(goal);
    setMessage("");

    const goalUsesBodyAreas =
      goal === "build_muscle" || goal === "improve_strength";

    if (!goalUsesBodyAreas) {
      setBodyFocusAreas([]);
    }
  }

  function handleBodyAreaToggle(area: BodyFocusArea) {
    setMessage("");

    setBodyFocusAreas((previous) => {
      if (area === "full_body") {
        return previous.includes("full_body")
          ? []
          : ["full_body"];
      }

      const specificAreas = previous.filter(
        (selectedArea) => selectedArea !== "full_body"
      );

      if (specificAreas.includes(area)) {
        return specificAreas.filter(
          (selectedArea) => selectedArea !== area
        );
      }

      return [...specificAreas, area];
    });
  }
  function validateStep(step: OnboardingStep): string | null {
    switch (step) {
      case "name":
        return firstName.trim() && lastName.trim()
          ? null
          : "Please enter both your first and last name.";

      case "age": {
        const input = ageInput.trim();
        if (input === "") return null;

        const age = Number(input);
        return /^\d+$/.test(input) &&
          Number.isInteger(age) &&
          age >= 1 &&
          age <= 120
          ? null
          : "Enter a whole-number age from 1 to 120, or leave it blank.";
      }

      case "height": {
        const input = heightInput.trim();
        if (input === "") return null;

        const height = Number(input);
        return /^\d+(\.\d+)?$/.test(input) &&
          Number.isFinite(height) &&
          height > 0
          ? null
          : "Enter a positive height in centimeters, or leave it blank.";
      }

      case "gender":
        return gender === null ||
          gender === "male" ||
          gender === "female"
          ? null
          : "Select Male or Female, or leave it unselected.";

      case "goal":
        return GOAL_OPTIONS.some(
          (option) => option.value === primaryGoal
        )
          ? null
          : "Please select your main fitness goal.";

      case "bodyAreas": {
        if (!needsBodyAreas) return null;

        const allAreasValid = bodyFocusAreas.every((area) =>
          BODY_AREA_OPTIONS.some(
            (option) => option.value === area
          )
        );

        const hasDuplicates =
          new Set(bodyFocusAreas).size !==
          bodyFocusAreas.length;

        const mixesFullBody =
          bodyFocusAreas.includes("full_body") &&
          bodyFocusAreas.length > 1;

        return bodyFocusAreas.length > 0 &&
          allAreasValid &&
          !hasDuplicates &&
          !mixesFullBody
          ? null
          : "Choose Full body or at least one specific area.";
      }

      case "experience":
        return EXPERIENCE_OPTIONS.some(
          (option) => option.value === experienceLevel
        )
          ? null
          : "Please select your workout experience.";

      case "availability":
        return workoutDaysPerWeek !== null &&
          Number.isInteger(workoutDaysPerWeek) &&
          workoutDaysPerWeek >= 1 &&
          workoutDaysPerWeek <= 7
          ? null
          : "Please select between 1 and 7 workout days.";
    }
  }

  function handleNext() {
    if (submittingRef.current) return;

    const error = validateStep(currentStep);

    if (error) {
      setMessage(error);
      return;
    }

    if (isLastStep) {
      void handleSubmit();
      return;
    }

    const nextStep = steps[currentStepIndex + 1];

    if (nextStep) {
      goToStep(nextStep);
    }
  }

  async function handleSubmit() {
    if (submittingRef.current) return;

    if (!session) {
      setMessage("Please sign in to finish onboarding.");
      return;
    }

    // Recheck every applicable form before saving.
    for (const step of steps) {
      const error = validateStep(step);

      if (error) {
        goToStep(step);
        setMessage(error);
        return;
      }
    }

    submittingRef.current = true;
    setSaving(true);
    setMessage("");
    Keyboard.dismiss();

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          age:
            ageInput.trim() === ""
              ? null
              : Number(ageInput.trim()),
          height_cm:
            heightInput.trim() === ""
              ? null
              : Number(heightInput.trim()),
          gender,
          primary_goal: primaryGoal,
          body_focus_areas: needsBodyAreas
            ? bodyFocusAreas
            : null,
          experience_level: experienceLevel,
          workout_days_per_week: workoutDaysPerWeek,
          onboarded: true
        })
        .eq("id", session.user.id)
        .select("onboarded")
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!profile?.onboarded) {
        setMessage(
          "Your onboarding information could not be saved."
        );
        return;
      }

      await refreshProfile();
    } catch {
      setMessage("Unable to save. Please try again.");
    } finally {
      submittingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      {message ? (
        <Text style={styles.error} accessibilityRole="alert">
          {message}
        </Text>
      ) : null}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets>
        <Text style={styles.progress}>
          Step {currentStepIndex + 1} of {totalSteps}
        </Text>

        {currentStep === "name" && (
          <NameForm
            firstName={firstName}
            lastName={lastName}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
          />
        )}

        {currentStep === "age" && (
          <AgeForm value={ageInput} onChange={setAgeInput} />
        )}
        {currentStep === "height" && (
          <HeightForm
            value={heightInput}
            onChange={setHeightInput}
          />
        )}
        {currentStep === "gender" && (
          <GenderForm gender={gender} onChange={setGender} />
        )}
        {currentStep === "goal" && (
          <GoalForm
            primaryGoal={primaryGoal}
            onChange={handleGoalSelect}
          />
        )}

        {currentStep === "bodyAreas" && (
          <BodyAreasForm
            selectedAreas={bodyFocusAreas}
            onToggle={handleBodyAreaToggle}
          />
        )}

        {currentStep === "experience" && (
          <ExperienceForm
            value={experienceLevel}
            onChange={(value) => {
              setExperienceLevel(value);
              setMessage("");
            }}
          />
        )}

        {currentStep === "availability" && (
          <AvailabilityForm
            value={workoutDaysPerWeek}
            onChange={(value) => {
              setWorkoutDaysPerWeek(value);
              setMessage("");
            }}
            disabled={saving}
          />
        )}
        <View style={styles.navigation}>
          {currentStepIndex > 0 && (
            <Pressable
              onPress={handleBack}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Back to previous step"
              accessibilityState={{ disabled: saving }}
              style={[
                styles.backButton,
                saving && styles.disabled
              ]}>
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleNext}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel={
              saving
                ? "Saving onboarding"
                : isLastStep
                  ? "Finish onboarding"
                  : "Next step"
            }
            accessibilityState={{
              disabled: saving,
              busy: saving
            }}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.optionPressed,
              saving && styles.disabled
            ]}>
            <Text style={styles.primaryButtonText}>
              {saving
                ? "Saving..."
                : isLastStep
                  ? "Finish onboarding"
                  : "Next"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
