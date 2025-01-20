import FormComponent from "../components/FormComponent/FormComponent";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { SignUpDto } from "../client/Api";

/**
email*	[...]
password*	[...]
repeatedPassword*	[...]
username*	[...]
firstName*	[...]
middleName	[...]
lastName*	[...]
phoneNumber	[...]
birthDate	[...]
}
 */

export default function SignupPage() {
  const auth = useAuth();
  const [initialInfo, setinitialInfo] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"initial" | "info" | "final" | "error">(
    "initial"
  );

  const handleSignup = (v: Record<string, string>) => {
    auth.signup({ ...initialInfo, ...v } as unknown as SignUpDto);
  };

  return (
    <>
      {phase == "initial" && (
        <FormComponent<SignUpDto>
          title="Benvenuto in EasyMotion"
          description="Ti chiediamo di inserire i dati che utilizzerai per accedere al nostro sito"
          textFieldNumber={3}
          buttonName="Registrati"
          fieldName={[
            { key: "email", label: "Email", type: "email" },
            { key: "password", label: "Password", type: "password" },
            {
              key: "repeatedPassword",
              label: "Ripeti Password",
              type: "password",
            },
          ]}
          checkboxName="Accetto i termini e le condizioni"
          onSubmit={(v) => {
            setinitialInfo(v);
            setPhase("info");
          }}
        />
      )}
      {phase == "info" && (
        <FormComponent
          title="Benvenuto in EasyMotion"
          description="Bene, ora che hai completato la parte più sensibile, parlaci un po' di te ..."
          textFieldNumber={8}
          buttonName="Completa la registrazione"
          onSubmit={handleSignup}
          fieldName={[
            { key: "username", label: "Username", type: "text" },
            { key: "firstName", label: "Nome", type: "text" },
            { key: "middleName", label: "Secondo Nome", type: "text" },
            { key: "lastName", label: "Cognome", type: "text" },
            { key: "phoneNumber", label: "Telefono", type: "text" },
            { key: "birthDate", label: "Data di Nascita", type: "date" },
          ]}
        ></FormComponent>
      )}
    </>
  );
}
