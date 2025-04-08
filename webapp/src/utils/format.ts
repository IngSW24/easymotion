import { AuthUserDto } from "@easymotion/openapi";

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

export const ensurePasswordConstraints = (password: string) => {
  const regex = /^(?=.*[0-9]).{6,}$/;
  return regex.test(password);
};

export const isValidEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};
