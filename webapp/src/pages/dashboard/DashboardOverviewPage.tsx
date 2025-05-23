import { Box, Container, Paper, Typography } from "@mui/material";
import OverviewSection from "../../components/dashboard/OverviewSection";
import { DateCalendar } from "@mui/x-date-pickers";
import { useProfile } from "../../hooks/useProfile";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FitnessCenter } from "@mui/icons-material";
import { useDialog } from "../../hooks/useDialog";
import { usePhysiotherapistCourses } from "../../hooks/usePhysiotherapistCourses";
import DashboardDataGrid from "../../components/dashboard/CoursesDataGrid";

enum PageState {
  "LOADING",
  "ERROR",
  "READY",
}

export default function DashboardOverviewPage() {
  const [pageState, setPageState] = useState(PageState.LOADING);

  const confirm = useDialog();
  const { get: getProfile } = useProfile();
  const { getAll, remove } = usePhysiotherapistCourses({
    perPage: 10,
  });

  // Handle course deletion
  const handleDelete = async (id: string) => {
    const result = await confirm.showConfirmationDialog({
      title: "Sei sicuro di voler eliminare questo corso?",
      content: "Questa azione è irreversibile.",
    });

    if (result) {
      await remove.mutateAsync(id);
    }
  };

  // Handle course users view
  const handleCourseUsersOpen = (courseId: string) => {
    // Implement if needed in the future
    console.info("Course users view requested for:", courseId);
  };

  // Update page state based on API calls
  useEffect(() => {
    if (getProfile.isError || getAll.isError) {
      setPageState(PageState.ERROR);
    } else if (getProfile.isSuccess && getAll.isSuccess) {
      setPageState(PageState.READY);
    } else {
      setPageState(PageState.LOADING);
    }
  }, [
    getProfile.isError,
    getProfile.isSuccess,
    getAll.isError,
    getAll.isSuccess,
  ]);

  // Calculate counts for overview
  const activeCourses =
    getAll.data?.pages
      .flatMap((page) => page.data)
      .filter((course) => course.isPublished) || [];

  const archivedCourses =
    getAll.data?.pages
      .flatMap((page) => page.data)
      .filter((course) => !course.isPublished) || [];

  const allCourses = getAll.data?.pages.flatMap((page) => page.data) || [];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, px: 2 }}>
      {pageState === PageState.ERROR && <Typography>Error ....</Typography>}
      {pageState === PageState.LOADING && <LoadingSpinner />}
      {pageState === PageState.READY && (
        <>
          {/* Overview section - Full width */}
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
                Overview
              </Typography>
              <Typography
                variant="h5"
                component="h5"
                align="left"
                sx={{ paddingTop: 1, paddingBottom: 3, textAlign: "left" }}
              >
                Una visualizzazione generale dei tuoi serivizi sulla piattaforma
              </Typography>
            </Container>
          </Box>
          <OverviewSection
            cards={[
              {
                title: "Corsi Attivi",
                value: activeCourses.length,
                icon: <FitnessCenter />,
              },
              {
                title: "Corsi Archiviati",
                value: archivedCourses.length,
                icon: <FitnessCenter />,
              },
            ]}
          />

          {/* Content container with flexbox */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mt: 3,
              height: "100%",
            }}
          >
            {/* Left side - DataGrid - Ridotta */}
            <Box
              sx={{
                width: { xs: "100%", md: "65%" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <DashboardDataGrid
                courses={allCourses}
                pageNumer={5}
                nextPageAction={() => getAll.fetchNextPage()}
                hasNextPage={!!getAll.hasNextPage}
                isFetchingNextPage={getAll.isFetchingNextPage}
                onAction={false}
                onDelete={handleDelete}
                onEdit={() => {}} // No edit functionality needed in dashboard
                onCourseUsers={handleCourseUsersOpen}
              />
            </Box>

            {/* Right side - Calendar */}
            <Box
              sx={{
                width: { xs: "100%", md: "35%" },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Intestazione del calendario */}
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  Calendario
                </Typography>

                {/* Calendario - occupa tutto lo spazio disponibile */}
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    pb: 8,
                  }}
                >
                  <DateCalendar
                    sx={{
                      width: "100%",
                      height: "100%",
                      "& .MuiPickersCalendarHeader-root": {
                        paddingLeft: 2,
                        paddingRight: 2,
                        fontSize: "1.1rem",
                      },
                      "& .MuiDayCalendar-header": {
                        justifyContent: "space-around",
                        "& .MuiTypography-root": {
                          fontSize: "1rem",
                        },
                      },
                      "& .MuiDayCalendar-weekContainer": {
                        justifyContent: "space-around",
                        "& .MuiButtonBase-root": {
                          fontSize: "1rem",
                        },
                      },
                      "& .MuiDayCalendar-monthContainer": {
                        height: "100%",
                      },
                    }}
                    views={["day"]}
                    showDaysOutsideCurrentMonth
                  />
                </Box>
              </Paper>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
