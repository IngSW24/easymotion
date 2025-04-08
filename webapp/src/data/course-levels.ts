import { CourseDto } from "@easymotion/openapi";

export const courseLevels: LiteralUnionDescriptor<CourseDto["level"]> = [
  { value: "BASIC", label: "Base" },
  { value: "MEDIUM", label: "Intermedio" },
  { value: "ADVANCED", label: "Avanzato" },
];
