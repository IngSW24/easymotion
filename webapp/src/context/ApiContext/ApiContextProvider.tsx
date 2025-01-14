import { useMemo, useState } from "react";
import { Api } from "../../client/Api";
import { ApiContext } from "./ApiContext";

export interface ApiContextProviderProps {
  children: React.ReactNode;
}

const fetchWithAutoRefresh = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  onAccessTokenUpdate?: (token: string) => void
) => {
  const response = await fetch(input, init);

  if (!onAccessTokenUpdate && response.status != 401) return response;

  // Refresh token
  const api = new Api({
    baseUrl: import.meta.env.VITE_API_URL,
    securityWorker: () => ({
      credentials: "include",
    }),
  });

  const fetchResponse = await api.auth.authControllerRefresh();

  if (fetchResponse.ok) {
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${fetchResponse.data.accessToken}`,
      },
    });
  }

  return fetchResponse;
};

export default function ApiContextProvider(props: ApiContextProviderProps) {
  const { children } = props;
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const updateAccessToken = (newToken: string | null) =>
    setAccessToken(newToken);

  const apiClient = useMemo(() => {
    return new Api({
      baseUrl: import.meta.env.VITE_API_URL,
      securityWorker: () => ({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      customFetch: (input, init) =>
        fetchWithAutoRefresh(input, init, updateAccessToken),
    });
  }, [accessToken]);

  return (
    <ApiContext.Provider value={{ apiClient, updateAccessToken, accessToken }}>
      {children}
    </ApiContext.Provider>
  );
}
