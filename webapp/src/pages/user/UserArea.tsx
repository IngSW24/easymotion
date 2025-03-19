import { Box, Container, Grid2, Typography } from "@mui/material";
import CourseCard from "../../components/course/CourseCard/CourseCard";
import { useCallback, useState } from "react";
import { CourseFilters } from "../../components/course/FilterBlock/types";
import { useCourses } from "../../hooks/useCourses";
import { useSnack } from "../../hooks/useSnack";
import { useDialog } from "../../hooks/useDialog";
import FilterBlock from "../../components/course/FilterBlock/FilterBlock";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import UserHeader from "../../components/Layout/headers/UserHeaders";

export default function UserArea() {
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

  return (
    <>
      <UserHeader></UserHeader>
      <Container maxWidth="xl" sx={{ p: 5 }}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          align="center"
          fontWeight="bold"
          sx={{ marginBottom: 4, marginTop: 10 }}
        >
          I miei corsi
        </Typography>

        <FilterBlock
          filters={filters}
          onChange={(filters: CourseFilters) => setFilters(filters)}
        />

        <Grid2
          container
          rowSpacing={6}
          columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
        >
          {courseRepo.get.isLoading ? (
            <LoadingSpinner />
          ) : courseRepo.get.data?.length === 0 ? (
            <Box sx={{ width: "100%" }}>
              <Typography
                align="center"
                variant="h6"
                display="block"
                textAlign="center"
                fontWeight={400}
              >
                {"Al momento non sei iscritto a nessun corso"} &#x1F622;
              </Typography>
            </Box>
          ) : (
            courseRepo.get.data?.map((e) => (
              <Grid2 key={e.id} size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
                <CourseCard course={e} onDelete={handleCourseDelete} />
              </Grid2>
            ))
          )}
        </Grid2>
      </Container>
    </>
  );
}
