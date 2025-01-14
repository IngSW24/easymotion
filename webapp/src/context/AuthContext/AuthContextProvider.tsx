import { useEffect, useRef, useState } from "react";
import { Api, AuthUserDto } from "../../client/Api";
import { useApiClient } from "../../hooks/useApiClient";
import { AuthContext } from "./AuthContext";

export interface AuthContextProviderProps {
  children: React.ReactNode;
}

const refreshApiInstance = new Api({
  baseUrl: import.meta.env.VITE_API_URL,
}).auth;

export default function AuthContextProvider(props: AuthContextProviderProps) {
  const { children } = props;

  const { updateAccessToken, accessToken } = useApiClient();
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const hasAttemptedInitialRefresh = useRef(false);

  useEffect(() => {
    if (hasAttemptedInitialRefresh.current) return;
    hasAttemptedInitialRefresh.current = true;

    const refresh = async () => {
      try {
        const response = await refreshApiInstance.authControllerRefresh({
          credentials: "include",
        });

        if (response.ok) {
          updateAccessToken(response.data.accessToken);
          setUser(response.data);
        }
      } catch {
        updateAccessToken(null);
        setUser(null);
      }
    };

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const response = await refreshApiInstance.authControllerLogin(
      {
        email,
        password,
      },
      {
        credentials: "include",
      }
    );

    if (response.ok) {
      updateAccessToken(response.data.accessToken);
      setUser(response.data);
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    await refreshApiInstance.authControllerLogout({
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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
