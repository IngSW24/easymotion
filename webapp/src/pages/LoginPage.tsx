import { useNavigate } from "react-router";
import FormComponent from "../components/FormComponent/FormComponent";
import { useAuth } from "@easymotion/auth-context";
import { useSnack } from "../hooks/useSnack";
import { SignInDto } from "@easymotion/openapi";
import { useState } from "react";
import TwoStepAuthForm from "../components/TwoStepAuthForm/TwoStepAuthForm";
import { Box, Paper } from "@mui/material";
import LoginForm from "../components/auth/LoginForm/LoginForm";
import Fade from "../components/animations/Fade";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const snack = useSnack();
  const [isOtpStage, setIsOtpStage] = useState(false);

  const onLoginClick = async (authInfo: SignInDto) => {
    if (!authInfo.email || !authInfo.password) return;
    try {
      const response = await auth.login(authInfo.email, authInfo.password);

      if (!response.needsOtp) {
        navigate("/");
        return;
      }

      setIsOtpStage(true);
    } catch (e) {
      snack.showError(e);
    }
  };

  const onOtpConfirmed = async (otp: string) => {
    try {
      await auth.loginOtp(otp);
      navigate("/");
    } catch (e) {
      snack.showError(e);
    }
  };

  return (
    <Fade>
      {isOtpStage ? (
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
      )}
    </Fade>
  );
}
