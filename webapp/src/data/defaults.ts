import { CourseEntity } from "../../client/data-contracts";

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
  session_duration: "",
  availability: "ACTIVE",
  num_registered_members: 0,
  tags: [],
  created_at: "",
  updated_at: "",
};
