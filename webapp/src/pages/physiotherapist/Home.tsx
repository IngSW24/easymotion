import { Box, Grid2, Typography } from "@mui/material";
import OverviewSection from "../../components/dashboard/OverviewSection";
import DashboardDataGrid from "../../components/dashboard/CoursesDataGrid";
import { DateCalendar } from "@mui/x-date-pickers";

export default function DashboardHome() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, px: 2 }}>
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
            <DashboardDataGrid />
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
    </Box>
  );
}
