import { Box, Container, Grid2, Typography } from "@mui/material";
import { useCourses } from "../../hooks/useCourses";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import LandingCourseCard from "./LandingCourseCard";

/**
 * LandingCoursesSection displays featured courses on the landing page.
 * It fetches course data and renders up to 3 course cards.
 */
export default function LandingCoursesSection() {
  const { get: getCourses } = useCourses({ page: 0, perPage: 3 });

  return (
    <Box
      id="courses"
      sx={{
        py: 6,
        backgroundColor: "#f7f9fc",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0 } }}>
        <Typography
          id="courses-section-title"
          variant="h4"
          align="center"
          sx={{ mb: 4 }}
          color="primary"
        >
          I nostri corsi
        </Typography>

        {getCourses.isError ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" component="p" color="error" sx={{ mb: 2 }}>
              Si è verificato un errore
            </Typography>
            <Typography variant="body1">
              Non è stato possibile caricare i corsi. Riprova più tardi.
            </Typography>
          </Box>
        ) : getCourses.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <LoadingSpinner />
          </Box>
        ) : (
          <Grid2
            container
            spacing={{ xs: 2 }}
            columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
            justifyContent={{ xs: "center", lg: "space-between" }}
          >
            {getCourses.data?.map((course) => (
              <Grid2 key={course.id} sx={{ xs: 1 }}>
                <LandingCourseCard course={course} />
              </Grid2>
            ))}
          </Grid2>
        )}
      </Container>
    </Box>
  );
}
