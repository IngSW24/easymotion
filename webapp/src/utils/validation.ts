import { z } from "zod";

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string) => {
  return z.string().email().safeParse(email).success;
};

/**
 * Zod password validation schema
 */
export const passwordValidationSchema = z
  .string()
  .min(6, "La password deve contenere almeno 6 caratteri")
  .regex(/\d/, "La password deve contenere almeno un numero");

/**
 * Ensures that a password meets the specified constraints
 * @param password - The password to validate
 * @returns True if the password is valid, false otherwise
 */
export const ensurePasswordConstraints = (password: string) => {
  return passwordValidationSchema.safeParse(password).success;
};
