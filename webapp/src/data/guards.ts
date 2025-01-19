import { HttpResponse } from "../client/Api";

/**
 * Type guard to check if an error is an HttpResponseError
 * @param error the error to check
 * @returns true if the error is an HttpResponseError
 */
export const isHttpResponseError = (
  error: unknown
): error is HttpResponse<unknown, Error> =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  "error" in error;
