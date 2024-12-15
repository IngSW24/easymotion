import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./routing/Router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import SnackbarCloseButton from "./components/ui/snackbar/SnackbarCloseButton";
import DialogContextProvider from "./context/DialogContext/DialogContextProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: undefined,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * The main application component, which defines global context providers and the router.
 * @returns the initial component node for the application.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DialogContextProvider>
        <SnackbarProvider
          action={(snackbarKey) => (
            <SnackbarCloseButton snackbarKey={snackbarKey} />
          )}
        >
          <Router />
        </SnackbarProvider>
      </DialogContextProvider>
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
