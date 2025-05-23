import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@easymotion/auth-context";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useSearchParams } from "react-router";
import { Home } from "@mui/icons-material";
import Fade from "../components/animations/Fade";

export default function ConfirmEmailPage() {
  const auth = useAuth();
  const mount = useRef(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"pending" | "success" | "failed">(
    "pending"
  );

  useEffect(() => {
    if (mount.current) return;
    mount.current = true;

    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!token || !userId || !email) {
      setStatus("failed");
      return;
    }

    const confirmEmail = async () => {
      try {
        await auth.updateEmail(email, userId, token);
        setStatus("success");
      } catch (_) {
        setStatus("failed");
      }
    };

    confirmEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "pending") {
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
            {status === "success" ? (
              <>
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  Indirizzo email confermato!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Il tuo indirizzo mail è stato confermato con successo.
                </Typography>
              </>
            ) : (
              <>
                <ErrorOutlineIcon
                  sx={{ fontSize: 60, color: "#f44336", mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  Conferma fallita
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Qualcosa è andato storto durante la conferma dell'email.
                  Riprova più tardi.
                </Typography>
              </>
            )}
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
          </CardContent>
        </Card>
      </Container>
    </Fade>
  );
}
