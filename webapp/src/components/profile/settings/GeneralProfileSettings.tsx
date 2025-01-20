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
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Clear, Edit, Logout, Person } from "@mui/icons-material";
import EditableTextField from "../../editors/EditableTextField/EditableTextField";
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

export default function GeneralProfileSettings(
  props: GeneralProfileSettingsProps
) {
  const { user, onProfileSave } = props;
  const { logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
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
  };

  const handleSave = () => {
    onProfileSave(userData);
    setIsEditing(false);
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
              sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
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
                  {user.firstName || "Anonymous"}
                </Typography>
                <Typography color="text.secondary">
                  {user.email || "No email provided"}
                </Typography>
                {!user.isEmailVerified && (
                  <Alert severity="warning" sx={{ marginTop: 1 }}>
                    Email not verified
                  </Alert>
                )}
              </Box>
              <Box sx={{ ml: 2 }}>
                <Chip label={user?.role} icon={<Person />} variant="outlined" />
              </Box>
            </Box>
            <Button
              variant="contained"
              color={isEditing ? "inherit" : "primary"}
              startIcon={!isEditing ? <Edit /> : <Clear />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{ marginTop: { xs: 2, sm: 0 } }}
            >
              {isEditing ? "Annulla" : "Modifica"}
            </Button>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {/* User Information */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Nome
              </Typography>
              <EditableTextField
                isEditing={isEditing}
                showValue={user.firstName || "N/A"}
                editValue={userData.firstName}
                onChange={(v) => handleChange("firstName", v)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Secondo nome
              </Typography>
              <EditableTextField
                isEditing={isEditing}
                showValue={user.middleName ?? ""}
                editValue={userData.middleName ?? ""}
                onChange={(v) => handleChange("middleName", v)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Cognome
              </Typography>
              <EditableTextField
                isEditing={isEditing}
                showValue={user.lastName || ""}
                editValue={userData.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Numero di telefono
              </Typography>
              {isEditing ? (
                <PhoneNumberEditor
                  onChange={(v) => handleChange("phoneNumber", v)}
                  value={user.phoneNumber ?? ""}
                />
              ) : (
                <EditableTextField
                  isEditing={isEditing}
                  showValue={user.phoneNumber || "N/A"}
                />
              )}
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Data di nascita
              </Typography>
              {isEditing ? (
                <DateField
                  format="dd/MM/yyyy"
                  value={parsedBirthDate}
                  onChange={(v) =>
                    handleChange(
                      "birthDate",
                      !v ? null : v.toFormat("yyyy-MM-dd")
                    )
                  }
                />
              ) : (
                <EditableTextField
                  showValue={parsedBirthDate.toFormat("dd/MM/yyyy")}
                  isEditing={false}
                />
              )}
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
            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ paddingX: 3, marginTop: { xs: 2, sm: 0 } }}
              >
                Salva
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Logout />}
                onClick={logout}
                sx={{ paddingX: 3, marginTop: { xs: 2, sm: 0 } }}
              >
                Esci
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <EmailUpdate />

      <PasswordUpdate />
    </>
  );
}
