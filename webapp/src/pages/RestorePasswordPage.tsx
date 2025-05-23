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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { passwordValidationSchema } from "../utils/validation";
import Fade from "../components/animations/Fade";

const passwordSchema = z
  .object({
    newPassword: passwordValidationSchema,
    newPassword2: passwordValidationSchema,
  })
  .refine((data) => data.newPassword === data.newPassword2, {
    message: "Le password non corrispondono.",
    path: ["newPassword2"],
  });

export default function RestorePasswordPage() {
  const { apiClient } = useApiClient();
  const mount = useRef(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "stall" | "success" | "failed"
  >("loading");
  const [passwordUpdateParams, setPasswordUpdateParams] = useState({
    token: "",
    userId: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
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

  const updatePassword = async (data: { newPassword: string }) => {
    try {
      await apiClient.auth.authControllerUpdatePassword({
        ...passwordUpdateParams,
        newPassword: data.newPassword,
      });
      setStatus("success");
    } catch (_) {
      setStatus("failed");
    }
  };

  if (status === "loading") {
    return (
      <Fade>
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
      </Fade>
    );
  }

  return (
    <Fade>
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
              <form onSubmit={handleSubmit(updatePassword)}>
                <Typography variant="h5" gutterBottom>
                  Aggiorna la tua password
                </Typography>
                <TextField
                  fullWidth
                  label="Nuova Password"
                  type="password"
                  margin="normal"
                  {...register("newPassword")}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
                <TextField
                  fullWidth
                  label="Conferma Nuova Password"
                  type="password"
                  margin="normal"
                  {...register("newPassword2")}
                  error={!!errors.newPassword2}
                  helperText={errors.newPassword2?.message}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 3, borderRadius: 2, textTransform: "none" }}
                  type="submit"
                >
                  Aggiorna Password
                </Button>
              </form>
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
    </Fade>
  );
}
