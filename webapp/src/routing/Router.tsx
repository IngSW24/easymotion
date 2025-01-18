import { BrowserRouter, Route, Routes } from "react-router";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import CourseCreatePage from "../pages/CourseCreatePage";
import Layout from "../components/Layout/Layout";
import LoginSignUpPage from "../pages/LoginSignUpPage";
import ProfilePage from "../pages/ProfilePage";

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
        <Route path="login" element={<LoginSignUpPage loginType="login" />} />
        <Route path="logout" element={<LoginSignUpPage loginType="logout" />} />
        <Route
          path="register"
          element={<LoginSignUpPage loginType="register" />}
        />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="personal_information"
          element={<LoginSignUpPage loginType="personal" />}
        />
        <Route path="new" element={<CourseCreatePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
