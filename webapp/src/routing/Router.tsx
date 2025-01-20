import { BrowserRouter, Route, Routes } from "react-router";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import CourseCreatePage from "../pages/CourseCreatePage";
import Layout from "../components/Layout/Layout";

import ProfilePage from "../pages/ProfilePage";
import ConfirmEmailPage from "../pages/ConfirmEmailPage";
import SignupPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";

/**
 * Defines the router for the application.
 * @returns a router component.
 */
const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CourseListPage />} />
        <Route path="details/:id" element={<CourseDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="confirm-email" element={<ConfirmEmailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="new" element={<CourseCreatePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
