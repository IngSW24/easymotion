import React, { useState, useEffect, useCallback, useMemo } from "react";
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

// Enum per identificare i tipi di tab
enum TabType {
  ACTIVE = "active",
  ARCHIVED = "archived",
}

// Enum per lo stato della pagina
enum CurrentState {
  "LOADING",
  "ERROR",
  "READY",
}

export default function CoursesDashboard() {
  // Stato per il tab correntemente attivo
  const [activeTab, setActiveTab] = useState<TabType>(TabType.ACTIVE);
  const [currentPageState, setCurrentPageState] = useState(
    CurrentState.LOADING
  );

  // Stato per modali e editing
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

  const handleEdit = useCallback(
    (courseId: string) => {
      const courses =
        activeTab === TabType.ACTIVE ? activeCourses : archivedCourses;
      const course = courses.find((course) => course.id === courseId);

      if (course) {
        setEditingCourse(course);
        setCreateOpen(true);
      }
    },
    [activeTab, activeCourses, archivedCourses]
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabType) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (getAll.isError) {
      setCurrentPageState(CurrentState.ERROR);
    } else if (getAll.isSuccess) {
      setCurrentPageState(CurrentState.READY);
    } else {
      setCurrentPageState(CurrentState.LOADING);
    }
  }, [getAll.isError, getAll.isSuccess]);

  const currentData =
    activeTab === TabType.ACTIVE ? activeCourses : archivedCourses;

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
          value={activeTab}
          onChange={handleTabChange}
          aria-label="corsi tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            value={TabType.ACTIVE}
            label={
              <Badge badgeContent={activeCoursesTotal} color="primary">
                <Typography sx={{ mr: 2 }}>Corsi Attivi</Typography>
              </Badge>
            }
            id="tab-active"
            aria-controls="tabpanel-active"
          />
          <Tab
            value={TabType.ARCHIVED}
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
        {currentPageState === CurrentState.ERROR && (
          <Typography color="error">
            Si è verificato un errore nel caricamento dei corsi.
          </Typography>
        )}

        {currentPageState === CurrentState.LOADING &&
        currentData.length === 0 ? (
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
