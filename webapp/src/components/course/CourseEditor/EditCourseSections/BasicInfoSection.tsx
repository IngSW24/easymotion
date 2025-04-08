import React, { ChangeEvent } from "react";
import { TextField, Typography, Box, Grid2 } from "@mui/material";
import { Title, Description, Place, InfoOutlined } from "@mui/icons-material";

interface BasicInfoSectionProps {
  title: string;
  shortDescription: string;
  description: string;
  location: string | null | undefined;
  errors: {
    title?: string;
    shortDescription?: string;
    description?: string;
  };
  onFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  shortDescription,
  description,
  location,
  errors,
  onFieldChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
        <InfoOutlined sx={{ mr: 1 }} /> Informazioni di base
      </Typography>
      <Grid2 container spacing={2} sx={{ mt: 1 }}>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Titolo"
            name="title"
            value={title}
            onChange={onFieldChange}
            error={!!errors.title}
            helperText={errors.title}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ display: "flex", mr: 1, color: "text.secondary" }}>
                    <Title />
                  </Box>
                ),
              },
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Descrizione breve"
            name="shortDescription"
            value={shortDescription}
            onChange={onFieldChange}
            error={!!errors.shortDescription}
            helperText={errors.shortDescription}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ display: "flex", mr: 1, color: "text.secondary" }}>
                    <Description />
                  </Box>
                ),
              },
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            label="Descrizione completa"
            name="description"
            value={description}
            onChange={onFieldChange}
            error={!!errors.description}
            helperText={errors.description}
            required
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Luogo"
            name="location"
            value={location || ""}
            onChange={onFieldChange}
            placeholder="Indirizzo o nome della struttura"
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ display: "flex", mr: 1, color: "text.secondary" }}>
                    <Place />
                  </Box>
                ),
              },
            }}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default React.memo(BasicInfoSection);
