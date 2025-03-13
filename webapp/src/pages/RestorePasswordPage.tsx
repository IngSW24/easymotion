import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApiClient } from "@easymotion/auth-context";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
  TextField,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useSearchParams } from "react-router";
import { Home, Login } from "@mui/icons-material";
import { ensurePasswordConstraints } from "../data/validators";

export default function RestorePasswordPage() {
  const { apiClient } = useApiClient();
  const mount = useRef(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "stall" | "success" | "failed"
  >("loading");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordUpdateParams, setPasswordUpdateParams] = useState({
    token: "",
    userId: "",
  });

  useEffect(() => {
    if (mount.current) return;
    mount.current = true;

    const token = searchParams.get("token");
    const userId = searchParams.get("userId");

    if (!token || !userId) {
      setStatus("failed");
      return;
    }

    setPasswordUpdateParams({ token, userId });
    setStatus("stall");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePassword = async () => {
    if (newPassword !== newPassword2) {
      setPasswordError("Le password non corrispondono.");
      return;
    }

    if (!ensurePasswordConstraints(newPassword)) {
      setPasswordError(
        "La password deve contenere almeno 6 caratteri e un numero."
      );
      return;
    }

    try {
      await apiClient.auth.authControllerUpdatePassword({
        ...passwordUpdateParams,
        newPassword,
      });
      setStatus("success");
    } catch (_e) {
      setStatus("failed");
    } finally {
      setPasswordError("");
    }
  };

  if (status === "loading") {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 20,
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 20,
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <CardContent>
          {status === "stall" ? (
            <>
              <Typography variant="h5" gutterBottom>
                Aggiorna la tua password
              </Typography>
              <TextField
                fullWidth
                label="Nuova Password"
                type="password"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                fullWidth
                label="Conferma Nuova Password"
                type="password"
                margin="normal"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3, borderRadius: 2, textTransform: "none" }}
                onClick={updatePassword}
              >
                Aggiorna Password
              </Button>
            </>
          ) : status === "success" ? (
            <>
              <CheckCircleOutlineIcon
                sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Password modificata!
              </Typography>
              <Typography variant="body1" color="textSecondary">
                La tua password è stata modificata con successo.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
                size="large"
                startIcon={<Login />}
                sx={{ mt: 3, borderRadius: 2, textTransform: "none" }}
              >
                Vai al login
              </Button>
            </>
          ) : (
            <>
              <ErrorOutlineIcon
                sx={{ fontSize: 60, color: "#f44336", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Si è verificato un errore
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Qualcosa è andato storto durante l'operazione. Riprova più
                tardi.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Home />}
                sx={{ mt: 3, borderRadius: 2, textTransform: "none" }}
                onClick={() => navigate("/")}
              >
                Torna alla home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
