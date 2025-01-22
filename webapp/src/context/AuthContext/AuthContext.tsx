import { createContext } from "react";
import { AuthUserDto, SignUpDto } from "../../client/Api";

export interface AuthContextProps {
  user: AuthUserDto | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (signupInfo: SignUpDto) => Promise<boolean>;
  updateEmail: (email: string, userId: string, token: string) => void;
  updateUser: (user: AuthUserDto) => void;
  initialized: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);
