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

export default function GeneralProfileSettings(
  props: GeneralProfileSettingsProps
) {
  const { user, onProfileSave } = props;

  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [userData, setUserData] = useState<AuthUserDto>(user);

  const parsedBirthDate = DateTime.fromFormat(
    userData.birthDate ?? "",
    "yyyy-MM-dd"
  );

  const handleChange = <T extends keyof AuthUserDto>(
    field: T,
    value: AuthUserDto[T]
  ) => {
    setUserData((prev: AuthUserDto) => ({ ...prev, [field]: value }));
    setHasPendingChanges(true);
  };

  const handleSave = () => {
    onProfileSave(userData);
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
                Nome
              </Typography>
              <TextField
                fullWidth
                value={user.firstName || ""}
                size="small"
                placeholder="Il tuo nome"
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Secondo nome
              </Typography>
              <TextField
                fullWidth
                value={user.middleName || ""}
                size="small"
                placeholder="Il tuo secondo nome"
                onChange={(e) => handleChange("middleName", e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Cognome
              </Typography>
              <TextField
                fullWidth
                value={user.lastName || ""}
                size="small"
                placeholder="Il tuo cognome"
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Numero di telefono
              </Typography>
              <PhoneNumberEditor
                onChange={(v) => handleChange("phoneNumber", v)}
                value={user.phoneNumber ?? ""}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Data di nascita
              </Typography>
              <DateField
                format="dd/MM/yyyy"
                size="small"
                value={parsedBirthDate}
                onChange={(v) =>
                  handleChange(
                    "birthDate",
                    !v ? null : v.toFormat("yyyy-MM-dd")
                  )
                }
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
