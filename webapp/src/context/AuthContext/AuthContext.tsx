import { createContext } from "react";
import { AuthUserDto } from "../../client/Api";

export interface AuthContextProps {
  user: AuthUserDto | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateEmail: (email: string, userId: string, token: string) => void;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);
