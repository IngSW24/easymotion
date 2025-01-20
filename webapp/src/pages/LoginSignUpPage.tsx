import FormComponent from "../components/FormComponent/FormComponent";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSnack } from "../hooks/useSnack";
import { useApiClient } from "../hooks/useApiClient";

interface LoginSignUpPageProps {
  loginType: "login" | "register" | "personal";
}

export default function LoginSignUpPage(prop: LoginSignUpPageProps) {
  const { loginType } = prop;
  const navigate = useNavigate();
  const snack = useSnack();
  const auth = useAuth();
  const { apiClient } = useApiClient();

  async function onLoginClick(authInfo: Record<string, string>) {
    try {
      await auth.login(authInfo.email, authInfo.password); // Call the login function from useAuth.
      navigate("/");
    } catch (e) {
      snack.showError(e); // Show the error as a snack message.
    }
  }

  const handleSignupClick = () => {
    navigate("/personal_information");
  };

  return (
    <>
      {loginType == "login" && (
        <FormComponent
          title="Bentornato in EasyMotion"
          description="Inserisci i tuoi dati per accedere al sito"
          textFieldNumber={2}
          checkbox={true}
          buttonName="Accedi"
          fieldName={["email", "password"]}
          checkboxName={"Resta Connesso"}
          onSubmit={onLoginClick}
        />
      )}
      {loginType == "register" && (
        <FormComponent
          title="Benvenuto in EasyMotion"
          description="Ti chiediamo di inserire i dati che utilizzerai per accedere al nostro sito"
          textFieldNumber={3}
          checkbox={true}
          buttonName="Registrati"
          fieldName={["email", "password", "ripeti la password"]}
          checkboxName="Accetto i termini e le condizioni"
          onSubmit={handleSignupClick}
        />
      )}
      {loginType == "personal" && (
        <FormComponent
          title="Benvenuto in EasyMotion"
          description="Bene, ora che hai completato la parte più sensibile, parlaci un po' di te ..."
          textFieldNumber={8}
          buttonName="Completa la registrazione"
          fieldName={[
            "nome",
            "secondo nome",
            "cognome",
            "telefono",
            "data di nascita",
          ]}
        ></FormComponent>
      )}
    </>
  );
}
