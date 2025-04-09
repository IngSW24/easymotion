import React, { ChangeEvent } from "react";
import { Grid2, TextField, Box, Typography, MenuItem } from "@mui/material";
import { Category, School, FitnessCenter, Person } from "@mui/icons-material";

interface CategoryOption {
  id: string;
  name: string;
}

interface CategoryLevelSectionProps {
  categoryId: string | undefined;
  level: string;
  instructorName: string;
  onFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  categories: CategoryOption[];
  isCategoriesLoading: boolean;
  levelMenuItems: React.ReactNode[];
}

const CategoryLevelSection: React.FC<CategoryLevelSectionProps> = ({
  categoryId,
  level,
  instructorName,
  onFieldChange,
  categories,
  isCategoriesLoading,
  levelMenuItems,
}) => {
  if (isCategoriesLoading) {
    return (
      <Box>
        <Typography variant="h6">Caricamento...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <Category sx={{ mr: 1 }} /> Categoria e Livello
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            select
            fullWidth
            label="Categoria"
            name="categoryId"
            value={categoryId || ""}
            onChange={onFieldChange}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ display: "flex", mr: 1, color: "text.secondary" }}>
                    <School />
                  </Box>
                ),
              },
            }}
            disabled={isCategoriesLoading}
          >
            {categories.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            select
            fullWidth
            label="Livello"
            name="level"
            value={level}
            onChange={onFieldChange}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ display: "flex", mr: 1, color: "text.secondary" }}>
                    <FitnessCenter />
                  </Box>
                ),
              },
            }}
          >
            {levelMenuItems}
          </TextField>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Nome istruttore"
            name="instructorName"
            value={instructorName}
            onChange={onFieldChange}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ display: "flex", mr: 1, color: "text.secondary" }}>
                    <Person />
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

export default React.memo(CategoryLevelSection);
