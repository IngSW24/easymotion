import { Grid2, Typography } from "@mui/material";
import CourseCard from "../CourseCard/CourseCard";
import { useCourses } from "../../../hooks/useCourses";
import { useSnack } from "../../../hooks/useSnack";
import { useDialog } from "../../../hooks/useDialog";

interface CourseListProps {
  canEdit?: boolean;
}

/**
 * Lists all the courses in a grid and allows to navigate to detail or delete them
 * @returns a react component
 */
export default function CourseList({ canEdit = false }: CourseListProps) {
  const courseRepo = useCourses();
  const snack = useSnack();
  const dialog = useDialog();

  const handleCourseDelete = async (id: string) => {
    const confirm = await dialog.showConfirmationDialog({
      title: "Delete course",
      content: "Are you sure you want to delete this course?",
    });

    if (!confirm) return;

    try {
      await courseRepo.remove.mutateAsync(id);
      snack.showSuccess("The course has been deleted successfully");
    } catch (e) {
      if (e instanceof Error || typeof e === "string") snack.showError(e);
    }
  };

  if (courseRepo.get.isLoading) {
    return (
      <Typography align="center" variant="h2" display="block">
        Loading...
      </Typography>
    );
  }

  if (courseRepo.get.isError)
    return (
      <Typography align="center" variant="h2" display="block">
        An error occurred
      </Typography>
    );

  if (courseRepo.get.data?.length === 0) {
    return (
      <Typography align="center" variant="h2" display="block">
        No courses to show
      </Typography>
    );
  }

  return (
    <Grid2
      container
      spacing={6}
      columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
    >
      {courseRepo.get.data?.map((e) => (
        <Grid2 key={e.id} size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
          <CourseCard
            course={e}
            canEdit={canEdit}
            onDelete={handleCourseDelete}
          />
        </Grid2>
      ))}
    </Grid2>
  );
}
