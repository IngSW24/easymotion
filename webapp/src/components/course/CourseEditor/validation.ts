import { CreateCourseDto } from "../../../../client/data-contracts";

type FormErrors = {
  [key in keyof CreateCourseDto]: string;
};

/**
 * The default errors for the entity (all empty).
 */
export const defaultErrors = Object.fromEntries(
  Object.keys({} as CreateCourseDto).map((key) => [key, ""])
) as FormErrors;

/**
 * Validates a single field of the entity.
 * @param name the name of the entity field
 * @param value the value of the entity field
 * @returns empty string if no errors, otherwise the error message
 */
export const validateField = (
  name: string,
  value: CreateCourseDto[keyof CreateCourseDto]
) => {
  if (typeof value === "string") {
    switch (name) {
      case "organizer":
        if (!value) return "Organizer is required.";
        if (value.length < 3) return "Organizer must be at least 3 characters.";
        break;
      case "instructor":
        if (!value) return "Instructor is required.";
        break;
      case "description":
        if (!value) return "Description is required.";
        if (value.length < 10)
          return "Description must be at least 10 characters.";
        break;
      case "location":
        if (!value) return "Location is required.";
        break;
      default:
        break;
    }
  } else if (typeof value === "number") {
    switch (name) {
      case "cost":
        if (isNaN(value)) return "Cost must be a valid number.";
        if (value < 0) return "Cost must be non-negative.";
        break;
      default:
        break;
    }
  } else {
    return `${name} has an invalid value.`;
  }

  return ""; // No errors
};

/**
 * Validates all fields of the entity.
 * @param formData the entity to validate
 * @returns a map of errors for each field
 */
export const validateForm = (formData: CreateCourseDto): FormErrors => {
  const errors: FormErrors = defaultErrors;
  for (const key in formData) {
    const error = validateField(key, formData[key as keyof CreateCourseDto]);
    if (error) errors[key as keyof CreateCourseDto] = error;
  }
  return errors;
};

export const hasErrors = (errors: FormErrors) => {
  return Object.values(errors).some((error) => error !== "");
};
