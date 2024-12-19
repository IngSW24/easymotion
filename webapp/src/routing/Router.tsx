import { BrowserRouter, Route, Routes } from "react-router";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import CourseCreatePage from "../pages/CourseCreatePage";
import Layout, { MenuEntry } from "../components/ui/Layout/Layout";

const userMenuEntries: Array<MenuEntry> = [
  {
    label: "Home",
    link: "/",
  },
];

const physiotherapistMenuEntries: Array<MenuEntry> = [
  {
    label: "Home",
    link: "/physio",
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
        <Route path="new" element={<CourseCreatePage />} />
      </Route>
      <Route
        path="physio"
        element={
          <Layout isPhysiotherapist entries={physiotherapistMenuEntries} />
        }
      >
        <Route index element={<CourseListPage canEdit />} />
        <Route path="details/:id" element={<CourseDetailsPage canEdit />} />
        <Route path="new" element={<CourseCreatePage canEdit />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
