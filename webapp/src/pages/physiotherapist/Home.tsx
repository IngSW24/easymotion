import { Box, Button, Grid2, Typography } from "@mui/material";
import OverviewSection from "../../components/dashboard/OverviewSection";
import DashboardDataGrid from "../../components/dashboard/CoursesDataGrid";
import { DateCalendar } from "@mui/x-date-pickers";
import { useProfile } from "../../hooks/useProfile";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { Add, FitnessCenter } from "@mui/icons-material";
import CourseEditModal from "../../components/course/CourseEditor/CourseEditModal";
import { useDialog } from "../../hooks/useDialog";
import { usePhysiotherapistCourses } from "../../hooks/usePhysiotherapistCourses";
import { CourseDto } from "@easymotion/openapi";

enum CurrentState {
  "LOADING",
  "ERROR",
  "READY",
}

export default function DashboardHome() {
  const [currentPageState, setCurrentPageState] = useState(
    CurrentState.LOADING
  );

  const confirm = useDialog();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseDto | undefined>(
    undefined
  );

  const { get: getProfile } = useProfile();
  const { getAll, remove } = usePhysiotherapistCourses({
    perPage: 10,
  });

  const handleOpen = useCallback(() => {
    setEditingCourse(undefined);
    setCreateOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setCreateOpen(false);
    setEditingCourse(undefined);
  }, []);

  const handleEdit = useCallback(
    (courseId: string) => {
      const course = getAll.data?.pages
        .flatMap((page) => page.data)
        .find((course) => course.id === courseId);
      if (course) {
        setEditingCourse(course);
        setCreateOpen(true);
      }
    },
    [getAll.data?.pages]
  );

  useEffect(() => {
    if (getProfile.isError || getAll.isError) {
      setCurrentPageState(CurrentState.ERROR);
    } else if (getProfile.isSuccess && getAll.isSuccess) {
      setCurrentPageState(CurrentState.READY);
    } else {
      setCurrentPageState(CurrentState.LOADING);
    }
  }, [getProfile, getAll]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, px: 2 }}>
      {currentPageState === CurrentState.ERROR && (
        <Typography>Error ....</Typography>
      )}
      {currentPageState === CurrentState.LOADING && <LoadingSpinner />}
      {currentPageState === CurrentState.READY && (
        <Grid2 container spacing={3}>
          {/* Left column - Overview and DataGrid */}
          <Grid2 size={{ xs: 12, lg: 9 }}>
            {/* Overview section */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Overview
            </Typography>
            <OverviewSection
              cards={[
                {
                  title: "Corsi totali",
                  value: getAll.data?.pages[0]?.meta.totalItems || 0,
                  icon: <FitnessCenter />,
                },
              ]}
            />

            {/* Courses section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                pt: 4,
              }}
            >
              <Typography component="h2" variant="h6">
                I miei corsi
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                size="small"
                onClick={handleOpen}
              >
                Crea corso
              </Button>
              <CourseEditModal
                open={createOpen}
                onClose={handleClose}
                course={editingCourse}
              />
            </Box>

            <Box sx={{ width: "100%", mb: { xs: 3, lg: 0 } }}>
              <DashboardDataGrid
                courses={getAll.data?.pages.flatMap((page) => page.data) || []}
                nextPageAction={() => getAll.fetchNextPage()}
                hasNextPage={!!getAll.hasNextPage}
                isFetchingNextPage={getAll.isFetchingNextPage}
                onDelete={async (id) => {
                  const result = await confirm.showConfirmationDialog({
                    title: "Sei sicuro di voler eliminare questo corso?",
                    content: "Questa azione è irreversibile.",
                  });

                  if (result) {
                    await remove.mutateAsync(id);
                  }
                }}
                onEdit={handleEdit}
              />
            </Box>
          </Grid2>

          {/* Right column - Calendar */}
          <Grid2 size={{ xs: 12, lg: 3 }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", lg: "flex-start" },
                mt: { xs: 2, lg: 0 },
              }}
            >
              <DateCalendar
                sx={{
                  bgcolor: "background.paper",
                  zIndex: 0,
                }}
              />
            </Box>
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
}
