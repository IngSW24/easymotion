import { useNavigate } from "react-router";
import FormComponent from "../components/FormComponent/FormComponent";
import { useAuth } from "@easymotion/auth-context";
import { useSnack } from "../hooks/useSnack";
import LoginForm from "../components/profile/LoginForm/LoginForm";
import { SignInDto } from "@easymotion/openapi";
import { useState } from "react";
import TwoStepAuthForm from "../components/TwoStepAuthForm/TwoStepAuthForm";
import { Box, Paper } from "@mui/material";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const snack = useSnack();
  const [isOtpStage, setIsOtpStage] = useState(false);

  const onLoginClick = async (authInfo: SignInDto) => {
    if (!authInfo.email || !authInfo.password) return;
    try {
      const response = await auth.login(authInfo.email, authInfo.password); // Call the login function from useAuth.

      if (!response.needsOtp) {
        navigate("/");
        return;
      }

      setIsOtpStage(true);
    } catch (e) {
      snack.showError(e); // Show the error as a snack message.
    }
  };

  const onOtpConfirmed = async (otp: string) => {
    try {
      await auth.loginOtp(otp); // Call the loginOtp function from useAuth.
      navigate("/");
    } catch (e) {
      snack.showError(e); // Show the error as a snack message.
    }
  };

  return isOtpStage ? (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 20 }}>
      <Paper sx={{ padding: 4 }} elevation={3}>
        <TwoStepAuthForm onSubmit={onOtpConfirmed} />
      </Paper>
    </Box>
  ) : (
    <FormComponent
      title="Bentornato in EasyMotion"
      text="Inserisci i tuoi dati per accedere al sito"
    >
      <LoginForm onSubmit={onLoginClick} />
    </FormComponent>
  );
}
