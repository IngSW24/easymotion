import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";
import { SignUpDto } from "@easymotion/openapi";
import {
  ensurePasswordConstraints,
  isValidEmail,
} from "../../../data/validators";
import { Link } from "react-router";

export interface SignupFormCredentialsProps {
  onSubmit: (data: Partial<SignUpDto>) => void;
}

export default function SignupFormCredentials(
  props: SignupFormCredentialsProps
) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError("Email non valida.");
      isValid = false;
    }

    // Validate password constraints
    if (!ensurePasswordConstraints(password)) {
      setPasswordError("La password non soddisfa i requisiti di sicurezza.");
      isValid = false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Le password non coincidono.");
      isValid = false;
    }

    if (!isValid) return;

    props.onSubmit({
      email,
      password,
      repeatedPassword: confirmPassword,
    });
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
      <TextField
        fullWidth
        label="Conferma Password"
        name="confirmPassword"
        type="password"
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!confirmPasswordError}
        helperText={confirmPasswordError}
        required
      />
      <FormControlLabel
        control={
          <Checkbox
            required
            checked={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.checked)}
          />
        }
        label={
          <span>
            Accetto i{" "}
            <Link to="/terms" target="_blank">
              Termini e condizioni
            </Link>
          </span>
        }
      />
      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ marginTop: "20px" }}
      >
        Procedi
      </Button>
    </form>
  );
}
