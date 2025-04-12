import { CourseDto } from "@easymotion/openapi";

export const courseLevels: LiteralUnionDescriptor<CourseDto["level"]> = [
  { value: "BASIC", label: "Base" },
  { value: "MEDIUM", label: "Intermedio" },
  { value: "ADVANCED", label: "Avanzato" },
];

export const getCourseLevelName = (value: string) =>
  courseLevels.find((o) => o.value === value)?.label ?? value;
