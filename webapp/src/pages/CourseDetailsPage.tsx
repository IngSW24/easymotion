import { useParams } from "react-router";
import { Container } from "@mui/material";
import CourseDetail from "../components/course/CourseDetail/CourseDetail";
import { useCourses } from "../hooks/useCourses";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { CourseEntity, UpdateCoursesDto } from "../client/Api";
import { useAuth } from "../hooks/useAuth";
import Hero from "../components/Hero/Hero";

/**
 * Defines the page to view and edit details of a course
 * @returns a react component
 */
export default function CourseDetailsPage() {
  const { id } = useParams();
  const auth = useAuth();

  const courseRepo = useCourses({ fetchId: id });

  const handleSave = (course: CourseEntity) =>
    courseRepo.update.mutateAsync({
      courseData: course as UpdateCoursesDto,
      courseId: id ?? "",
    });

  if (courseRepo.getSingle.isLoading) return <LoadingSpinner />;

  if (courseRepo.getSingle.error)
    return <div>Errore nel caricamento della pagina</div>;

  return (
    <>
      <Hero
        backgroundImage="/hero.jpg"
        title={courseRepo.getSingle.data?.name ?? ""}
        showSignupButton={false}
      />
      <Container sx={{ mt: 5 }}>
        {courseRepo.getSingle.data && (
          <CourseDetail
            course={courseRepo.getSingle.data}
            onSave={handleSave}
            canEdit={
              auth.user?.role == "ADMIN" || auth.user?.role == "PHYSIOTHERAPIST"
            }
          />
        )}
      </Container>
    </>
  );
}
