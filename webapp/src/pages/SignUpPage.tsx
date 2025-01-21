import FormComponent from "../components/FormComponent/FormComponent";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { SignUpDto } from "../client/Api";
import SignupFormCredentials from "../components/profile/SignupForm/SignupFormCredentials";
import { useSnack } from "../hooks/useSnack";
import SignupFormInformation from "../components/profile/SignupForm/SignupFormInformation";
import { Box, Typography } from "@mui/material";

type Phase = "credentials" | "info" | "final" | "error";
type ProgressiveSignup = Partial<SignUpDto> | null;

const getPhaseMessage = (phase: Phase) => {
  switch (phase) {
    case "credentials":
      return "Ti chiediamo di inserire i dati che utilizzerai per accedere al nostro sito";
    case "info":
      return "Bene, ora che hai completato la parte più sensibile, parlaci un po' di te ...";
    case "final":
      return "Completa la registrazione";
    case "error":
      return "Errore";
  }
};

export default function SignupPage() {
  const auth = useAuth();
  const snack = useSnack();
  const [credentials, setCredentials] = useState<ProgressiveSignup>(null);
  const [phase, setPhase] = useState<Phase>("credentials");

  const handlePhase = (v: NonNullable<ProgressiveSignup>) => {
    switch (phase) {
      case "credentials":
        setCredentials(v);
        setPhase("info");
        break;
      case "info":
        auth
          .signup({ ...credentials, ...v } as SignUpDto)
          .then(() => setPhase("final"))
          .catch(() => {
            snack.showError(
              "Errore durante la registrazione, si prega di riprovare."
            );
            setPhase("credentials");
          });
    }
  };

  return (
    <>
      <FormComponent
        title="Benvenuto in EasyMotion"
        text={getPhaseMessage(phase)}
      >
        {phase == "credentials" && (
          <SignupFormCredentials onSubmit={handlePhase} />
        )}
        {phase == "info" && <SignupFormInformation onSubmit={handlePhase} />}
        {phase == "final" && (
          <Box>
            <Typography variant="h6">Registrazione completata</Typography>
            <Typography>
              Ti abbiamo inviato una email per confermare la tua registrazione.
              Controlla la tua casella di posta elettronica e conferma il tuo
              indirizzo mail per poter accedere al tuo account.
            </Typography>
          </Box>
        )}
      </FormComponent>
    </>
  );
}
