import { useState } from "react";
import { Api, AuthUserDto } from "../../client/Api";
import { useApiClient } from "../../hooks/useApiClient";
import { AuthContext } from "./AuthContext";
import { useInitialRefresh } from "./useInitialRefresh";

export interface AuthContextProviderProps {
  children: React.ReactNode;
}

// Initialize an instance of the API client specifically for the auth endpoints
const apiInstance = new Api({
  baseUrl: import.meta.env.VITE_API_URL,
}).auth;

/**
 * Defines the provider for the Auth Context
 * @param props the context provider props
 * @returns a react context provider
 */
export default function AuthContextProvider(props: AuthContextProviderProps) {
  const { children } = props;

  const { updateAccessToken, accessToken } = useApiClient();

  // State to store the authenticated user's details
  const [user, setUser] = useState<AuthUserDto | null>(null);

  // Automatically attempt to get an access token when the app loads
  useInitialRefresh({
    apiInstance: apiInstance,
    updateAccessToken,
    setUser,
  });

  /**
   * Handles user login by sending credentials to the server.
   * If successful, updates the access token and user state.
   *
   * @param email - User's email
   * @param password - User's password
   */
  const login = async (email: string, password: string) => {
    const response = await apiInstance.authControllerLogin(
      { email, password },
      { credentials: "include" } // Ensure cookies are sent for authentication
    );

    // Update the token and user state with the server's response
    updateAccessToken(response.data.accessToken);
    setUser(response.data);
  };

  /**
   * Handles user logout by invalidating the session on the server.
   * Clears the access token and user state locally.
   */
  const logout = async () => {
    await apiInstance.authControllerLogout({
      credentials: "include", // Ensure cookies are included for server-side session handling
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the access token for authenticated logout
      },
    });

    // Clear the token and user state after logout
    updateAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
