import { useParams } from "react-router";
import { Container } from "@mui/material";
import CourseDetail from "../components/course/CourseDetail/CourseDetail";
import { useCourses } from "../hooks/useCourses";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Hero from "../components/Hero/Hero";
import { getCourseImageUrl } from "../utils/format";
import Fade from "../components/animations/Fade";

/**
 * Defines the page to view and edit details of a course
 * @returns a react component
 */
export default function CourseDetailsPage() {
  const { id } = useParams();

  const courseRepo = useCourses({ fetchId: id });

  if (courseRepo.getSingle.isLoading) return <LoadingSpinner />;

  if (courseRepo.getSingle.error)
    return <div>Errore nel caricamento della pagina</div>;

  return (
    <Fade>
      <Hero
        opacity={0.5}
        title={courseRepo.getSingle.data?.name ?? ""}
        subtitle={courseRepo.getSingle.data?.short_description ?? ""}
        backgroundImage={getCourseImageUrl({
          course: courseRepo.getSingle.data,
        })}
        fallbackImage={`/hero.jpg`}
      />
      <Container sx={{ my: 5 }}>
        {courseRepo.getSingle.data && (
          <CourseDetail course={courseRepo.getSingle.data} hideTitle />
        )}
      </Container>
    </Fade>
  );
}
