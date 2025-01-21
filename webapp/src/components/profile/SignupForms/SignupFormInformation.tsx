import { Button, Grid2, TextField } from "@mui/material";
import { useState } from "react";
import PhoneNumberEditor from "../../editors/PhoneNumberEditor/PhoneNumberEditor";
import { DateField } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { SignUpDto } from "../../../client/Api";

export interface SignupFormInformationProps {
  onSubmit: (d: Partial<SignUpDto>) => void;
}

export default function PersonalInfoForm(props: SignupFormInformationProps) {
  const [name, setName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    // Reset errors
    setNameError("");
    setLastNameError("");

    // Validate required fields
    if (!name.trim()) {
      setNameError("Il nome è obbligatorio.");
      isValid = false;
    }

    if (!lastName.trim()) {
      setLastNameError("Il cognome è obbligatorio.");
      isValid = false;
    }

    if (!isValid) return;

    props.onSubmit({
      firstName: name,
      middleName,
      lastName,
      birthDate: birthDate || undefined,
      phoneNumber,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Nome"
        name="name"
        type="text"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!nameError}
        helperText={nameError}
        required
      />
      <TextField
        fullWidth
        label="Secondo Nome"
        name="middleName"
        type="text"
        margin="normal"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Cognome"
        name="lastName"
        type="text"
        margin="normal"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        error={!!lastNameError}
        helperText={lastNameError}
        required
      />

      <Grid2 container spacing={2} sx={{ mt: 2 }}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <DateField
            format="dd/MM/yyyy"
            label="Data di nascita"
            value={
              !birthDate ? null : DateTime.fromFormat(birthDate, "yyyy-MM-dd")
            }
            onChange={(d) => d && setBirthDate(d.toFormat("yyyy-MM-dd"))}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <PhoneNumberEditor
            onChange={(v) => setPhoneNumber(v)}
            value={phoneNumber}
          />
        </Grid2>
      </Grid2>

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
    </form>
  );
}
