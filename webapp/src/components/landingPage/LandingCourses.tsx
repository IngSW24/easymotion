import { Box, Container, Grid2, Typography } from "@mui/material";
import { useCourses } from "../../hooks/useCourses";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import LandingCourseCard from "./LandingCourseCard";

/**
 * LandingCoursesSection displays featured courses on the landing page.
 * It fetches course data and renders up to 3 course cards.
 */
export default function LandingCoursesSection() {
  const { get: getCourses } = useCourses();
  const { data, isLoading, isError } = getCourses;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 6 },
        backgroundColor: "#f7f9fc",
      }}
      aria-labelledby="courses-section-title"
    >
      <Container maxWidth="lg">
        <Typography
          id="courses-section-title"
          variant="h4"
          align="center"
          sx={{ mb: 4 }}
        >
          I nostri corsi
        </Typography>

        {isError ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" component="p" color="error" sx={{ mb: 2 }}>
              Si è verificato un errore
            </Typography>
            <Typography variant="body1">
              Non è stato possibile caricare i corsi. Riprova più tardi.
            </Typography>
          </Box>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <LoadingSpinner />
          </Box>
        ) : (
          <Grid2
            container
            spacing={{ xs: 2, sm: 3 }}
            columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
          >
            {data &&
              data.slice(0, 3).map((course) => (
                <Grid2
                  key={course.id}
                  size={{ xs: 0.9, sm: 0.9, md: 1, lg: 1, xl: 1 }}
                >
                  <LandingCourseCard course={course} />
                </Grid2>
              ))}
          </Grid2>
        )}
      </Container>
    </Box>
  );
}
