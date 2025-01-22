import { createContext } from "react";
import { Api } from "../../client/Api";

export interface ApiContextProps {
  apiClient: Api<unknown>;
  accessToken: string | null;
  updateAccessToken: (token: string | null) => void;
}

export const ApiContext = createContext<ApiContextProps>({} as ApiContextProps);
