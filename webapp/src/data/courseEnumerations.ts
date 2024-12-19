import { CourseEntity } from "../../client/data-contracts";

export type EnumDescriptor<T extends string> = {
  value: T;
  label: string;
}[];

export const courseCategories: EnumDescriptor<CourseEntity["category"]> = [
  { value: "ACQUAGYM", label: "Acquagym" },
  { value: "CROSSFIT", label: "Crossfit" },
  { value: "PILATES", label: "Pilates" },
  { value: "ZUMBA_FITNESS", label: "Zumba Fitness" },
  { value: "POSTURAL_TRAINING", label: "Postural Training" },
  { value: "BODYWEIGHT_WORKOUT", label: "Bodyweight Workout" },
];

export const courseLevels: EnumDescriptor<CourseEntity["level"]> = [
  { value: "BASIC", label: "Basic" },
  { value: "MEDIUM", label: "Medium" },
  { value: "ADVANCED", label: "Advanced" },
];

export const courseFrequencies: EnumDescriptor<CourseEntity["frequency"]> = [
  { value: "SINGLE_SESSION", label: "Single Session" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

export const courseAvilabilities: EnumDescriptor<CourseEntity["availability"]> =
  [
    { value: "ACTIVE", label: "Active" },
    { value: "COMING_SOON", label: "Coming Soon" },
    { value: "NO_LONGER_AVAILABLE", label: "No Longer Available" },
  ];
