import { useMemo, useState } from "react";
import { useApiClient } from "../hooks/useApiClient";
import { AuthContext } from "./AuthContext";
import { useInitialRefresh } from "./useInitialRefresh";
import { Api, AuthUserDto, SignUpDto } from "@easymotion/openapi";

export interface AuthContextProviderProps {
  children: React.ReactNode;
  apiBaseUrl: string;
}

// Initialize an instance of the API client specifically for the auth endpoints

/**
 * Defines the provider for the Auth Context
 * @param props the context provider props
 * @returns a react context provider
 */
export default function AuthContextProvider(props: AuthContextProviderProps) {
  const { children } = props;

  const { updateAccessToken, accessToken } = useApiClient();

  const apiInstance = useMemo(
    () =>
      new Api({
        baseUrl: props.apiBaseUrl,
      }).auth,

    [props.apiBaseUrl]
  );

  // State to store the authenticated user's details
  const [user, setUser] = useState<AuthUserDto | null>(null);

  // Automatically attempt to get an access token when the app loads
  const initialized = useInitialRefresh({
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

  /**
   * Updates the user's email address after confirming the email change.
   * @param email the new email address
   * @param userId the user's ID
   * @param token the confirmation token
   */
  const updateEmail = async (email: string, userId: string, token: string) => {
    const payload = { email, userId, token };

    const response = await apiInstance.authControllerConfirmEmail(payload, {
      credentials: "include",
    });

    if (response.ok) {
      updateAccessToken(response.data.accessToken);
      setUser(response.data);
    }
  };

  /**
   * Handles user signup by sending the signup information to the server.
   * @param signupInfo - User's signup information
   */
  const signup = async (signupInfo: SignUpDto): Promise<boolean> => {
    const response = await apiInstance.authControllerSignUp(signupInfo);
    return response.ok;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        updateEmail,
        signup,
        updateUser: setUser,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
