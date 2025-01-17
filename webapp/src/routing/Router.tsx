import { BrowserRouter, Route, Routes } from "react-router";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import CourseCreatePage from "../pages/CourseCreatePage";
import Layout from "../components/Layout/Layout";

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
      </Route>
      <Route path="physio" element={<Layout />}>
        <Route index element={<CourseListPage canEdit />} />
        <Route path="details/:id" element={<CourseDetailsPage canEdit />} />
        <Route path="new" element={<CourseCreatePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
