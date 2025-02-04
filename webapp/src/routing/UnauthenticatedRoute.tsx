import { Navigate, Outlet } from "react-router";
import { useAuth } from "@easymotion/auth-context";

export default function UnauthenticatedRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
