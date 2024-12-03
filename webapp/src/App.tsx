import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./components/routing/Router";

// React query client. must be created outside of the App component to avoid re-creating it on every render.
const queryClient = new QueryClient();

/**
 * The main application component, which defines global context providers and the router.
 * @returns the initial component node for the application.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
