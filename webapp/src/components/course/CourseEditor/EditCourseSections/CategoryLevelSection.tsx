import React, { ChangeEvent, useState } from "react";
import { Grid2, TextField, Box, Typography, MenuItem } from "@mui/material";
import { Category, School, FitnessCenter, Person } from "@mui/icons-material";
import DialogWindow from "../../../atoms/Dialog/DialogWindow";

interface CategoryOption {
  id: string;
  name: string;
}

interface CategoryLevelSectionProps {
  categoryId: string | undefined;
  level: string;
  instructorName: string;
  onFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCreation: (categoryName: string) => Promise<string | null>;
  categories: CategoryOption[];
  isCategoriesLoading: boolean;
  levelMenuItems: React.ReactNode[];
}

const CategoryLevelSection: React.FC<CategoryLevelSectionProps> = ({
  categoryId,
  level,
  instructorName,
  onFieldChange,
  onCreation,
  categories,
  isCategoriesLoading,
  levelMenuItems,
}) => {
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [openNewCategoryDialog, setOpenNewCategoryDialog] =
    useState<boolean>(false);

  const handleMenuItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenNewCategoryDialog(true);
  };

  const handleCategoryCreation = async () => {
    if (newCategoryName) {
      const newCategoryId = await onCreation(newCategoryName);

      setNewCategoryName("");
      setOpenNewCategoryDialog(false);
      handleCategoryNameSelection(newCategoryId);
    }
  };

  const handleCategoryNameSelection = (category: string | null) => {
    if (category != null) {
      const syntheticEvent = {
        target: {
          name: "categoryId",
          value: category,
        },
      } as unknown as ChangeEvent<HTMLInputElement>;

      onFieldChange(syntheticEvent);
    } else {
      onCloseDialog();
    }
  };

  const onCloseDialog = () => {
    setOpenNewCategoryDialog(false);

    if (categories.length > 0) {
      const firstCategoryId = categories[0].id;
      const syntheticEvent = {
        target: {
          name: "categoryId",
          value: firstCategoryId,
        },
      } as unknown as ChangeEvent<HTMLInputElement>;

      onFieldChange(syntheticEvent);
    }
  };

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
            <MenuItem
              key="add-new-category"
              value="new"
              onClick={handleMenuItemClick}
            >
              <Typography variant="body2" color="primary">
                Aggiungi nuova categoria
              </Typography>
            </MenuItem>
          </TextField>
        </Grid2>

        <DialogWindow
          open={openNewCategoryDialog}
          onClose={onCloseDialog}
          categoryName={newCategoryName}
          onCategoryNameChange={setNewCategoryName}
          onCreateCategory={handleCategoryCreation}
        />

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
