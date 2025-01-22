import { useMemo, useState } from "react";
import { ApiContext } from "./ApiContext";
import customFetch from "./custom-fetch";
import { Api } from "@easymotion/openapi";

export interface ApiContextProviderProps {
  children: React.ReactNode;
}

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
      customFetch: (input, init) => customFetch(input, init, updateAccessToken),
    });
  }, [accessToken]);

  return (
    <ApiContext.Provider value={{ apiClient, updateAccessToken, accessToken }}>
      {children}
    </ApiContext.Provider>
  );
}
