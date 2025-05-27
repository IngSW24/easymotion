import { Grid, TextField, Typography } from "@mui/material";
import { usePatientForm } from "../../../../hooks/usePatientForm";

export interface MedicalHistoryProps extends ReturnType<typeof usePatientForm> {
  title?: string;
}

export default function MedicalHistory(props: MedicalHistoryProps) {
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
    </>
  );
}
