import { Api } from "@easymotion/openapi";
import { createContext } from "react";

export interface ApiContextProps {
  apiClient: Api<unknown>;
  accessToken: string | null;
  updateAccessToken: (token: string | null) => void;
}

export const ApiContext = createContext<ApiContextProps>({} as ApiContextProps);
