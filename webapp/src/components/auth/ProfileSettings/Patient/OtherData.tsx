import { Grid, TextField, Typography } from "@mui/material";
import { usePatientForm } from "../../../../hooks/usePatientForm";

export interface OtherDataProps extends ReturnType<typeof usePatientForm> {
  title?: string;
}

export default function OtherData(props: OtherDataProps) {
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
            minRows={5}
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
            minRows={5}
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
    </>
  );
}
