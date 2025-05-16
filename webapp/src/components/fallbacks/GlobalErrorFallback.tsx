import { FallbackProps } from "react-error-boundary";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Paper,
} from "@mui/material";

export function GlobalErrorFallback({ error }: FallbackProps) {
  // no react router since this is higher in the tree
  const handleGoHome = () => (window.location.href = "/");

  return (
    <Box
      sx={{
        height: "100svh",
        width: "100%",
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/hero.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "text.primary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h4" color="primary">
              Ops... qualcosa è andato storto 🤦‍♂️
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Potrebbe trattarsi di un errore temporaneo oppure di un problema
              inatteso nell'applicazione. Se stavi facendo qualcosa di
              importante, ci dispiace 🙇‍♂️
            </Typography>

            <Box
              sx={{
                width: "100%",
                bgcolor: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: 1,
                p: 2,
                mt: 1,
                fontSize: "0.875rem",
                fontFamily: "monospace",
                color: "error.main",
                overflowX: "auto",
                maxHeight: 200,
              }}
            >
              {error.message || "Errore sconosciuto."}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Se l'errore persiste, invia questo messaggio all'assistenza di{" "}
              <strong>EasyMotion</strong>.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleGoHome}
              size="large"
              sx={{ mt: 2 }}
            >
              Torna alla Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
