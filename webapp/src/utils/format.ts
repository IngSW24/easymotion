import { AuthUserDto } from "@easymotion/openapi";
import { DateTime } from "luxon";

/**
 * Formats a user's name
 * @param user - The user to format
 * @returns The formatted name
 */
export const formatUserName = (
  user: AuthUserDto | null | undefined
): string => {
  if (!user) {
    return "";
  }

  return [user.firstName, user.middleName, user.lastName]
    .join(" ")
    .trim()
    .replace(/\s+/g, " "); // Replace multiple spaces with a single space
};

/**
 * Ensures that a password meets the specified constraints
 * @param password - The password to validate
 * @returns True if the password is valid, false otherwise
 */
export const ensurePasswordConstraints = (password: string) => {
  const regex = /^(?=.*[0-9]).{6,}$/;
  return regex.test(password);
};

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Extracts tags from a space-separated string
 * @param tagsSpaceSeparated - The space-separated string of tags
 * @returns An array of tags
 */
export const extractTags = (tagsSpaceSeparated: string) => {
  return tagsSpaceSeparated
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(" ")
    .filter((x) => x !== "");
};

/**
 * Calculates the duration between two dates
 * @param start - The start date
 * @param end - The end date
 * @returns The duration in hours and minutes
 */
export const calculateDuration = (start: DateTime, end: DateTime) => {
  const diff = end.diff(start, ["hours", "minutes"]);
  const hours = Math.floor(diff.hours);
  const minutes = Math.floor(diff.minutes);

  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? "minuto" : "minuti"}`;
  } else if (minutes === 0) {
    return `${hours} ${hours === 1 ? "ora" : "ore"}`;
  } else {
    return `${hours} ${hours === 1 ? "ora" : "ore"} e ${minutes} ${
      minutes === 1 ? "minuto" : "minuti"
    }`;
  }
};
