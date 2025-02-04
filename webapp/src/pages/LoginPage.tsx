import { useNavigate } from "react-router";
import FormComponent from "../components/FormComponent/FormComponent";
import { useAuth } from "@easymotion/auth-context";
import { useSnack } from "../hooks/useSnack";
import LoginForm from "../components/profile/LoginForm/LoginForm";
import { SignInDto } from "@easymotion/openapi";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const snack = useSnack();

  const onLoginClick = async (authInfo: SignInDto) => {
    if (!authInfo.email || !authInfo.password) return;
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
      text="Inserisci i tuoi dati per accedere al sito"
    >
      <LoginForm onSubmit={onLoginClick} />
    </FormComponent>
  );
}
