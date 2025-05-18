import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";
import MarkdownTextField from "../../../atoms/MarkdownTextField/MarkdownTextField";
import { SupportAgent } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@easymotion/auth-context";

export default function BasicInfoSection() {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<CourseFormData>();

  const { apiClient } = useApiClient();

  const summarize = useMutation({
    mutationFn: (text: string) =>
      apiClient.ai.aiControllerGetSummarization({ text }),
    onSuccess: (response) => setValue("short_description", response.data.text),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        {...register("name")}
        label="Titolo"
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
      />
      <Controller
        name="short_description"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Descrizione breve"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            multiline
            rows={2}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="outlined"
                      onClick={() => summarize.mutate(getValues("description"))}
                      startIcon={<SupportAgent />}
                      disabled={
                        !getValues("description") || summarize.isPending
                      }
                      sx={{ ml: 1 }}
                    >
                      {summarize.isPending ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Genera"
                      )}
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />
      <Controller
        name="description"
        render={({ field, fieldState }) => (
          <MarkdownTextField
            {...field}
            label="Descrizione"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
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
