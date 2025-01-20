import { useNavigate } from "react-router";
import FormComponent from "../components/FormComponent/FormComponent";
import { useAuth } from "../hooks/useAuth";
import { useSnack } from "../hooks/useSnack";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const snack = useSnack();

  const onLoginClick = async (authInfo: Record<string, string>) => {
    try {
      await auth.login(authInfo.email, authInfo.password); // Call the login function from useAuth.
      navigate("/");
    } catch (e) {
      snack.showError(e); // Show the error as a snack message.
    }
  };

  return (
    <FormComponent
      title="Bentornato in EasyMotion"
      description="Inserisci i tuoi dati per accedere al sito"
      textFieldNumber={2}
      buttonName="Accedi"
      fieldName={[
        { key: "email", label: "Email", type: "email" },
        { key: "password", label: "Password", type: "password" },
      ]}
      checkboxName={"Resta Connesso"}
      onSubmit={onLoginClick}
    />
  );
}
