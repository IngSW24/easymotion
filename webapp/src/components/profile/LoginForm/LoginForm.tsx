import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";
import {
  isValidEmail,
  ensurePasswordConstraints,
} from "../../../data/validators";
import { SignInDto } from "../../../client/Api";

export interface LoginFormProps {
  onSubmit: (data: SignInDto) => void;
}

export default function LoginForm(props: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError("Email non valida.");
      isValid = false;
    }

    // Validate password
    if (!password.trim() || !ensurePasswordConstraints(password)) {
      setPasswordError(
        "La password è obbligatoria e deve rispettare i requisiti di sicurezza."
      );
      isValid = false;
    }

    if (isValid) {
      // Proceed with form submission logic
      props.onSubmit({
        email,
        password,
      });
    }
  };

  return (
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
    </form>
  );
}
