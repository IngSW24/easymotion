import { CourseEntity } from "../../client/data-contracts";

export const courseCategories: LiteralUnionDescriptor<
  CourseEntity["category"]
> = [
  { value: "ACQUAGYM", label: "Acquagym" },
  { value: "CROSSFIT", label: "Crossfit" },
  { value: "PILATES", label: "Pilates" },
  { value: "ZUMBA_FITNESS", label: "Zumba Fitness" },
  { value: "POSTURAL_TRAINING", label: "Training Posturale" },
  { value: "BODYWEIGHT_WORKOUT", label: "Workout Corpo Libero" },
];

export const courseLevels: LiteralUnionDescriptor<CourseEntity["level"]> = [
  { value: "BASIC", label: "Base" },
  { value: "MEDIUM", label: "Intermedio" },
  { value: "ADVANCED", label: "Avanzato" },
];

export const courseFrequencies: LiteralUnionDescriptor<
  CourseEntity["frequency"]
> = [
  { value: "SINGLE_SESSION", label: "Sessione singola" },
  { value: "WEEKLY", label: "Settimanale" },
  { value: "MONTHLY", label: "Mensile" },
];

export const courseAvilabilities: LiteralUnionDescriptor<
  CourseEntity["availability"]
> = [
  { value: "ACTIVE", label: "Attivo" },
  { value: "COMING_SOON", label: "Disponibile a breve" },
  { value: "NO_LONGER_AVAILABLE", label: "Non disponibile" },
];
