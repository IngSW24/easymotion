import { AuthUserDto, SignUpDto } from "@easymotion/openapi";
import { createContext } from "react";

export interface AuthContextProps {
  user: AuthUserDto | null;
  isAuthenticated: boolean;
  isPhysiotherapist: boolean;
  login: (email: string, password: string) => Promise<{ needsOtp: boolean }>;
  loginOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (signupInfo: SignUpDto) => Promise<boolean>;
  updateEmail: (email: string, userId: string, token: string) => void;
  updateUser: (user: AuthUserDto) => void;
  updateOtpStatus: (otpEnabled: boolean) => void;
  initialized: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);
