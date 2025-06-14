import { useMemo, useState } from "react";
import { useApiClient } from "../hooks/useApiClient";
import { AuthContext } from "./AuthContext";
import { useInitialRefresh } from "./useInitialRefresh";
import { Api, BaseAuthUserDto, SignUpDto } from "@easymotion/openapi";

export interface AuthContextProviderProps {
  children: React.ReactNode;
  apiBaseUrl: string;
}

/**
 * Defines the provider for the Auth Context
 * @param props the context provider props
 * @returns a react context provider
 */
export default function AuthContextProvider(props: AuthContextProviderProps) {
  const { children } = props;

  const { updateAccessToken, accessToken } = useApiClient();
  const [otpStatus, setOtpStatus] = useState({
    needsOtp: false,
    email: "",
  });

  const apiInstance = useMemo(
    () =>
      new Api({
        baseUrl: props.apiBaseUrl,
        securityWorker: () => ({
          credentials: "include",
          headers: {
            "x-auth-flow": "web",
          },
        }),
      }),

    [props.apiBaseUrl]
  );

  // State to store the authenticated user's details
  const [user, setUser] = useState<BaseAuthUserDto | null>(null);

  // Automatically attempt to get an access token when the app loads
  const initialized = useInitialRefresh({
    apiInstance: apiInstance.auth,
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
    const response = await apiInstance.auth.authControllerUserLogin({
      email,
      password,
    });

    if (response.data.requiresOtp) {
      setOtpStatus({ needsOtp: true, email });
      return { needsOtp: true };
    }
    // Update the token and user state with the server's response
    updateAccessToken(response.data.tokens?.accessToken ?? "");
    if (response.data.user) setUser(response.data.user);
    return { needsOtp: false };
  };

  /**
   * Handles user login with OTP by sending the OTP to the server.
   * If successful, updates the access token and user state.
   *
   * @param otp - The OTP to verify
   */
  const loginOtp = async (otp: string) => {
    if (!otpStatus.needsOtp) {
      throw new Error("No OTP required");
    }

    const response = await apiInstance.auth.authControllerLoginOtp({
      email: otpStatus.email,
      otp,
    });

    // Update the token and user state with the server's response
    updateAccessToken(response.data.tokens?.accessToken ?? "");
    if (response.data.user) setUser(response.data.user);
    setOtpStatus({ needsOtp: false, email: "" });
  };

  /**
   * Updates the user's OTP status.
   * @param status true to enable OTP, false to disable
   */
  const updateOtpStatus = async (status: boolean) => {
    console.log("Updating otp to status", status);
    const response =
      await apiInstance.profile.profileControllerUpdateUserProfile(
        { twoFactorEnabled: status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token for authenticated logout
          },
        }
      );

    setUser(response.data);
  };

  /**
   * Handles user logout by invalidating the session on the server.
   * Clears the access token and user state locally.
   */
  const logout = async () => {
    await apiInstance.auth.authControllerLogout({
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

    const response = await apiInstance.auth.authControllerConfirmEmail(payload);

    if (response.ok) {
      updateAccessToken(response.data?.tokens?.accessToken ?? "");
      if (response.data.user) setUser(response.data.user);
    }
  };

  const updateProfilePicture = async (file: File) => {
    const response =
      await apiInstance.profile.profileControllerUpdateProfilePicture(
        {
          file,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token for authenticated logout
          },
        }
      );

    if (response.ok && response.data) {
      setUser(response.data);
      return response.data.picturePath;
    }

    return null;
  };

  /**
   * Handles user signup by sending the signup information to the server.
   * @param signupInfo - User's signup information
   */
  const signup = async (signupInfo: SignUpDto): Promise<boolean> => {
    const response = await apiInstance.auth.authControllerSignUp(signupInfo);
    return response.ok;
  };

  return (
    <AuthContext.Provider
      value={{
        isPhysiotherapist: user?.role === "PHYSIOTHERAPIST",
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loginOtp,
        updateOtpStatus,
        updateEmail,
        signup,
        updateProfilePicture,
        updateUser: setUser,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
