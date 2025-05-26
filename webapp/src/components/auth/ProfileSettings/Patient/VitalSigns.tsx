import { Grid, TextField, Typography } from "@mui/material";
import NumberField from "../../../atoms/TextField/NumberField";
import { usePatientForm } from "../../../../hooks/usePatientForm";

export interface VitalSignProps extends ReturnType<typeof usePatientForm> {
  title?: string;
}

export default function VitalSigns(props: VitalSignProps) {
  const {
    formState: { errors },
    register,
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
    </>
  );
}
