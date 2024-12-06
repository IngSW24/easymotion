import { BrowserRouter, Route, Routes } from "react-router";
import EventsPage from "../pages/EventsPage";

/**
 * Defines the router for the application.
 * @returns a router component.
 */
const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<EventsPage />}>
        <Route path="details/:id" />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
