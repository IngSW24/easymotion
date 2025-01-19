import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useApiClient } from "../hooks/useApiClient";
import { ApplicationUserDto, SignInDto } from "../client/Api";
import { isHttpResponseError } from "../data/guards";
import { useSnack } from "../hooks/useSnack";

/**
 * TestAuthPage
 *
 * This component showcases how authentication is integrated into the application.
 * It demonstrates:
 * - Using `useAuth` for login, logout, and managing authentication state.
 * - Using `useApiClient` to make API requests, with authentication information automatically included if available.
 * - Fetching protected user data after successful authentication.
 * - Handling and displaying error messages (e.g., authorization or network errors).
 *
 * Features:
 * - Login and logout functionality.
 * - Displays the authenticated user's details.
 * - Fetches and displays user data upon successful authentication.
 * - Handles errors gracefully and displays them as snack messages.
 */
export default function TestAuthPage() {
  const { apiClient } = useApiClient(); // Provides an API client with authentication information, if available.
  const auth = useAuth(); // Provides authentication state and actions (e.g., login, logout).

  const snack = useSnack();
  const [errorMessage, setErrorMessage] = useState("");
  const [authInfo, setAuthInfo] = useState<SignInDto>({
    email: "",
    password: "",
  });
  const [users, setUsers] = useState<ApplicationUserDto[] | null>(null);

  /**
   * Logs the user in using credentials.
   * - Sends the login request via `useAuth.login`.
   * - Displays an error snack if login fails.
   * - Resets the form fields after the login attempt.
   */
  const login = async () => {
    try {
      await auth.login(authInfo.email, authInfo.password); // Call the login function from useAuth.
    } catch (e) {
      snack.showError(e); // Show the error as a snack message.
    } finally {
      setErrorMessage(""); // Clear any local error messages.
      setAuthInfo({ email: "", password: "" }); // Reset the form fields.
    }
  };

  /**
   * Logs the user out.
   * - Sends the logout request via `useAuth.logout`.
   * - Displays an error snack if logout fails.
   * - Clears the local error message after the attempt.
   */
  const logout = async () => {
    try {
      await auth.logout(); // Call the logout function from useAuth.
    } catch (e) {
      snack.showError(e); // Show the error as a snack message.
    } finally {
      setErrorMessage(""); // Clear any local error messages.
    }
  };

  /**
   * Demonstrates how a request limited to admins can be handles gracefully.
   * - Makes the API call using the `apiClient` from `useApiClient`.
   * - Handles `403 Forbidden` and other HTTP errors gracefully.
   * - Updates the error message state if the user is unauthorized.
   */
  useEffect(() => {
    if (!auth.isAuthenticated) return; // Exit early if the user is not authenticated.

    const getUsers = async () => {
      try {
        const response = await apiClient.users.usersControllerFindAll(); // Fetch the user list from the API.
        setUsers(response.data.data); // Store the fetched users in state.
      } catch (e) {
        if (!isHttpResponseError(e)) throw e; // Re-throw unexpected errors.
        if (e.status === 403) {
          setErrorMessage("You are not authorized to view this content"); // Handle forbidden access.
        } else {
          setErrorMessage(e.error.message); // Handle other HTTP errors.
        }
      }
    };

    getUsers();
  }, [apiClient.users, auth.isAuthenticated]); // Re-run the effect when `auth.isAuthenticated` or `apiClient.users` changes.

  return (
    <Box sx={{ p: 3, maxWidth: "500px" }}>
      <Typography variant="h3">Test Users</Typography>

      <Stack spacing={3} sx={{ mt: 3 }}>
        {auth.isAuthenticated ? (
          // Show the authenticated user's details
          <>
            <Typography variant="body2">
              You are logged in as <b>{auth.user?.email}</b>. Your role is{" "}
              {auth.user?.role}.
            </Typography>
          </>
        ) : (
          // Show the login form if the user is not authenticated
          <>
            <TextField
              label="Email"
              value={authInfo.email}
              onChange={(e) =>
                setAuthInfo((d) => ({ ...d, email: e.target.value }))
              }
            />

            <TextField
              label="Password"
              type="password"
              value={authInfo.password}
              onChange={(e) =>
                setAuthInfo((d) => ({ ...d, password: e.target.value }))
              }
            />
          </>
        )}

        <Box sx={{ mt: 3 }}>
          {auth.isAuthenticated ? (
            // Logout button
            <Button
              variant="contained"
              color="error"
              disabled={!auth.isAuthenticated}
              onClick={logout}
            >
              Logout
            </Button>
          ) : (
            // Login button
            <Button
              variant="contained"
              onClick={login}
              disabled={
                auth.isAuthenticated || !authInfo.email || !authInfo.password
              }
            >
              Login
            </Button>
          )}
        </Box>

        {errorMessage && (
          // Display any error messages
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        )}

        {auth.isAuthenticated && users && (
          // Display the fetched users if available
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4">Users</Typography>
            {users.map((u, i) => (
              <pre key={`user_${i}`}>{JSON.stringify(u, null, 2)}</pre>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
}