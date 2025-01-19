import { BrowserRouter, Route, Routes } from "react-router";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import CourseCreatePage from "../pages/CourseCreatePage";
import Layout, { MenuEntry } from "../components/Layout/Layout";

import { Login, Logout, Person } from "@mui/icons-material";
import ProfilePage from "../pages/ProfilePage";
import TestAuthPage from "../pages/testAuthPage";

const notLoggedMenuEntries: Array<MenuEntry> = [
  {
    label: "Login",
    link: "/login",
    icon: <Login />,
  },
  {
    label: "Register",
    link: "/register",
    icon: <Login />,
  },
];

const userMenuEntries: Array<MenuEntry> = [
  {
    label: "Logout",
    link: "/logout",
    icon: <Logout />,
  },
  {
    label: "Profile",
    link: "/profile",
    icon: <Person />,
  },
];

const physiotherapistMenuEntries: Array<MenuEntry> = [
  {
    label: "Logout",
    link: "/logout",
    icon: <Logout />,
  },
  {
    label: "Profile",
    link: "/profile",
    icon: <Person />,
  },
];

/**
 * Defines the router for the application.
 * @returns a router component.
 */
const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout entries={userMenuEntries} />}>
        <Route index element={<CourseListPage />} />
        <Route path="details/:id" element={<CourseDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="auth" element={<TestAuthPage />} />
      </Route>
      <Route
        path="physio"
        element={
          <Layout
            isPhysiotherapist
            homeLink="/physio"
            entries={physiotherapistMenuEntries}
          />
        }
      >
        <Route index element={<CourseListPage canEdit />} />
        <Route path="details/:id" element={<CourseDetailsPage canEdit />} />
        <Route path="new" element={<CourseCreatePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
