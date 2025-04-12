import { useCallback } from "react";
import { TextField, Box, MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { CourseFormData } from "../schema";
import { courseLevels } from "../../../../data/course-levels";
import { useCourseCategory } from "../../../../hooks/useCourseCategories";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { useSnack } from "../../../../hooks/useSnack";
import CrudSelector from "../../../atoms/Select/CrudSelector";

export default function CategoryLevelSection() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CourseFormData>();

  const {
    getAll: categories,
    remove: removeCategory,
    create: createCategory,
  } = useCourseCategory();

  const currentCategoryId = watch("category_id");
  const currentLevel = watch("level");
  const snack = useSnack();

  const handleRemoveCategory = useCallback(
    async (id: string) => {
      if (!id) {
        snack.showError("Seleziona una categoria da rimuovere.");
        return;
      }

      try {
        await removeCategory.mutateAsync(id);
        if (id === currentCategoryId) {
          setValue("category_id", categories.data?.[0]?.id || "");
        }
      } catch (e) {
        snack.showError(e instanceof Error ? e.message : "An error occurred");
      }
    },
    [categories.data, currentCategoryId, removeCategory, setValue, snack]
  );

  const handleCategoryCreation = useCallback(
    async (name: string) => {
      try {
        const newCategory = await createCategory.mutateAsync({ name });
        setValue("category_id", newCategory.id);
      } catch (error) {
        snack.showError(error);
      }
    },
    [createCategory, setValue, snack]
  );

  if (categories.isLoading || !categories.data) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <CrudSelector
        label="Categoria"
        items={categories.data || []}
        value={categories.data.find((c) => c.id === currentCategoryId) || null}
        onChange={(newValue) => setValue("category_id", newValue?.id ?? "")}
        onAdd={handleCategoryCreation}
        error={!!errors.category_id}
        helperText={errors.category_id?.message}
        onRemove={handleRemoveCategory}
        disableClear
      />

      <TextField
        {...register("level")}
        select
        label="Livello"
        error={!!errors.level}
        value={currentLevel}
        helperText={errors.level?.message}
        fullWidth
      >
        {courseLevels.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        {...register("instructors.0")}
        label="Nome Istruttore"
        error={!!errors.instructors}
        helperText={errors.instructors?.message}
        fullWidth
      />
    </Box>
  );
}
