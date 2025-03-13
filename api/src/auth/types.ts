import { AuthUserDto } from "./dto/auth-user/auth-user.dto";

export type TwoFactorDiscriminator =
  | { requiresOtp: true }
  | (LoginResponse & { requiresOtp: false });

export type LoginResponse = {
  user: AuthUserDto & { accessToken: string };
  refreshToken: string;
};
