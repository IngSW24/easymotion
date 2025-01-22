import { useState } from "react";

export interface ValidatorRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: unknown) => string | null;
}

export interface ValidatorTemplate {
  [field: string]: ValidatorRule;
}

export interface UseFormValidatorResult<T> {
  errors: { [K in keyof T]?: { e: boolean; eText?: string } };
  validate: () => boolean;
  resetErrors: () => void;
  setError: (field: keyof T, eText: string) => void;
}

/**
 * Custom hook for form validation in React.
 *
 * This hook manages form data and validation rules. It allows you to:
 * 1. Bind form data to your form fields.
 * 2. Validate fields according to provided validation rules (e.g., required, pattern matching, custom validation).
 * 3. Track validation errors and provide feedback to the user.
 *
 * @param initialValues - The initial values of the form fields.
 * @param validatorRules - The validation rules for each field, such as required, pattern, etc.
 * @returns A tuple containing:
 *   - `formData`: The current values of the form fields.
 *   - `handleChange`: A function to handle field value changes, update form data, and validate.
 *   - `validationResult`: An object containing the current validation state, with methods to validate the form, reset errors, and set specific errors for fields.
 */
export function useFormValidator<T extends Record<string, unknown>>(
  initialValues: T,
  validatorRules: ValidatorTemplate
): [T, (field: keyof T, value: T[keyof T]) => void, UseFormValidatorResult<T>] {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{
    [K in keyof T]?: { e: boolean; eText?: string };
  }>({});

  /**
   * Validates a single form field based on the defined validation rules.
   *
   * @param field - The name of the field being validated.
   * @param value - The value of the field being validated.
   * @returns A validation error message if validation fails, or null if valid.
   */
  const validateField = (field: keyof T, value: T[keyof T]): string | null => {
    const rule = validatorRules[field as string];

    if (!rule) return null;

    if (rule.required && value === "") {
      return "Questo campo è obbligatorio";
    }

    if (rule.pattern && !rule.pattern.test(value as string)) {
      console.log(value);
      return "Formato non valido";
    }

    if (rule.minLength && (value as string).length < rule.minLength) {
      return `Questo campo deve essere lungo almeno ${rule.minLength} caratteri`;
    }

    if (rule.maxLength && (value as string).length > rule.maxLength) {
      return `Questo campo deve essere lungo al massimo ${rule.maxLength} caratteri`;
    }

    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) return customError;
    }

    return null;
  };

  /**
   * Handles changes in form field values. It updates the form data and validates the field.
   *
   * @param field - The name of the field that changed.
   * @param value - The new value for the field.
   */
  const handleChange = (field: keyof T, value: T[keyof T]) => {
    console.log(`Handle changes on ${String(field)}`);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    const errorText = validateField(field, value);
    console.log(errorText);

    setErrors((prev) => ({
      ...prev,
      [field]: errorText
        ? { e: true, eText: errorText }
        : { e: false, eText: null },
    }));
  };

  /**
   * Validates all fields in the form based on the defined validation rules.
   *
   * @returns Returns true if all fields are valid, otherwise false.
   */
  const validate = (): boolean => {
    let isValid = true;
    const newErrors: typeof errors = {};

    for (const field in validatorRules) {
      const value = formData[field];
      const errorText = validateField(field as keyof T, value as T[keyof T]);

      if (errorText) {
        isValid = false;
        newErrors[field as keyof T] = { e: true, eText: errorText };
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Resets all form validation errors.
   */
  const resetErrors = () => {
    setErrors({});
  };

  /**
   * Manually sets an error for a specific field.
   *
   * @param field - The field that needs the error.
   * @param errorText - The error message to be set.
   */
  const setError = (field: keyof T, errorText: string): void => {
    setErrors((prev) => ({
      ...prev,
      [field]: { e: true, eText: errorText },
    }));
  };

  return [
    formData,
    handleChange,
    {
      errors,
      validate,
      resetErrors,
      setError,
    },
  ];
}
