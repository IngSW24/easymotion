import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Slider,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export interface PatientSettingsProps {
  defaultValues?: Partial<PatientMedicalData>;
  onSave?: (data: PatientMedicalData) => void;
}

export interface PatientMedicalData {
  // 1. Dati anagrafici & antropometrici
  sex: string; // "MALE" | "FEMALE" | "OTHER"
  profession: string;
  sport: string;
  height: number;
  weight: number;

  // 2. Segni vitali
  bloodPressure?: number;
  restingHeartRate?: number;

  // 3. Storia medica
  medications?: string;
  allergies?: string;
  otherPatologies?: string[];

  // 4. Valutazione del dolore
  painLocation?: string;
  painIntensity?: number;
  painFrequency?: string; // "costante" | "intermittente" | "notturna"
  painCharacteristics?: string;
  painModifiers?: string;

  // 5. Funzione & disabilità
  mobilityLevel?: number;

  // 6. Stile di vita & fattori psicosociali
  smoking?: boolean;
  alcoholUnits?: number;
  sleepHours?: number;
  stressLevel?: number;

  // 7. Obiettivi
  personalGoals?: string;
}

const frequencyOptions: PatientMedicalData["painFrequency"][] = [
  "costante",
  "intermittente",
  "notturna",
];

const schema: z.ZodType<PatientMedicalData> = z.object({
  /** 1. Dati anagrafici & antropometrici */
  profession: z.string().min(2, "Inserisci la professione"),
  sport: z.string().min(2, "Inserisci lo sport praticato"),
  height: z
    .number({ invalid_type_error: "Inserisci altezza" })
    .min(50)
    .max(300),
  weight: z.number({ invalid_type_error: "Inserisci peso" }).min(20).max(500),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]),

  /** 2. Segni vitali */
  bloodPressure: z.number().positive().optional(),
  restingHeartRate: z.number().positive().optional(),

  /** 3. Storia medica */
  medications: z.string().optional(),
  allergies: z.string().optional(),
  otherPatologies: z.array(z.string()).optional(),

  /** 4. Dolore */
  painLocation: z.string().optional(),
  painIntensity: z.number().min(0).max(10).optional(),
  painFrequency: z.enum(["costante", "intermittente", "notturna"]).optional(),
  painCharacteristics: z.string().optional(),
  painModifiers: z.string().optional(),

  /** 5. Funzione */
  mobilityLevel: z.number().min(0).max(4).optional(),

  /** 6. Stile di vita */
  smoking: z.boolean().optional(),
  alcoholUnits: z.number().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  stressLevel: z.number().min(0).max(10).optional(),

  /** 7. Obiettivi */
  personalGoals: z.string().optional(),
});

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
  } = useForm<PatientMedicalData>({
    resolver: zodResolver(schema),
    defaultValues: {
      profession: "",
      sport: "",
      smoking: false,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset({ ...defaultValues });
  }, [defaultValues, reset]);

  const painIntensity = useWatch({ control, name: "painIntensity" });
  const stressLevel = useWatch({ control, name: "stressLevel" });
  const smoking = useWatch({ control, name: "smoking" });

  const submit = (data: PatientMedicalData) => onSave?.(data);

  return (
    <Card
      sx={{ width: "100%", m: "auto", boxShadow: 3, borderRadius: 3, p: 3 }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Person />
          <Typography variant="h5" fontWeight="bold">
            Dati Sanitari
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(submit)} noValidate>
          <Typography variant="h6" gutterBottom>
            Dati anagrafici & antropometrici
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Professione *"
                fullWidth
                size="small"
                placeholder="Professione"
                error={!!errors.profession}
                helperText={errors.profession?.message}
                {...register("profession")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Sport praticato *"
                fullWidth
                size="small"
                placeholder="Sport"
                error={!!errors.sport}
                helperText={errors.sport?.message}
                {...register("sport")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Altezza (cm) *"
                fullWidth
                size="small"
                placeholder="es. 175"
                error={!!errors.height}
                helperText={errors.height?.message}
                {...register("height", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Peso (kg) *"
                fullWidth
                size="small"
                placeholder="es. 70"
                error={!!errors.weight}
                helperText={errors.weight?.message}
                {...register("weight", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Sesso *
              </Typography>
              <TextField
                fullWidth
                select
                size="small"
                error={!!errors.sex}
                helperText={errors.sex?.message}
                {...register("sex")}
              >
                <MenuItem value="MALE">Maschio</MenuItem>
                <MenuItem value="FEMALE">Femmina</MenuItem>
                <MenuItem value="OTHER">Altro</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Segni vitali
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Pressione arteriosa (mmHg)"
                fullWidth
                size="small"
                placeholder="es. 120"
                error={!!errors.bloodPressure}
                helperText={errors.bloodPressure?.message}
                {...register("bloodPressure", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Frequenza cardiaca a riposo (bpm)"
                fullWidth
                size="small"
                placeholder="es. 60"
                error={!!errors.restingHeartRate}
                helperText={errors.restingHeartRate?.message}
                {...register("restingHeartRate", { valueAsNumber: true })}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Storia medica
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                multiline
                minRows={2}
                label="Farmaci in uso"
                fullWidth
                size="small"
                placeholder="es. Ibuprofene 400 mg x2/die"
                {...register("medications")}
                error={!!errors.medications}
                helperText={errors.medications?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                multiline
                minRows={2}
                label="Allergie"
                fullWidth
                size="small"
                placeholder="es. Penicillina, lattice…"
                {...register("allergies")}
                error={!!errors.allergies}
                helperText={errors.allergies?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                multiline
                minRows={2}
                label="Patologie concomitanti"
                fullWidth
                size="small"
                placeholder="es. Penicillina, lattice…"
                {...register("otherPatologies")}
                error={!!errors.allergies}
                helperText={errors.allergies?.message}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Valutazione del dolore
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Localizzazione"
                fullWidth
                size="small"
                placeholder="es. Ginocchio destro"
                {...register("painLocation")}
                error={!!errors.painLocation}
                helperText={errors.painLocation?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Intensità (0-10)
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
                <Alert severity="error">{errors.painIntensity.message}</Alert>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Frequenza"
                fullWidth
                size="small"
                placeholder="Frequenza"
                {...register("painFrequency")}
                error={!!errors.painFrequency}
                helperText={errors.painFrequency?.message}
              >
                {frequencyOptions.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Caratteristiche"
                fullWidth
                size="small"
                placeholder="es. Bruciante, trafittivo…"
                {...register("painCharacteristics")}
                error={!!errors.painCharacteristics}
                helperText={errors.painCharacteristics?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                multiline
                minRows={2}
                label="Fattori che peggiorano / alleviano"
                fullWidth
                size="small"
                placeholder="es. Peggiora in estensione…"
                {...register("painModifiers")}
                error={!!errors.painModifiers}
                helperText={errors.painModifiers?.message}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Funzione & disabilità
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Livello di mobilità (0-4)
              </Typography>
              <Slider
                value={watch("mobilityLevel") ?? 0}
                step={1}
                marks
                min={0}
                max={4}
                onChange={(_, v) =>
                  setValue("mobilityLevel", v as number, { shouldDirty: true })
                }
              />
              {errors.mobilityLevel && (
                <Alert severity="error">{errors.mobilityLevel.message}</Alert>
              )}
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Stile di vita & fattori psicosociali
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Alcol (unità settimanali)"
                fullWidth
                size="small"
                placeholder="es. 10"
                {...register("alcoholUnits", { valueAsNumber: true })}
                error={!!errors.alcoholUnits}
                helperText={errors.alcoholUnits?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Ore di sonno (media/notte)"
                fullWidth
                size="small"
                placeholder="es. 7"
                {...register("sleepHours", { valueAsNumber: true })}
                error={!!errors.sleepHours}
                helperText={errors.sleepHours?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Stress percepito (0-10)
              </Typography>
              <Slider
                value={stressLevel ?? 0}
                step={1}
                marks
                min={0}
                max={10}
                onChange={(_, v) =>
                  setValue("stressLevel", v as number, { shouldDirty: true })
                }
              />
              {errors.stressLevel && (
                <Alert severity="error">{errors.stressLevel.message}</Alert>
              )}
            </Grid>
            <Grid>
              <FormControlLabel
                control={
                  <Switch
                    checked={smoking || false}
                    onChange={(e) =>
                      setValue("smoking", e.target.checked, {
                        shouldDirty: true,
                      })
                    }
                  />
                }
                label={smoking ? "Fumatore" : "Non fumatore"}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Obiettivi personali
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                multiline
                minRows={2}
                label="Obiettivi"
                fullWidth
                size="small"
                placeholder="es. Tornare a correre 10 km…"
                {...register("personalGoals")}
                error={!!errors.personalGoals}
                helperText={errors.personalGoals?.message}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty}
              sx={{ px: 3 }}
            >
              Salva
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
