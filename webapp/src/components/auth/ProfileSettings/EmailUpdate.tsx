import { Email, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useApiClient } from "@easymotion/auth-context";
import { isHttpResponseError } from "../../../data/guards";
import { isValidEmail } from "../../../utils/validation";

const messages = {
  success:
    "Abbiamo inviato un'email di conferma all'indirizzo specificato. Controlla la tua casella di posta elettronica e segui le istruzioni per completare l'aggiornamento.",
  conflict: "L'indirizzo email specificato è già in uso da un altro utente.",
  general: "Si è verificato un errore durante l'aggiornamento.",
};

type Message = {
  type: "success" | "error" | "none";
  text?: string;
};

export default function EmailUpdate() {
  const { apiClient } = useApiClient();
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState<Message>({
    type: "none",
    text: "",
  });

  const handleEmailUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = { email: newEmail };

    try {
      const res = await apiClient.auth.authControllerRequestEmailUpdate(data);
      if (res.ok) {
        setMessage({ type: "success", text: messages.success });
      }
    } catch (e) {
      if (isHttpResponseError(e) && e.status === 409) {
        setMessage({ type: "error", text: messages.conflict });
        return;
      }
      setMessage({ type: "error", text: messages.general });
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        boxShadow: 3,
        borderRadius: 3,
        padding: 3,
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
          <Email />
          <span>Email</span>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
          Ti invieremo un'email di conferma per completare l'aggiornamento.
        </Typography>
        <form onSubmit={handleEmailUpdate}>
          <Stack direction="column" spacing={2} gap={2} flexWrap="wrap">
            <TextField
              label="Nuova email"
              type="email"
              fullWidth
              value={newEmail}
              size="small"
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ minWidth: 120 }}
              startIcon={<Save />}
              fullWidth
              disabled={!newEmail || !isValidEmail(newEmail)}
              type="submit"
              color="primary"
            >
              Modifica
            </Button>
          </Stack>
        </form>
        <Box sx={{ mt: 2 }}>
          {message.text && (
            <Typography color={message.type}>{message.text}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
