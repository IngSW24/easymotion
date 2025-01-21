import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { AuthUserDto } from "../client/Api";

export interface AuthenticatedRouteProps {
  roles?: AuthUserDto["role"][];
}

const isRoleAllowed = (role: string, allowedRoles: string[] | undefined) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(role);
};

export default function AuthenticatedRoute(props: AuthenticatedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && isRoleAllowed(user?.role ?? "", props.roles)) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}
