import { BrowserRouter, Route, Routes } from "react-router";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import CourseCreatePage from "../pages/CourseCreatePage";

/**
 * Defines the router for the application.
 * @returns a router component.
 */
const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<CourseListPage />} />
      <Route path="details/:id" element={<CourseDetailsPage />} />
      <Route path="new" element={<CourseCreatePage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
