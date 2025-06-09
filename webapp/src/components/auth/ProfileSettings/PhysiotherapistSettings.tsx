import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { PhysiotherapistDto, UpdateAuthUserDto } from "@easymotion/openapi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Person } from "@mui/icons-material";
import PhoneNumberEditor from "../../editors/PhoneNumberEditor/PhoneNumberEditor";
import MarkdownTextField from "../../atoms/MarkdownTextField/MarkdownTextField";

export interface PhysiotherapistSettingsProps {
  physiotherapist: PhysiotherapistDto | null;
  onProfileSave: (user: UpdateAuthUserDto) => void;
}

// Define the Zod schema
const schema = z.object({
  bio: z.string().nullable(),
  specialization: z
    .string()
    .min(1, "La specializzazione è obbligatoria")
    .optional(),
  publicPhoneNumber: z
    .string()
    .min(1, "Il numero di telefono pubblico è obbligatorio")
    .optional()
    .nullable(),
  publicEmail: z
    .string()
    .email("Email non valida")
    .optional()
    .or(z.literal("")),
  publicAddress: z
    .string()
    .min(1, "L'indirizzo pubblico è obbligatorio")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("URL non valido")
    .optional()
    .or(z.literal(""))
    .optional(),
  socialMediaLinks: z
    .array(z.string().url("URL non valido").or(z.literal("")))
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function PhysiotherapistSettings(
  props: PhysiotherapistSettingsProps
) {
  const { physiotherapist, onProfileSave } = props;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: physiotherapist?.bio || "",
      specialization: physiotherapist?.specialization || "",
      publicPhoneNumber: physiotherapist?.publicPhoneNumber || "",
      publicEmail: physiotherapist?.publicEmail || "",
      publicAddress: physiotherapist?.publicAddress || "",
      website: physiotherapist?.website || "",
      socialMediaLinks: physiotherapist?.socialMediaLinks || [],
    },
  });

  const onSubmit = (data: FormData) => {
    onProfileSave({ physiotherapist: data as PhysiotherapistDto });
    // Reset the form state after successful submission
    reset(data, {
      keepValues: true, // Keep the current values
      keepDirty: false, // Reset the dirty state
    });
  };

  // Reset the form when the physiotherapist data is updated
  useEffect(() => {
    reset({
      bio: physiotherapist?.bio || "",
      specialization: physiotherapist?.specialization || "",
      publicPhoneNumber: physiotherapist?.publicPhoneNumber || "",
      publicEmail: physiotherapist?.publicEmail || "",
      publicAddress: physiotherapist?.publicAddress || "",
      website: physiotherapist?.website || "",
      socialMediaLinks: physiotherapist?.socialMediaLinks || [],
    });
  }, [physiotherapist, reset]);

  return (
    <Card
      sx={{
        width: "100%",
        margin: "auto",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person />{" "}
            {/* Using Person as the icon component to reflect personal data */}
            <Typography variant="h5" fontWeight="bold">
              Dati Fisioterapista
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* User Information */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Bio
            </Typography>
            <MarkdownTextField
              value={watch("bio") ?? ""}
              onChange={(e) => setValue("bio", e)}
              fullWidth
              multiline
              rows={15}
              placeholder="Inserisci la tua bio in formato markdown"
              error={!!errors.bio}
              helperText={errors.bio?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Specializzazione *
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="La tua specializzazione"
              error={!!errors.specialization}
              helperText={errors.specialization?.message}
              {...register("specialization")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Numero di telefono pubblico *
            </Typography>

            <PhoneNumberEditor
              height="40px"
              onChange={(value) =>
                setValue("publicPhoneNumber", value, { shouldDirty: true })
              }
              value={watch("publicPhoneNumber") ?? ""}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Email pubblica *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Email pubblica"
              error={!!errors.publicEmail}
              helperText={errors.publicEmail?.message}
              {...register("publicEmail")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Indirizzo pubblico *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Indirizzo pubblico"
              error={!!errors.publicAddress}
              helperText={errors.publicAddress?.message}
              {...register("publicAddress")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Sito web
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="https://www.example.com"
              error={!!errors.website}
              helperText={errors.website?.message}
              {...register("website")}
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
            onClick={handleSubmit(onSubmit)} // TODO: use form component
            sx={{ paddingX: 3, marginTop: { xs: 2, sm: 0 } }}
          >
            Salva
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
