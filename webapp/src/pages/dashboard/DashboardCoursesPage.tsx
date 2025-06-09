import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Badge,
  Button,
  Container,
} from "@mui/material";
import { CourseDto } from "@easymotion/openapi";
import DashboardDataGrid from "../../components/dashboard/CoursesDataGrid";
import { Add } from "@mui/icons-material";
import CourseEditModal from "../../components/course/CourseEditor/CourseEditModal";
import { useDialog } from "../../hooks/useDialog";
import { usePhysiotherapistCourses } from "../../hooks/usePhysiotherapistCourses";
import CourseUsersListModal from "../../components/dashboard/CourseUsersListModal";
import { useSearchParams } from "react-router";

export default function DashboardCoursesPage() {
  const [params, setParams] = useSearchParams();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseDto | undefined>(
    undefined
  );
  const [courseUsersOpen, setCourseUsersOpen] = useState(false);
  const [courseUserId, setCourseUserId] = useState<string | undefined>(
    undefined
  );

  const confirm = useDialog();
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

  const activeCourses = useMemo(() => {
    return (
      getAll.data?.pages.flatMap((page) =>
        page.data.filter((course) => course.isPublished)
      ) || []
    );
  }, [getAll.data?.pages]);

  const archivedCourses = useMemo(() => {
    return (
      getAll.data?.pages.flatMap((page) =>
        page.data.filter((course) => !course.isPublished)
      ) || []
    );
  }, [getAll.data?.pages]);

  const currentData = useMemo(
    () => (params.get("tab") === "archived" ? archivedCourses : activeCourses),
    [params, activeCourses, archivedCourses]
  );

  const handleEdit = useCallback(
    (courseId: string) => {
      const course = currentData.find((course) => course.id === courseId);

      if (course) {
        setEditingCourse(course);
        setCreateOpen(true);
      }
    },
    [currentData]
  );

  const handleDelete = async (id: string) => {
    const result = await confirm.showConfirmationDialog({
      title: "Sei sicuro di voler eliminare questo corso?",
      content: "Questa azione è irreversibile.",
    });

    if (result) {
      await remove.mutateAsync(id);
    }
  };

  const handleCourseUsersOpen = (courseId: string) => {
    setCourseUserId(courseId);
    setCourseUsersOpen(true);
  };

  const handleCourseUserClose = () => {
    setCourseUsersOpen(false);
    setCourseUserId(undefined);
  };

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: "active" | "archived"
  ) => {
    setParams((p) => ({ ...p, tab: newValue }));
  };

  const activeCoursesTotal = activeCourses.length;
  const archivedCoursesTotal = archivedCourses.length;

  return (
    <Box sx={{ width: "100%", px: 2 }}>
      {/* Header con titolo e pulsante crea */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Container maxWidth="xl" sx={{ ml: -3 }}>
          <Typography
            variant="h3"
            component="h3"
            align="left"
            fontWeight="bold"
            sx={{ paddingTop: 3, textAlign: "left" }}
          >
            Gestione corsi
          </Typography>
          <Typography
            variant="h5"
            component="h5"
            align="left"
            sx={{ paddingTop: 1, paddingBottom: 3, textAlign: "left" }}
          >
            Gestisci i tuoi corsi attivi ed archiviati
          </Typography>
        </Container>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ minWidth: "160px" }}
          size="medium"
          onClick={handleOpen}
        >
          Nuovo corso
        </Button>
      </Box>

      {/* Tabs con contatori */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={params.get("tab") || "active"}
          onChange={handleTabChange}
          aria-label="corsi tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            value={"active"}
            defaultChecked
            label={
              <Badge badgeContent={activeCoursesTotal} color="primary">
                <Typography sx={{ mr: 2 }}>Corsi Attivi</Typography>
              </Badge>
            }
            id="tab-active"
            aria-controls="tabpanel-active"
          />
          <Tab
            value={"archived"}
            label={
              <Badge badgeContent={archivedCoursesTotal} color="primary">
                <Typography sx={{ mr: 2 }}>Corsi Archiviati</Typography>
              </Badge>
            }
            id="tab-archived"
            aria-controls="tabpanel-archived"
          />
        </Tabs>
      </Box>

      {/* Contenuto del tab corrente */}
      <Box sx={{ mt: 2 }}>
        {getAll.isError && (
          <Typography color="error">
            Si è verificato un errore nel caricamento dei corsi.
          </Typography>
        )}

        {getAll.isLoading && currentData.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DashboardDataGrid
            courses={currentData}
            pageNumer={10}
            nextPageAction={() => getAll.fetchNextPage()}
            hasNextPage={!!getAll.hasNextPage}
            isFetchingNextPage={getAll.isFetchingNextPage}
            onAction={true}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCourseUsers={handleCourseUsersOpen}
          />
        )}
      </Box>

      {/* Modali */}
      <CourseEditModal
        open={createOpen}
        onClose={handleClose}
        course={editingCourse}
      />
      <CourseUsersListModal
        open={courseUsersOpen}
        onClose={handleCourseUserClose}
        courseId={courseUserId}
      />
    </Box>
  );
}
