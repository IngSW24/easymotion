import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  Chip,
  Alert,
  Grid2,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Person } from "@mui/icons-material";
import { AuthUserDto, UpdateAuthUserDto } from "../../../client/Api";
import EmailUpdate from "./EmailUpdate";
import PasswordUpdate from "./PasswordUpdate";
import PhoneNumberEditor from "../../editors/PhoneNumberEditor/PhoneNumberEditor";
import { DateTime } from "luxon";
import { DateField } from "@mui/x-date-pickers";
import { useFormValidator } from "../../../hooks/useFormValidator";

export interface GeneralProfileSettingsProps {
  user: AuthUserDto;
  onProfileSave: (user: UpdateAuthUserDto) => void;
}

const getInitials = (user: AuthUserDto | undefined) => {
  if (!user) return "";
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
};

const mapUserRole = (role: AuthUserDto["role"]) => {
  switch (role) {
    case "USER":
      return "Utente";
    case "ADMIN":
      return "Amministratore";
    case "PHYSIOTHERAPIST":
      return "Fisioterapista";
    default:
      return "Ruolo non definito";
  }
};

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  [key: string]: string;
}

export default function GeneralProfileSettings(
  props: GeneralProfileSettingsProps
) {
  const { user, onProfileSave } = props;

  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const [formData, handleChange, { errors, validate }] =
    useFormValidator<FormData>(
      {
        firstName: user.firstName,
        middleName: user.middleName ? user.middleName : "",
        lastName: user.lastName,
        phoneNumber: user.phoneNumber ? user.phoneNumber : "",
        birthDate: user.birthDate ? user.birthDate : "",
      },
      {
        firstName: { required: true, minLength: 3, maxLength: 20 },
        middleName: { maxLength: 20 },
        lastName: { required: true, minLength: 3, maxLength: 20 },
        phoneNumber: { maxLength: 13 },
        birthDate: {
          pattern: RegExp(
            "^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$"
          ),
        },
      }
    );

  const parsedBirthDate = DateTime.fromFormat(
    formData.birthDate ?? "",
    "yyyy-MM-dd"
  );

  const handleSave = () => {
    if (!validate()) {
      console.log("Form is not valid");
      return;
    }

    console.log("Form is valid");

    onProfileSave(formData);
    setHasPendingChanges(false);
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          maxWidth: 800,
          boxShadow: 3,
          borderRadius: 3,
          padding: 3,
        }}
      >
        <CardContent>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginBottom: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 80,
                    height: 80,
                    fontSize: 32,
                    marginBottom: { xs: 2, sm: 0 },
                  }}
                >
                  {getInitials(user)}
                </Avatar>
                <Box sx={{ marginLeft: 2 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {user.firstName}
                  </Typography>
                  <Typography color="text.secondary">{user.email}</Typography>
                  {!user.isEmailVerified && (
                    <Alert severity="warning" sx={{ marginTop: 1 }}>
                      Email non confermata
                    </Alert>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  ml: 3,
                  flexGrow: 0,
                  display: "flex",
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: "end",
                }}
              >
                <Chip
                  label={mapUserRole(user.role)}
                  icon={<Person />}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {/* User Information */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Nome *
              </Typography>
              <TextField
                fullWidth
                value={formData.firstName || ""}
                size="small"
                placeholder="Il tuo nome"
                error={errors.firstName?.e}
                helperText={errors.firstName?.e ? errors.firstName?.eText : ""}
                onChange={(e) => {
                  handleChange("firstName", e.target.value);
                  setHasPendingChanges(true);
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Secondo nome
              </Typography>
              <TextField
                fullWidth
                value={formData.middleName || ""}
                size="small"
                placeholder="Il tuo secondo nome"
                error={errors.middleName?.e}
                helperText={
                  errors.middleName?.e ? errors.middleName?.eText : ""
                }
                onChange={(e) => {
                  handleChange("middleName", e.target.value);
                  setHasPendingChanges(true);
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Cognome *
              </Typography>
              <TextField
                fullWidth
                value={formData.lastName || ""}
                size="small"
                placeholder="Il tuo cognome"
                error={errors.lastName?.e}
                helperText={errors.lastName?.e ? errors.lastName?.eText : ""}
                onChange={(e) => {
                  handleChange("lastName", e.target.value);
                  setHasPendingChanges(true);
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Numero di telefono
              </Typography>
              <PhoneNumberEditor
                onChange={(v) => {
                  handleChange("phoneNumber", v);
                  setHasPendingChanges(true);
                }}
                value={formData.phoneNumber ?? ""}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Data di nascita *
              </Typography>
              <DateField
                format="dd/MM/yyyy"
                size="small"
                value={parsedBirthDate}
                helperText={errors.birthDate?.e ? errors.birthDate?.eText : ""}
                onChange={(v) => {
                  handleChange("birthDate", v ? v.toFormat("yyyy-MM-dd") : "");
                  setHasPendingChanges(true);
                }}
              />
            </Grid2>
          </Grid2>

          <Divider sx={{ marginY: 2 }} />

          {/* Actions Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!hasPendingChanges}
              onClick={handleSave}
              sx={{ paddingX: 3, marginTop: { xs: 2, sm: 0 } }}
            >
              Salva
            </Button>
          </Box>
        </CardContent>
      </Card>

      <EmailUpdate />

      <PasswordUpdate />
    </>
  );
}
