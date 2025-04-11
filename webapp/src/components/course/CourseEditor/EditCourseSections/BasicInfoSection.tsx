import { Box, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";

export default function BasicInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CourseFormData>();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        {...register("name")}
        label="Titolo"
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
      />
      <TextField
        {...register("short_description")}
        label="Descrizione breve"
        error={!!errors.short_description}
        helperText={errors.short_description?.message}
        fullWidth
        multiline
        rows={2}
      />
      <TextField
        {...register("description")}
        label="Descrizione"
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
        rows={4}
      />
      <TextField
        {...register("location")}
        label="Località"
        error={!!errors.location}
        helperText={errors.location?.message}
        fullWidth
      />
    </Box>
  );
}
