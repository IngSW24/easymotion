import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { usePatientForm } from "../../../../hooks/usePatientForm";
import { Controller } from "react-hook-form";
import NumberField from "../../../atoms/TextField/NumberField";

export interface AnthropometricDataProps
  extends ReturnType<typeof usePatientForm> {
  title?: string;
}

// Dati anagrafici e antropometrici

export default function AnthropometricData(props: AnthropometricDataProps) {
  const {
    register,
    formState: { errors },
    control,
  } = props;

  return (
    <>
      {props.title && (
        <Typography variant="h6" gutterBottom>
          {props.title}
        </Typography>
      )}
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
    </>
  );
}
