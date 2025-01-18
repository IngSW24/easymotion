import { Box, Grid2, Typography } from "@mui/material";
import CourseCard from "../CourseCard/CourseCard";
import { useCourses } from "../../../hooks/useCourses";
import { useSnack } from "../../../hooks/useSnack";
import { useDialog } from "../../../hooks/useDialog";
import FilterBlock from "../FilterBlock/FilterBlock";
import { CourseFilters } from "../FilterBlock/types";
import { useCallback, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

interface CourseListProps {
  canEdit?: boolean;
}

/**
 * Lists all the courses in a grid and allows to navigate to detail or delete them
 * @returns a react component
 */
export default function CourseList(props: CourseListProps) {
  const { canEdit = false } = props;

  const [filters, setFilters] = useState<CourseFilters | undefined>(undefined);

  const courseRepo = useCourses({ filters });

  const snack = useSnack();
  const dialog = useDialog();

  const handleCourseDelete = useCallback(
    async (id: string) => {
      const confirm = await dialog.showConfirmationDialog({
        title: "Delete course",
        content: "Sei sicuro di voler eliminare il corso?",
      });

      if (!confirm) return;

      try {
        await courseRepo.remove.mutateAsync(id);
        snack.showSuccess("Il corso è stato eliminato con successo");
      } catch (e) {
        if (e instanceof Error || typeof e === "string") snack.showError(e);
      }
    },
    [courseRepo.remove, dialog, snack]
  );

  if (courseRepo.get.isError)
    return (
      <Typography align="center" variant="h2" display="block">
        Errore
      </Typography>
    );

  return (
    <>
      <FilterBlock
        filters={filters}
        onChange={(filters: CourseFilters) => setFilters(filters)}
      />

      <Grid2
        container
        spacing={6}
        columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
      >
        {courseRepo.get.isError ? (
          <Typography align="center" variant="h2" display="block">
            Si è verificato un errore
          </Typography>
        ) : (
          <>
            {courseRepo.get.isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                {courseRepo.get.data?.length === 0 ? (
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      align="center"
                      variant="h6"
                      display="block"
                      textAlign="center"
                      fontWeight={400}
                    >
                      {
                        "Al momento non è disponibile alcun corso che soddisfi i criteri di ricerca"
                      }{" "}
                      &#x1F622;
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {courseRepo.get.data?.map((e) => (
                      <Grid2
                        key={e.id}
                        size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                      >
                        <CourseCard
                          course={e}
                          canEdit={canEdit}
                          onDelete={handleCourseDelete}
                        />
                      </Grid2>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Grid2>
    </>
  );
}
