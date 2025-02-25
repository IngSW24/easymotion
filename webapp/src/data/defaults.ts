import { CourseEntity } from "@easymotion/openapi";

export const defaultCourse: CourseEntity = {
  description: "",
  location: "",
  cost: 0.0,
  id: "",
  name: "",
  short_description: "",
  schedule: [],
  instructors: [],
  category: "ACQUAGYM",
  level: "BASIC",
  frequency: "SINGLE_SESSION",
  session_duration: "PT",
  availability: "ACTIVE",
  num_registered_members: 1,
  tags: [],
  created_at: "",
  updated_at: "",
};
