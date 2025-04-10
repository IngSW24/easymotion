import { Box, TextField, MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { CourseFormData } from "../schema";
import { courseLevels } from "../../../../data/course-levels";
import { useCourseCategory } from "../../../../hooks/useCourseCategories";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

export default function CategoryLevelSection() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<CourseFormData>();

  const { getAll: categories } = useCourseCategory();
  const currentCategoryId = watch("category_id");
  const currentLevel = watch("level");

  if (categories.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        {...register("category_id")}
        select
        label="Categoria"
        error={!!errors.category_id}
        helperText={errors.category_id?.message}
        fullWidth
        value={currentCategoryId}
      >
        {categories.data?.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>

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
