import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  TextField,
  Switch,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { PatientDto, UpdateAuthUserDto } from "@easymotion/openapi";
import NumberField from "../../../atoms/TextField/NumberField";
import { usePatientForm } from "../../../../hooks/usePatientForm";

export interface PatientSettingsProps {
  patient: PatientDto | null;
  onSave: (data: UpdateAuthUserDto) => void;
}

export default function PatientSettings(props: PatientSettingsProps) {
  const { patient, onSave } = props;
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    setValue,
    watch,
    onSubmitEvent,
  } = usePatientForm({ patient, onSave });

  return (
    <Card
      sx={{ width: "100%", m: "auto", boxShadow: 3, borderRadius: 3, p: 3 }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Person sx={{ mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Dati sanitari
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Dati anagrafici & antropometrici
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="sex"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sesso"
                  select
                  fullWidth
                  size="small"
                  error={!!errors.sex}
                  helperText={errors.sex?.message}
                >
                  <MenuItem value="MALE">Maschio</MenuItem>
                  <MenuItem value="FEMALE">Femmina</MenuItem>
                  <MenuItem value="OTHER">Altro</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              label="Altezza (cm)"
              placeholder="es. 175"
              {...register("height", { valueAsNumber: true })}
              error={!!errors.height}
              helperText={errors.height?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              label="Peso (kg)"
              placeholder="es. 70"
              {...register("weight", { valueAsNumber: true })}
              error={!!errors.weight}
              helperText={errors.weight?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Professione"
              fullWidth
              size="small"
              placeholder="es. Ingegnere"
              error={!!errors.profession}
              helperText={errors.profession?.message}
              {...register("profession")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Sport praticato"
              fullWidth
              size="small"
              placeholder="es. Calcio"
              error={!!errors.sport}
              helperText={errors.sport?.message}
              {...register("sport")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              label="Frequenza sportiva (0-7)"
              placeholder="es. 3"
              {...register("sportFrequency", { valueAsNumber: true })}
              error={!!errors.sportFrequency}
              helperText={errors.sportFrequency?.message}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Segni vitali
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Pressione sanguignia (mmHg)"
              fullWidth
              size="small"
              placeholder="es. 120/80"
              error={!!errors.bloodPressure}
              helperText={errors.bloodPressure?.message}
              {...register("bloodPressure", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              label="Frequenza cardiaca a riposo (bpm)"
              placeholder="es. 60"
              {...register("restingHeartRate", { valueAsNumber: true })}
              error={!!errors.restingHeartRate}
              helperText={errors.restingHeartRate?.message}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Storia medica
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              multiline
              minRows={2}
              label="Farmaci in uso"
              fullWidth
              size="small"
              placeholder="es. Ibuprofene 400 mg x2/die"
              error={!!errors.medications}
              helperText={errors.medications?.message}
              {...register("medications")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              multiline
              minRows={2}
              label="Allergie"
              fullWidth
              size="small"
              placeholder="es. Penicillina, lattice..."
              error={!!errors.allergies}
              helperText={errors.allergies?.message}
              {...register("allergies")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              multiline
              minRows={2}
              label="Altre patologie"
              fullWidth
              size="small"
              placeholder="es. Diabete"
              error={!!errors.otherPathologies}
              helperText={errors.otherPathologies?.message}
              {...register("otherPathologies")}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Stile di vita & Fattori psicosociali
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 6 }} />
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={watch("smoker") ?? false}
                  onChange={(e) =>
                    setValue("smoker", e.target.checked, {
                      shouldDirty: true,
                    })
                  }
                />
              }
              label={watch("smoker") ? "Fumatore" : "Non fumatore"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              label="Unità alcoliche settimanali"
              placeholder="es. 10"
              {...register("alcoholUnits", { valueAsNumber: true })}
              error={!!errors.alcoholUnits}
              helperText={errors.alcoholUnits?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="mobilityLevel"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Livello di mobilità"
                  select
                  fullWidth
                  size="small"
                  error={!!errors.mobilityLevel}
                  helperText={errors.mobilityLevel?.message}
                >
                  <MenuItem value="LIMITED">Limitato</MenuItem>
                  <MenuItem value="MODERATE">Moderato</MenuItem>
                  <MenuItem value="FULL">Totale</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="activityLevel"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Livello di difficoltà di svolgimento di attività fisica"
                  select
                  fullWidth
                  size="small"
                  error={!!errors.activityLevel}
                  helperText={errors.activityLevel?.message}
                >
                  <MenuItem value="LOW">Basso</MenuItem>
                  <MenuItem value="MEDIUM">Medio</MenuItem>
                  <MenuItem value="HIGH">Alto</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              label="Ore di sonno (media/notte)"
              placeholder="es. 7"
              {...register("sleepHours", { valueAsNumber: true })}
              error={!!errors.sleepHours}
              helperText={errors.sleepHours?.message}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Altri dati
        </Typography>
        <Grid container spacing={2} mb={2}>
          {/**
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Ultimo controllo medico"
              fullWidth
              size="small"
              placeholder="es. 2023-01-15"
              error={!!errors.lastMedicalCheckup}
              helperText={errors.lastMedicalCheckup?.message}
              {...register("lastMedicalCheckup", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
            />
          </Grid>
           */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              multiline
              minRows={2}
              label="Note"
              fullWidth
              size="small"
              placeholder="Eventuali note aggiuntive..."
              error={!!errors.notes}
              helperText={errors.notes?.message}
              {...register("notes")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              multiline
              minRows={2}
              label="Obiettivi personali"
              fullWidth
              size="small"
              placeholder="es. Migliorare la forma fisica"
              error={!!errors.personalGoals}
              helperText={errors.personalGoals?.message}
              {...register("personalGoals")}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isDirty}
            onClick={handleSubmit(onSubmitEvent)}
            sx={{ paddingX: 3, marginTop: { xs: 2, sm: 0 } }}
          >
            Salva
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
