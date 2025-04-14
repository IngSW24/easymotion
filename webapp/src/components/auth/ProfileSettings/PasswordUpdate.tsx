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
import { passwordValidationSchema } from "../../../utils/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { z as zodZ } from "zod";

type Message = {
  type: "success" | "error" | "none";
  text?: string;
};

const passwordSchema = z
  .object({
    old: z.string().min(1, "La password precedente è obbligatoria"),
    new: passwordValidationSchema,
  })
  .refine((data) => data.old !== data.new, {
    path: ["new"],
    message: "La nuova password non può essere uguale alla password precedente",
  });

type PasswordFormData = zodZ.infer<typeof passwordSchema>;

export default function PasswordUpdate() {
  const { apiClient } = useApiClient();
  const auth = useAuth();
  const [message, setMessage] = useState<Message>({
    type: "none",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordUpdate = async (data: PasswordFormData) => {
    const apiData = {
      oldPassword: data.old,
      newPassword: data.new,
    };
    try {
      const res = await apiClient.auth.authControllerChangePassword(apiData);
      if (res.ok) {
        reset();
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
        <form onSubmit={handleSubmit(onPasswordUpdate)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Password precedente"
                type="password"
                size="small"
                {...register("old")}
                error={!!errors.old}
                helperText={errors.old?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Nuova password"
                type="password"
                size="small"
                {...register("new")}
                error={!!errors.new}
                helperText={errors.new?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ minWidth: 120 }}
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
