import { Box, Grid2, Typography } from "@mui/material";
import OverviewSection from "../../components/dashboard/OverviewSection";
import DashboardDataGrid from "../../components/dashboard/CoursesDataGrid";
import { DateCalendar } from "@mui/x-date-pickers";
import { useProfile } from "../../hooks/useProfile";
import { useCourses } from "../../hooks/useCourses";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

enum CurrentState {
  "LOADING",
  "ERROR",
  "READY",
}

export default function DashboardHome() {
  const [currentPageState, setCurrentPageState] = useState(
    CurrentState.LOADING
  );

  const { get: getProfile } = useProfile();
  const { getPhysiotherapist: getCourses, remove } = useCourses({
    perPage: 10,
    ownerId: getProfile.data?.id,
  });

  useEffect(() => {
    if (getProfile.isError || getCourses.isError) {
      setCurrentPageState(CurrentState.ERROR);
    } else if (getProfile.isSuccess && getCourses.isSuccess) {
      setCurrentPageState(CurrentState.READY);
    } else {
      setCurrentPageState(CurrentState.LOADING);
    }
  }, [getProfile, getCourses]);

  if (currentPageState === CurrentState.READY) {
    console.log(getCourses.data);
    console.log(getCourses.data?.pageParams);
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, px: 2 }}>
      {currentPageState === CurrentState.ERROR && (
        <Typography>Error ....</Typography>
      )}
      {currentPageState === CurrentState.LOADING && (
        <Typography>
          <LoadingSpinner />
        </Typography>
      )}
      {currentPageState === CurrentState.READY && (
        <Grid2 container spacing={3}>
          {/* Left column - Overview and DataGrid */}
          <Grid2 size={{ xs: 12, lg: 9 }}>
            {/* Overview section */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Overview
            </Typography>
            <OverviewSection />

            {/* Courses section */}
            <Typography pt={4} component="h2" variant="h6" sx={{ mb: 2 }}>
              Courses
            </Typography>
            <Box sx={{ width: "100%", mb: { xs: 3, lg: 0 } }}>
              <DashboardDataGrid
                courses={
                  getCourses.data?.pages.flatMap((page) => page.data) || []
                }
                nextPageAction={() => getCourses.fetchNextPage()}
                hasNextPage={!!getCourses.hasNextPage}
                isFetchingNextPage={getCourses.isFetchingNextPage}
                totalItems={getCourses.data?.pages[0]?.meta.totalItems || 0}
                onDelete={(id) => remove.mutateAsync(id)}
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
