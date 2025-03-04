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
import {
  isValidEmail,
  ensurePasswordConstraints,
} from "../../../data/validators";
import { SignInDto } from "@easymotion/openapi";
import { useApiClient } from "@easymotion/auth-context";

export interface LoginFormProps {
  onSubmit: (data: SignInDto) => void;
}

export default function LoginForm(props: LoginFormProps) {
  const { apiClient } = useApiClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [isResetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!isValidEmail(email)) {
      setEmailError("Email non valida.");
      isValid = false;
    }

    if (!password.trim() || !ensurePasswordConstraints(password)) {
      setPasswordError(
        "La password è obbligatoria e deve rispettare i requisiti di sicurezza."
      );
      isValid = false;
    }

    if (isValid) {
      props.onSubmit({ email, password });
    }
  };

  const handleResetPassword = async () => {
    setResetEmailError("");
    if (!isValidEmail(resetEmail)) {
      setResetEmailError("Email non valida.");
      return;
    }

    await apiClient.auth.authControllerRequestPasswordReset({
      email: resetEmail,
    });
    setResetEmailSent(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
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
