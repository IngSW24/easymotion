import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SignUpDto } from "@easymotion/openapi";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "@mui/icons-material";
import PhoneNumberEditor from "../../editors/PhoneNumberEditor/PhoneNumberEditor";
import {
  SignupCredentials,
  signupCredentialsSchema,
  SignupInformation,
  signupInformationSchema,
} from "./schema";
import { DateTime } from "luxon";
import { DateField } from "@mui/x-date-pickers";

export type SignupFormProps = {
  onSubmit: (data: SignUpDto) => void;
  phase: "credentials" | "info" | "final";
  setPhase: (phase: "credentials" | "info" | "final") => void;
};

const parseBirthDate = (d: string | null | undefined) => {
  if (!d) return null;

  return DateTime.fromFormat(d, "yyyy-MM-dd");
};

export default function SignupForm(props: SignupFormProps) {
  const {
    register: credentialsRegister,
    handleSubmit: credentialsHandleSubmit,
    formState: credentialsFormState,
  } = useForm<SignupCredentials>({
    resolver: zodResolver(signupCredentialsSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatedPassword: "",
      termsAndConditions: false,
    },
    mode: "onSubmit",
  });

  const {
    register: informationRegister,
    handleSubmit: informationHandleSubmit,
    formState: informationFormState,
    setValue: informationSetValue,
    watch: informationWatch,
  } = useForm<SignupInformation>({
    resolver: zodResolver(signupInformationSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      phoneNumber: "",
    },
    mode: "onSubmit",
  });

  const [credentialsState, setCredentialsState] =
    useState<SignupCredentials | null>(null);

  const onCredentialsSubmit = (data: SignupCredentials) => {
    setCredentialsState(data);
    props.setPhase("info");
  };

  const onInformationSubmit = (data: SignupInformation) => {
    if (!credentialsState) {
      throw new Error("Credentials are not set");
    }

    props.onSubmit({
      ...credentialsState,
      ...data,
    });
  };

  return (
    <>
      {props.phase == "credentials" && (
        <form onSubmit={credentialsHandleSubmit(onCredentialsSubmit)}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...credentialsRegister("email")}
            error={!!credentialsFormState.errors.email}
            helperText={credentialsFormState.errors.email?.message}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...credentialsRegister("password")}
            error={!!credentialsFormState.errors.password}
            helperText={credentialsFormState.errors.password?.message}
            required
          />
          <TextField
            fullWidth
            label="Conferma Password"
            type="password"
            margin="normal"
            {...credentialsRegister("repeatedPassword")}
            error={!!credentialsFormState.errors.repeatedPassword}
            helperText={credentialsFormState.errors.repeatedPassword?.message}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                required
                {...credentialsRegister("termsAndConditions")}
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
      )}
      {props.phase == "info" && (
        <form onSubmit={informationHandleSubmit(onInformationSubmit)}>
          <TextField
            fullWidth
            label="Nome"
            type="text"
            margin="normal"
            {...informationRegister("firstName")}
            error={!!informationFormState.errors.firstName}
            helperText={informationFormState.errors.firstName?.message}
            required
          />
          <TextField
            fullWidth
            label="Secondo Nome"
            type="text"
            margin="normal"
            {...informationRegister("middleName")}
            error={!!informationFormState.errors.middleName}
            helperText={informationFormState.errors.middleName?.message}
          />
          <TextField
            fullWidth
            label="Cognome"
            type="text"
            margin="normal"
            {...informationRegister("lastName")}
            error={!!informationFormState.errors.lastName}
            helperText={informationFormState.errors.lastName?.message}
            required
          />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateField
                format="dd/MM/yyyy"
                label="Data di nascita"
                value={parseBirthDate(informationWatch("birthDate"))}
                onChange={(d: DateTime | null) =>
                  d &&
                  informationSetValue("birthDate", d.toFormat("yyyy-MM-dd"))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <PhoneNumberEditor
                onChange={(v) => informationSetValue("phoneNumber", v)}
                value={informationWatch("phoneNumber")}
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            sx={{ marginTop: "20px" }}
          >
            Registrati
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            color="info"
            sx={{ marginTop: "10px" }}
            onClick={() => props.setPhase("credentials")}
          >
            Indietro
          </Button>
        </form>
      )}
      {props.phase == "final" && (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Stack alignItems="center" spacing={2}>
            <CheckCircle sx={{ fontSize: "4rem", color: "#4caf50" }} />
            <Typography variant="h4" fontWeight="bold">
              Registrazione completata
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Ti abbiamo inviato una email per confermare la tua registrazione.
              Controlla la tua casella di posta elettronica e conferma il tuo
              indirizzo mail per poter accedere al tuo account.
            </Typography>
          </Stack>
        </Box>
      )}
    </>
  );
}
