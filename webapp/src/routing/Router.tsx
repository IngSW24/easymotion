import { BrowserRouter, Route, Routes } from "react-router";
import EventsPage from "../pages/EventsPage";

/**
 * Defines the router for the application.
 * @returns a router component.
 */
const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<EventsPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
