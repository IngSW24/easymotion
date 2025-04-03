import "./otp-style.css";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import OTPInput from "./OtpInput";

export interface TwoStepFormProps {
  onSubmit: (code: string) => void;
}

export default function TwoStepAuthForm({ onSubmit }: TwoStepFormProps) {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (otp.length === 6) {
      setOtp("");
      onSubmit(otp);
    }
  }, [otp, onSubmit]);

  return (
    <>
      <Stack direction="column" spacing={4} sx={{ textAlign: "center" }}>
        <OTPInput
          length={6}
          className="otpContainer"
          inputClassName="otpInput"
          isNumberInput
          autoFocus
          onChangeOTP={(otp) => setOtp(otp)}
        />

        <Typography sx={{ py: 2 }}>
          Inserisci il codice che ti abbiamo inviato via mail
        </Typography>
      </Stack>
    </>
  );
}
