import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./routing/Router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import SnackbarCloseButton from "./components/Snackbar/SnackbarCloseButton";
import DialogContextProvider from "./context/DialogContext/DialogContextProvider";
import { ApiContextProvider } from "@easymotion/auth-context";
import { AuthContextProvider } from "@easymotion/auth-context";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "./components/fallbacks/GlobalErrorFallback";

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
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="it">
      <ApiContextProvider apiBaseUrl={import.meta.env.VITE_API_URL}>
        <AuthContextProvider apiBaseUrl={import.meta.env.VITE_API_URL}>
          <QueryClientProvider client={queryClient}>
            <DialogContextProvider>
              <SnackbarProvider
                action={(snackbarKey) => (
                  <SnackbarCloseButton snackbarKey={snackbarKey} />
                )}
              >
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  <Router />
                </ErrorBoundary>
              </SnackbarProvider>
            </DialogContextProvider>
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </QueryClientProvider>
        </AuthContextProvider>
      </ApiContextProvider>
    </LocalizationProvider>
  );
}
