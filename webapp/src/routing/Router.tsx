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
import AuthenticationWrapper from "./AuthenticationWrapper";

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
const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout entries={menuEntries} />}>
        <Route index element={<CourseListPage />} />
        <Route path="details/:id" element={<CourseDetailsPage />} />
        <Route path="confirm-email" element={<ConfirmEmailPage />} />
        <Route element={<AuthenticationWrapper allowedFor="unauthenticated" />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        <Route element={<AuthenticationWrapper allowedFor="authenticated" />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route
          element={
            <AuthenticationWrapper
              allowedFor="authenticated"
              roles={["ADMIN", "PHYSIOTHERAPIST"]}
            />
          }
        >
          <Route path="new" element={<CourseCreatePage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
