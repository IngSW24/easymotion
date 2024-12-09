import { BrowserRouter, Route, Routes } from "react-router";
import EventsPage from "../pages/EventsPage";
import EventDetailsPage from "../pages/EventDetailsPage";
import FormPage from "../pages/FormPage";

/**
 * Defines the router for the application.
 * @returns a router component.
 */
const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<EventsPage />} />
      <Route path="details/:id" element={<EventDetailsPage />} />
      <Route path="new" element={<FormPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
