import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  TextField,
  Slider,
  Alert,
  Switch,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatientDto, UpdateAuthUserDto } from "@easymotion/openapi";

export interface PatientSettingsProps {
  defaultValues: PatientDto | null;
  onSave: (data: UpdateAuthUserDto) => void;
}

export interface PatientMedicalData {
  sex: "MALE" | "FEMALE" | "OTHER" | null;
  height: number | null;
  weight: number | null;
  smoker: boolean | null;
  alcoholUnits: number | null;
  activityLevel: "LOW" | "MEDIUM" | "HIGH" | null;
  mobilityLevel: "LIMITED" | "MODERATE" | "FULL" | null;
  bloodPressure: string | null;
  restingHeartRate: number | null;
  profession: string | null;
  sport: string | null;
  sportFrequency: number | null;
  medications: string | null;
  allergies: string | null;
  otherPathologies: string | null;
  painZone: string | null;
  painIntensity: number | null;
  painFrequency: string | null;
  painCharacteristics: string | null;
  painModifiers: string | null;
  sleepHours: number | null;
  perceivedStress: number | null;
  lastMedicalCheckup: string | null;
  personalGoals: string | null;
  notes: string | null;
}

const schema = z.object({
  /** 1. Anagrafica */
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).nullable(),
  height: z
    .number({ invalid_type_error: "Inserisci l'altezza" })
    .min(50)
    .max(300)
    .nullable(),
  weight: z
    .number({ invalid_type_error: "Inserisci il peso" })
    .min(20)
    .max(500)
    .nullable(),
  profession: z.string().min(2, "Almeno 2 caratteri").nullable(),
  sport: z.string().nullable(),
  sportFrequency: z.number().min(0).max(7).nullable(),

  /** 2. Segni vitali */
  bloodPressure: z
    .string()
    .regex(/^[0-9]{2,3}\/[0-9]{2,3}$/i, { message: "Formato 120/80" })
    .nullable(),
  restingHeartRate: z.number().positive().nullable(),

  /** 3. Stile di vita */
  smoker: z.boolean().nullable(),
  alcoholUnits: z.number().min(0).nullable(),
  activityLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable(),
  mobilityLevel: z.enum(["LIMITED", "MODERATE", "FULL"]).nullable(),
  sleepHours: z.number().min(0).max(24).nullable(),
  perceivedStress: z.number().min(0).max(10).nullable(),

  /** 4. Storia medica */
  medications: z.string().nullable(),
  allergies: z.string().nullable(),
  otherPathologies: z.string().nullable(),

  /** 5. Dolore */
  painZone: z.string().nullable(),
  painIntensity: z.number().min(0).max(10).nullable(),
  painFrequency: z.enum(["COSTANT", "INTERMITTENT", "NIGHT"]).nullable(),
  painCharacteristics: z.string().nullable(),
  painModifiers: z.string().nullable(),

  /** 6. Altre */
  lastMedicalCheckup: z.string().nullable(),
  personalGoals: z.string().nullable(),
  notes: z.string().nullable(),
});

type FormData = z.infer<typeof schema>;

export default function PatientSettings({
  defaultValues,
  onSave,
}: PatientSettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      sex: defaultValues?.sex || null,
      height: defaultValues?.height || null,
      weight: defaultValues?.weight || null,
      profession: defaultValues?.profession || "",
      sport: defaultValues?.sport || "",
      sportFrequency: defaultValues?.sportFrequency || null,
      bloodPressure: defaultValues?.bloodPressure || "",
      restingHeartRate: defaultValues?.restingHeartRate || null,
      smoker: defaultValues?.smoker ?? false,
      alcoholUnits: defaultValues?.alcoholUnits || null,
      activityLevel: defaultValues?.activityLevel || null,
      mobilityLevel: defaultValues?.mobilityLevel || null,
      sleepHours: defaultValues?.sleepHours || null,
      perceivedStress: defaultValues?.perceivedStress || null,
      medications: defaultValues?.medications || "",
      allergies: defaultValues?.allergies || "",
      otherPathologies: defaultValues?.otherPathologies || "",
      painZone: defaultValues?.painZone || "",
      painIntensity: defaultValues?.painIntensity || null,
      painFrequency:
        defaultValues?.painFrequency === "COSTANT" ||
        defaultValues?.painFrequency === "INTERMITTENT" ||
        defaultValues?.painFrequency === "NIGHT"
          ? defaultValues.painFrequency
          : null,
      painCharacteristics: defaultValues?.painCharacteristics || "",
      painModifiers: defaultValues?.painModifiers || "",
      lastMedicalCheckup: defaultValues?.lastMedicalCheckup || "",
      personalGoals: defaultValues?.personalGoals || "",
      notes: defaultValues?.notes || "",
    },
  });

  // Reset the form when the physiotherapist data is updated
  useEffect(() => {
    reset({
      sex: defaultValues?.sex || null,
      height: defaultValues?.height || null,
      weight: defaultValues?.weight || null,
      profession: defaultValues?.profession || "",
      sport: defaultValues?.sport || "",
      sportFrequency: defaultValues?.sportFrequency || null,
      bloodPressure: defaultValues?.bloodPressure || "",
      restingHeartRate: defaultValues?.restingHeartRate || null,
      smoker: defaultValues?.smoker ?? false,
      alcoholUnits: defaultValues?.alcoholUnits || null,
      activityLevel: defaultValues?.activityLevel || null,
      mobilityLevel: defaultValues?.mobilityLevel || null,
      sleepHours: defaultValues?.sleepHours || null,
      perceivedStress: defaultValues?.perceivedStress || null,
      medications: defaultValues?.medications || "",
      allergies: defaultValues?.allergies || "",
      otherPathologies: defaultValues?.otherPathologies || "",
      painZone: defaultValues?.painZone || "",
      painIntensity: defaultValues?.painIntensity || null,
      painFrequency:
        defaultValues?.painFrequency === "COSTANT" ||
        defaultValues?.painFrequency === "INTERMITTENT" ||
        defaultValues?.painFrequency === "NIGHT"
          ? defaultValues.painFrequency
          : null,
      painCharacteristics: defaultValues?.painCharacteristics || "",
      painModifiers: defaultValues?.painModifiers || "",
      lastMedicalCheckup: defaultValues?.lastMedicalCheckup || "",
      personalGoals: defaultValues?.personalGoals || "",
      notes: defaultValues?.notes || "",
    });
  }, [defaultValues, reset]);

  const painIntensity = useWatch({ control, name: "painIntensity" });
  const perceivedStress = useWatch({ control, name: "perceivedStress" });
  const smoker = useWatch({ control, name: "smoker" });

  const onSubmit = (data: FormData) => {
    onSave({ patient: data as PatientDto });
    // Reset the form state after successful submission
    reset(data, {
      keepValues: true, // Keep the current values
      keepDirty: false, // Reset the dirty state
    });
  };

  const NumberField = ({
    name,
    label,
    placeholder,
    min,
    max,
  }: {
    name: keyof PatientMedicalData;
    label: string;
    placeholder: string;
    min?: number;
    max?: number;
  }) => (
    <TextField
      type="number"
      label={label}
      fullWidth
      size="small"
      placeholder={placeholder}
      error={!!errors[name]}
      helperText={(errors as any)[name]?.message}
      {...register(name as any, { valueAsNumber: true, min, max })}
    />
  );

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
        {/* Anagrafica */}
        <Typography variant="h6" gutterBottom>
          Dati anagrafici & antropometrici
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="sex"
              control={control}
              defaultValue={null} // stringa vuota o undefined se preferisci
              render={({ field }) => (
                <TextField
                  {...field} // gestisce value/onChange
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
            {NumberField({
              name: "height",
              label: "Altezza (cm)",
              placeholder: "es. 175",
            })}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {NumberField({
              name: "weight",
              label: "Peso (kg)",
              placeholder: "es. 70",
            })}
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
            {NumberField({
              name: "sportFrequency",
              label: "Frequenza sportiva (0‑7)",
              placeholder: "es. 3",
            })}
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
            {NumberField({
              name: "restingHeartRate",
              label: "Frequenza cardiaca a riposo (bpm)",
              placeholder: "es. 60",
            })}
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
          Valutazione del dolore
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Zona del dolore"
              fullWidth
              size="small"
              placeholder="es. Ginocchio destro"
              error={!!errors.painZone}
              helperText={errors.painZone?.message}
              {...register("painZone")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Intensità (0‑10)
            </Typography>
            <Slider
              value={painIntensity ?? 0}
              step={1}
              marks
              min={0}
              max={10}
              onChange={(_, v) =>
                setValue("painIntensity", v as number, { shouldDirty: true })
              }
            />
            {errors.painIntensity && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.painIntensity.message}
              </Alert>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="painFrequency"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Frequenza del dolore"
                  select
                  fullWidth
                  size="small"
                  error={!!errors.painFrequency}
                  helperText={errors.painFrequency?.message}
                >
                  <MenuItem value="COSTANT">Costante</MenuItem>
                  <MenuItem value="INTERMITTENT">Intermittente</MenuItem>
                  <MenuItem value="NIGHT">Notturno</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Caratteristiche del dolore"
              fullWidth
              size="small"
              placeholder="es. Bruciante"
              error={!!errors.painCharacteristics}
              helperText={errors.painCharacteristics?.message}
              {...register("painCharacteristics")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              multiline
              minRows={2}
              label="Fattori che modificano il dolore"
              fullWidth
              size="small"
              placeholder="es. Migliora con il riposo"
              error={!!errors.painModifiers}
              helperText={errors.painModifiers?.message}
              {...register("painModifiers")}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Stile di vita & Fattori psicosociali
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={smoker ?? false}
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
            {NumberField({
              name: "alcoholUnits",
              label: "Unità alcoliche settimanali",
              placeholder: "es. 10",
            })}
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
            {NumberField({
              name: "sleepHours",
              label: "Ore di sonno (media/notte)",
              placeholder: "es. 7",
            })}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Stress percepito (0‑10)
            </Typography>
            <Slider
              value={perceivedStress ?? 0}
              step={1}
              marks
              min={0}
              max={10}
              onChange={(_, v) =>
                setValue("perceivedStress", v as number, {
                  shouldDirty: true,
                })
              }
            />
            {errors.perceivedStress && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.perceivedStress.message}
              </Alert>
            )}
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
            onClick={handleSubmit(onSubmit)}
            sx={{ paddingX: 3, marginTop: { xs: 2, sm: 0 } }}
          >
            Salva
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
