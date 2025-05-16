import { CourseDto } from "@easymotion/openapi";
import { DateTime } from "luxon";

interface WithFullName {
  firstName: string;
  middleName?: string | null;
  lastName: string;
}

/**
 * Formats a user's name
 * @param user - The user to format
 * @returns The formatted name
 */
export const formatUserName = (
  user: WithFullName | null | undefined
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

/**
 * Gets the URL of a course image
 * @param courseId - The ID of the course
 * @returns The URL of the course image
 */
interface GetCourseImageUrlProps {
  course: CourseDto | null | undefined;
  fallbackImage?: string;
  staticUrl?: string;
}

export const getCourseImageUrl = ({
  course,
  fallbackImage = "/hero.jpg",
  staticUrl = import.meta.env.VITE_STATIC_URL,
}: GetCourseImageUrlProps) => {
  if (!course || !course.image_path) {
    return fallbackImage;
  }

  return `${staticUrl}/${course.image_path}`;
};

export const getStaticImageUrl = (picturePath: string) => {
  if (!picturePath) return undefined;
  return `${import.meta.env.VITE_STATIC_URL}/${picturePath}`;
};
