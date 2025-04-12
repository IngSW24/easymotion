import { EnhancedEncryption, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useApiClient, useAuth } from "@easymotion/auth-context";
import { ensurePasswordConstraints } from "../../../utils/format";

type Message = {
  type: "success" | "error" | "none";
  text?: string;
};

export default function PasswordUpdate() {
  const { apiClient } = useApiClient();
  const auth = useAuth();
  const [password, setPassword] = useState({
    old: "",
    new: "",
  });
  const [message, setMessage] = useState<Message>({
    type: "none",
  });

  const onPasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!ensurePasswordConstraints(password.new)) {
      setMessage({
        type: "error",
        text: "La password deve contenere almeno 6 caratteri e un numero",
      });
      return;
    }

    const data = { oldPassword: password.old, newPassword: password.new };

    try {
      const res = await apiClient.auth.authControllerChangePassword(data);
      if (res.ok) {
        setPassword({ old: "", new: "" });
        setMessage({
          type: "success",
          text: "Password aggiornata con successo",
        });
      }
    } catch (_) {
      setMessage({
        type: "error",
        text: "Password errata",
      });
    }
  };

  const onOtpUpdate = async (newStatus: boolean) => {
    await auth.updateOtpStatus(newStatus);
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 800,
        boxShadow: 3,
        borderRadius: 3,
        padding: 3,
        marginTop: 4,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          fontWeight="bold"
          gutterBottom
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <EnhancedEncryption />
          <span>Sicurezza</span>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
          Inserisci la tua password precedente e la nuova password per
          effettuare la modifica
        </Typography>
        <form onSubmit={onPasswordUpdate}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Password precedente"
                type="password"
                size="small"
                value={password.old}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, old: e.target.value }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Nuova password"
                type="password"
                size="small"
                value={password.new}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, new: e.target.value }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!password.old || !password.new}
                sx={{
                  minWidth: 120,
                }}
                fullWidth
                startIcon={<Save />}
                type="submit"
              >
                Modifica
              </Button>
            </Grid>
          </Grid>
        </form>
        <Stack
          spacing={2}
          sx={{ mt: 5, display: "flex", alignItems: "center" }}
          direction="row"
        >
          <Typography component="div" fontWeight={500} gutterBottom>
            <span>Autenticazione a due fattori</span>
          </Typography>
          <Switch
            onChange={(e) => onOtpUpdate(e.target.checked)}
            checked={auth.user?.twoFactorEnabled ?? false}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Se abilitata, verrà richiesto un codice OTP inviato alla tua mail per
          effettuare il login.
        </Typography>

        <Box sx={{ mt: 2 }}>
          {message.text && (
            <Typography color={message.type}>{message.text}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
