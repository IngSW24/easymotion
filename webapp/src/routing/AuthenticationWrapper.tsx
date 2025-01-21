import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { AuthUserDto } from "../client/Api";

export interface AuthenticationWrapperProps {
  allowedFor?: "authenticated" | "unauthenticated";
  roles?: AuthUserDto["role"][];
}

const isAllowed = (
  allowedFor: AuthenticationWrapperProps["allowedFor"],
  isAuthenticated: boolean
) => {
  if (allowedFor === "authenticated") return isAuthenticated;

  if (allowedFor === "unauthenticated") return !isAuthenticated;

  return true;
};

const isRoleAllowed = (role: string, allowedRoles: string[] | undefined) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(role);
};

export default function AuthenticationWrapper(
  props: AuthenticationWrapperProps
) {
  const { isAuthenticated, user } = useAuth();

  return isAllowed(props.allowedFor, isAuthenticated) &&
    isRoleAllowed(user?.role ?? "", props.roles) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}
