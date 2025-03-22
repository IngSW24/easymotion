import { Box, Grid2, Typography } from "@mui/material";
import { useCourses } from "../../hooks/useCourses";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import LandingCourseCard from "./LandingCourseCard";

export default function LandingCoursesSection() {
  const { get: getCourses } = useCourses();

  return (
    <Box sx={{ py: 6, backgroundColor: "#f7f9fc" }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        I nostri corsi
      </Typography>
      <Grid2
        container
        spacing={6}
        columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
        sx={{
          justifyContent: "center",
        }}
      >
        {getCourses.isError ? (
          <Typography align="center" variant="h2" display="block">
            Si è verificato un errore
          </Typography>
        ) : getCourses.isLoading ? (
          <LoadingSpinner />
        ) : (
          getCourses.data?.slice(0, 3).map((e) => (
            <Grid2 key={e.id} size={{ xs: 0.9, sm: 0.9, md: 1, lg: 1, xl: 1 }}>
              <LandingCourseCard course={e} />
            </Grid2>
          ))
        )}
      </Grid2>
    </Box>
  );
}
