import {
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
import { Person, PhotoCamera } from "@mui/icons-material";
import { AuthUserDto, UpdateAuthUserDto } from "@easymotion/openapi";
import EmailUpdate from "./EmailUpdate";
import PasswordUpdate from "./PasswordUpdate";
import PhoneNumberEditor from "../../editors/PhoneNumberEditor/PhoneNumberEditor";
import { DateField } from "@mui/x-date-pickers";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DateTime } from "luxon";
import ProfileAvatar from "../../Layout/ProfileAvatar";
import { useEffect, useState } from "react";
import { getProfilePictureUrl } from "../../../utils/format";
import AvatarUploadDialog from "./AvatarUploadDialog";

export interface GeneralProfileSettingsProps {
  user: AuthUserDto;
  onProfileSave: (user: UpdateAuthUserDto) => void;
}

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

export default function GeneralProfileSettings(
  props: GeneralProfileSettingsProps
) {
  const { user, onProfileSave } = props;
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    control,
    reset,
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

  const birthDate = useWatch({
    control,
    name: "birthDate",
  });

  const onSubmit = (data: UpdateAuthUserDto) => {
    onProfileSave(data);
  };

  // Reset the form when the user is updated
  useEffect(() => {
    reset({
      firstName: props.user.firstName,
      middleName: props.user.middleName || "",
      lastName: props.user.lastName,
      phoneNumber: props.user.phoneNumber || "",
      birthDate: props.user.birthDate || "",
    });
  }, [props.user, reset]);

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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <ProfileAvatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 80,
                      height: 80,
                      fontSize: 32,
                      marginBottom: { xs: 1, sm: 1 },
                    }}
                  />
                  <Button
                    size="small"
                    startIcon={<PhotoCamera />}
                    onClick={() => setIsAvatarDialogOpen(true)}
                    sx={{ mb: { xs: 2, sm: 0 } }}
                  >
                    Cambia
                  </Button>
                </Box>

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
                {...register("firstName")}
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
                {...register("middleName")}
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
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Numero di telefono
              </Typography>
              <PhoneNumberEditor
                height="40px"
                onChange={(value) =>
                  setValue("phoneNumber", value, { shouldDirty: true })
                }
                value={watch("phoneNumber")}
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
                  setValue("birthDate", v?.toFormat("yyyy-MM-dd"), {
                    shouldDirty: true,
                  })
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
              disabled={!isDirty}
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

      <AvatarUploadDialog
        open={isAvatarDialogOpen}
        onClose={() => setIsAvatarDialogOpen(false)}
        avatarUrl={
          user.picturePath ? getProfilePictureUrl(user.picturePath) : undefined
        }
      />
    </>
  );
}
