import { useParams } from "react-router";
import { Container } from "@mui/material";
import CourseDetail from "../components/course/CourseDetail/CourseDetail";
import HeroImage from "../components/HeroImage/HeroImage";
import { useCourses } from "../hooks/useCourses";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { CourseEntity, UpdateCoursesDto } from "../client/Api";
import { useState, useEffect } from "react";
import { useApiClient } from "../hooks/useApiClient";

/**
 * Defines the page to view and edit details of a course
 * @returns a react component
 */
export default function CourseDetailsPage() {
  const { id } = useParams();
  const { apiClient } = useApiClient();

  const [userRole, setUserRole] = useState<
    "USER" | "ADMIN" | "PHYSIOTHERAPIST" | undefined
  >(undefined);

  useEffect(() => {
    apiClient.auth.authControllerGetUserProfile().then((data) => {
      setUserRole(data.data.role);
    });
  }, [apiClient.auth]);

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
      <HeroImage
        backgroundImage="/hero.jpg"
        title={courseRepo.getSingle.data?.name ?? ""}
      />
      <Container sx={{ mt: 5 }}>
        {courseRepo.getSingle.data && (
          <CourseDetail
            course={courseRepo.getSingle.data}
            onSave={handleSave}
            canEdit={userRole == "ADMIN" || userRole == "PHYSIOTHERAPIST"}
          />
        )}
      </Container>
    </>
  );
}
