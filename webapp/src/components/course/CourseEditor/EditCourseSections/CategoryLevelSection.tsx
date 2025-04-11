import React, { ChangeEvent, useState } from "react";
import {
  Grid2,
  TextField,
  Box,
  Typography,
  MenuItem,
  Divider,
} from "@mui/material";
import { Category, School, FitnessCenter, Person } from "@mui/icons-material";
import DialogWindow from "../../../atoms/Dialog/DialogWindow";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

enum CategoryOperation {
  CREATE = "create",
  REMOVE = "remove",
}

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
  onRemoval: (categoryId: string) => Promise<string | null>;
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
  onRemoval,
  categories,
  isCategoriesLoading,
  levelMenuItems,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryToRemove, setCategoryToRemove] = useState("");

  const handleAddDialogOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAddDialogOpen(true);
  };

  const handleRemoveDialogOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRemoveDialogOpen(true);
  };

  const handleCategoryOperation = async (
    operation: CategoryOperation,
    value: string
  ): Promise<void> => {
    try {
      let categoryId: string | null = null;

      if (value != null) {
        if (operation === CategoryOperation.CREATE) {
          categoryId = await onCreation(value);
          setNewCategoryName("");
          setIsAddDialogOpen(false);
        } else if (operation === CategoryOperation.REMOVE) {
          await onRemoval(value);
          setCategoryToRemove("");
          setIsRemoveDialogOpen(false);
        }

        updateCategorySelection(categoryId);
      }
    } catch (error) {
      console.error(`Errore durante l'operazione ${operation}:`, error);
    }
  };

  const updateCategorySelection = (categoryId: string | null): void => {
    if (categoryId !== null) {
      const syntheticEvent = {
        target: {
          name: "categoryId",
          value: categoryId,
        },
      } as unknown as ChangeEvent<HTMLInputElement>;

      onFieldChange(syntheticEvent);
    } else if (categories.length > 0) {
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

  const handleCategoryCreation = () => {
    if (newCategoryName) {
      handleCategoryOperation(CategoryOperation.CREATE, newCategoryName);
    }
  };

  const handleRemoveCategory = () => {
    if (categoryToRemove) {
      handleCategoryOperation(CategoryOperation.REMOVE, categoryToRemove);
    }
  };

  const onCloseCreateDialog = () => {
    setIsAddDialogOpen(false);
    updateCategorySelection(null);
  };

  const onCloseRemoveDialog = () => {
    setIsRemoveDialogOpen(false);
    updateCategorySelection(null);
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
            {categories.length > 0 && <Divider />}
            <MenuItem
              key="add-new-category"
              value="new"
              onClick={handleAddDialogOpen}
              sx={{ flex: 1, justifyContent: "center" }}
            >
              <Typography
                variant="body2"
                color="primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <AddIcon fontSize="small" sx={{ mr: 0.5 }} />
                Aggiungi nuova categoria
              </Typography>
            </MenuItem>
            <Divider orientation="vertical" flexItem />

            <MenuItem
              key="remove-category"
              value="remove"
              onClick={handleRemoveDialogOpen}
              sx={{ flex: 1, justifyContent: "center" }}
            >
              <Typography
                variant="body2"
                color="error"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} />
                Rimuovi categoria
              </Typography>
            </MenuItem>
            {/**<Box sx={{ display: "flex", width: "100%" }}></Box>*/}
          </TextField>
        </Grid2>
        <DialogWindow
          open={isAddDialogOpen}
          onClose={onCloseCreateDialog}
          title="Aggiungi nuova categoria"
          contentText="Inserisci il nome della nuova categoria"
          submitText="Aggiungi"
          onSubmit={handleCategoryCreation}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Nome categoria"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogWindow>

        <DialogWindow
          open={isRemoveDialogOpen}
          onClose={onCloseRemoveDialog}
          title="Rimuovi categoria"
          submitText="Rimuovi"
          submitColor="error"
          onSubmit={handleRemoveCategory}
        >
          <TextField
            select
            autoFocus
            margin="dense"
            label="Seleziona categoria da rimuovere"
            fullWidth
            value={categoryToRemove}
            onChange={(e) => setCategoryToRemove(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogWindow>
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
