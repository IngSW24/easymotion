import { Box, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";
import MarkdownTextField from "../../../atoms/MarkdownTextField/MarkdownTextField";

export default function BasicInfoSection() {
  const {
    register,
    formState: { errors },
    watch,
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
      <MarkdownTextField
        {...register("description")}
        placeholder="Usa il formato markdown per arricchire la formattazione"
        previewValue={watch("description")}
        label="Descrizione"
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
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
