import FormComponent from "../components/FormComponent/FormComponent";
import { useCallback, useState } from "react";
import { useAuth } from "@easymotion/auth-context";
import { SignUpDto } from "@easymotion/openapi";
import { useSnack } from "../hooks/useSnack";
import SignupForm, {
  SignupFormProps,
} from "../components/auth/SignupForm/SignupForm";

const getPhaseMessage = (phase: SignupFormProps["phase"]) => {
  switch (phase) {
    case "credentials":
      return "Ti chiediamo di inserire i dati che utilizzerai per accedere al nostro sito";
    case "info":
      return "Bene, ora che hai completato la parte più sensibile, parlaci un po' di te ...";
    case "final":
      return "Completa la registrazione";
    default:
      return "Errore";
  }
};

export default function SignupPage() {
  const auth = useAuth();
  const snack = useSnack();
  const [phase, setPhase] = useState<SignupFormProps["phase"]>("credentials");

  const handleSubmit = useCallback(
    (data: SignUpDto) => {
      auth
        .signup(data)
        .then(() => setPhase("final"))
        .catch(() => {
          snack.showError(
            "Errore durante la registrazione, si prega di riprovare."
          );
        });
    },
    [auth, snack]
  );

  return (
    <>
      <FormComponent
        title="Benvenuto in EasyMotion"
        text={getPhaseMessage(phase)}
      >
        <SignupForm phase={phase} setPhase={setPhase} onSubmit={handleSubmit} />
      </FormComponent>
    </>
  );
}
