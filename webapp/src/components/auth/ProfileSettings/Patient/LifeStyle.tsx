import {
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import NumberField from "../../../atoms/TextField/NumberField";
import { Controller } from "react-hook-form";
import { usePatientForm } from "../../../../hooks/usePatientForm";

export interface LifeStyleProps extends ReturnType<typeof usePatientForm> {
  title?: string;
}

export default function LifeStyle(props: LifeStyleProps) {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
  } = props;

  return (
    <>
      {props.title && (
        <Typography variant="h6" gutterBottom>
          Stile di vita e fattori psicosociali
        </Typography>
      )}
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
    </>
  );
}
