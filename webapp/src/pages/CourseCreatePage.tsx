import { Container } from "@mui/material"; // Card, CardContent, Box
import { useCourses } from "../hooks/useCourses.tsx";
import { CourseEntity, CreateCourseDto } from "@easymotion/openapi";
import HeroImage from "../components/Hero/Hero.tsx";
import CourseDetail from "../components/course/CourseDetail/CourseDetail.tsx";
import { defaultCourse } from "../data/defaults.ts";
import { useNavigate } from "react-router";

/**
 * Defines a page to create a new course
 * @returns a react component
 */
export default function CourseCreatePage() {
  const navigate = useNavigate();
  const courseRepo = useCourses({ fetchAll: false });

  const handleSave = async (course: CourseEntity) => {
    // TODO these fields should be set by the user on edit page this is just temporary
    const promise = courseRepo.create.mutateAsync(course as CreateCourseDto);

    await promise;

    navigate("/");

    return promise;
  };

  return (
    <>
      <HeroImage backgroundImage="/hero.jpg" title="Creazione nuovo corso" />
      <Container sx={{ mt: 5 }}>
        <CourseDetail
          course={defaultCourse}
          onSave={handleSave}
          canEdit
          isNew={true}
        />
      </Container>
    </>
  );
}
