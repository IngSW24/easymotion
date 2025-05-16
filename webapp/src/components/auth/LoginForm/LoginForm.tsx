import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SignInDto } from "@easymotion/openapi";
import { useApiClient } from "@easymotion/auth-context";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export interface LoginFormProps {
  onSubmit: (data: SignInDto) => void;
}

export default function LoginForm(props: LoginFormProps) {
  const { apiClient } = useApiClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [isResetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const onSubmit = (data: LoginFormData) => {
    props.onSubmit({
      email: data.email.trim(),
      password: data.password.trim(),
    });
  };

  const handleResetPassword = async () => {
    setResetEmailError("");

    const validationResult = z
      .string()
      .email("L'indirizzo email deve essere valido.")
      .safeParse(resetEmail);

    if (!validationResult.success) {
      setResetEmailError(
        validationResult.error.errors.map((err) => err.message).join(", ")
      );
      return;
    }

    await apiClient.auth.authControllerRequestPasswordReset({
      email: validationResult.data,
    });

    setResetEmailSent(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          required
        />

        <FormControlLabel control={<Checkbox />} label="Ricordami" />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          sx={{ marginTop: "20px" }}
        >
          Login
        </Button>

        <Link
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            cursor: "pointer",
          }}
          onClick={() => setResetDialogOpen(true)}
        >
          Hai dimenticato la password?
        </Link>
      </form>

      {/* Password Reset Dialog */}
      <Dialog
        open={isResetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      >
        <DialogTitle>Recupera la password</DialogTitle>
        <DialogContent>
          {resetEmailSent ? (
            <Typography>
              Ti abbiamo inviato un'email con le istruzioni per recuperare la
              password.
            </Typography>
          ) : (
            <TextField
              fullWidth
              label="Inserisci la tua email"
              type="email"
              sx={{ minWidth: 300 }}
              margin="dense"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              error={!!resetEmailError}
              helperText={resetEmailError}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Chiudi</Button>
          <Button
            onClick={handleResetPassword}
            color="primary"
            disabled={resetEmailSent}
            variant="contained"
          >
            Invia
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
