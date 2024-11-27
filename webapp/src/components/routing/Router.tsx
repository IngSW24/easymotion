import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/Home";

/**
 * Defines the router for the application.
 * @returns a router component.
 */
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
