import { Api } from "@easymotion/openapi";

/**
 * Custom fetch function with automatic token refresh support.
 *
 * This function wraps the standard `fetch` API to handle cases where an access token
 * might expire during a request. If a `401 Unauthorized` response is received, it
 * attempts to refresh the access token and retries the original request with the new token.
 *
 * @param input - The resource URL or Request object to fetch.
 * @param init - An optional `RequestInit` object with custom fetch configurations.
 * @param onAccessTokenUpdate - An optional callback to update the access token in the application state.
 * @returns A `Promise<Response>` representing the fetch result, either the original response or the retried response.
 */
const customFetch = async (
  apiBaseUrl: string,
  input: RequestInfo | URL,
  init?: RequestInit,
  onAccessTokenUpdate?: (token: string) => void
) => {
  // Perform the initial fetch request with the provided input and init options.
  const response = await fetch(input, init);

  if (!onAccessTokenUpdate || response.status !== 401) return response;

  /**
   * Strategy:
   * - In case of a `401 Unauthorized` response, this function assumes the access token
   *   has expired or is invalid.
   * - A new instance of the API client is created to call the `authControllerRefresh` endpoint.
   * - This endpoint uses a refresh token (stored as an HTTP-only cookie) to obtain a new access token.
   */
  const api = new Api({
    baseUrl: apiBaseUrl,
    securityWorker: () => ({
      "x-auth-flow": "web",
      credentials: "include", // Ensures cookies are sent with the request to the refresh endpoint.
    }),
  });

  // Attempt to refresh the access token.
  const fetchResponse = await api.auth.authControllerRefresh();

  if (fetchResponse.ok) {
    /**
     * If the refresh is successful:
     * - The new access token is extracted from the response.
     * - The `onAccessTokenUpdate` callback is called to update the application's state with the new token.
     * - The original request is retried with the updated `Authorization` header containing the new token.
     */
    const tokens = fetchResponse.data.tokens;

    onAccessTokenUpdate(tokens?.accessToken ?? ""); // Update the access token in the application state.

    // Retry the original request with the new access token.
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${tokens?.accessToken ?? ''}`, // Set the new token in the headers.
      },
    });
  }

  /**
   * If the refresh fails:
   * - The original `fetchResponse` from the refresh attempt is returned.
   * - This allows the calling code to handle the failure (e.g., logging out the user or showing an error).
   */
  return fetchResponse;
};

export default customFetch;
