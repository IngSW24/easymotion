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
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Person } from "@mui/icons-material";
import { AuthUserDto, UpdateAuthUserDto } from "@easymotion/openapi";
import EmailUpdate from "./EmailUpdate";
import PasswordUpdate from "./PasswordUpdate";
import PhoneNumberEditor from "../../editors/PhoneNumberEditor/PhoneNumberEditor";
import { DateField } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DateTime } from "luxon";

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

// Define the Zod schema
const schema = z.object({
  firstName: z.string().min(3).max(20),
  middleName: z.string().max(20).optional(),
  lastName: z.string().min(3).max(20),
  phoneNumber: z.string().max(13).optional(),
  birthDate: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export default function GeneralProfileSettings(
  props: GeneralProfileSettingsProps
) {
  const { user, onProfileSave } = props;

  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue: setValueForm,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName,
      middleName: user.middleName || "",
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || "",
      birthDate: user.birthDate || "",
    },
  });

  const birthDate = watch("birthDate");

  const setValue = (...args: Parameters<typeof setValueForm>) => {
    setValueForm(...args);
    setHasPendingChanges(true);
  };

  const onSubmit = (data: UpdateAuthUserDto) => {
    onProfileSave(data);
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
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Nome *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Il tuo nome"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                value={watch("firstName")}
                onChange={(e) => setValue("firstName", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Secondo nome
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Il tuo secondo nome"
                error={!!errors.middleName}
                helperText={errors.middleName?.message}
                value={watch("middleName")}
                onChange={(e) => setValue("middleName", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Cognome *
              </Typography>
              <TextField
                {...register("lastName")}
                fullWidth
                size="small"
                placeholder="Il tuo cognome"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                value={watch("lastName")}
                onChange={(e) => setValue("lastName", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Numero di telefono
              </Typography>
              <PhoneNumberEditor
                height="40px"
                value={watch("phoneNumber") ?? ""}
                onChange={(e) => setValue("phoneNumber", e)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Data di nascita
              </Typography>
              <DateField
                format="dd/MM/yyyy"
                value={
                  !birthDate
                    ? null
                    : DateTime.fromFormat(birthDate, "yyyy-MM-dd")
                }
                onChange={(v) =>
                  setValue("birthDate", v?.toFormat("yyyy-MM-dd"))
                }
                size="small"
                helperText={errors.birthDate?.message}
              />
            </Grid>
          </Grid>

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
              onClick={handleSubmit(onSubmit)}
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
