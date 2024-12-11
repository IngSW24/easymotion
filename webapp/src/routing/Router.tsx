import { BrowserRouter, Route, Routes } from "react-router";
import CoursesPage from "../pages/CoursesPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import FormPage from "../pages/FormPage";

/**
 * Defines the router for the application.
 * @returns a router component.
 */
const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<CoursesPage />} />
      <Route path="details/:id" element={<CourseDetailsPage />} />
      <Route path="new" element={<FormPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
