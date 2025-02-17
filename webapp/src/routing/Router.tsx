import { BrowserRouter, Route, Routes } from "react-router";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import CourseCreatePage from "../pages/CourseCreatePage";
import Layout, { MenuEntry } from "../components/Layout/Layout";

import ProfilePage from "../pages/ProfilePage";
import ConfirmEmailPage from "../pages/ConfirmEmailPage";
import SignupPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import { Home } from "@mui/icons-material";
import AuthenticationWrapper from "./AuthenticatedRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";
import TermsOfServicePage from "../pages/TermsOfServicePage";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import { useAuth } from "../hooks/useAuth";

const menuEntries: MenuEntry[] = [
  {
    label: "Home",
    link: "/",
    icon: <Home />,
    showIn: "drawer",
  },
];

/**
 * Defines the router for the application.
 * @returns a router component.
 */
export default function Router() {
  const { initialized } = useAuth();

  // ensure authentication has been initalized before rendering routes
  if (!initialized) return <></>;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout entries={menuEntries} />}>
          {/* Always accessible routes*/}
          <Route index element={<CourseListPage />} />
          <Route path="details/:id" element={<CourseDetailsPage />} />
          <Route path="confirm-email" element={<ConfirmEmailPage />} />
          <Route path="terms" element={<TermsOfServicePage />} />

          {/* Accessible only by non authenticated users */}
          <Route element={<UnauthenticatedRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>

          {/* Accessible only all the authenticated users */}
          <Route element={<AuthenticatedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Accessible only by admins and physhiotherapists */}
          <Route
            element={
              <AuthenticationWrapper roles={["ADMIN", "PHYSIOTHERAPIST"]} />
            }
          >
            <Route path="new" element={<CourseCreatePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
