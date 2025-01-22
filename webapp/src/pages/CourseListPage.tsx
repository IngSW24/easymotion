import { Container } from "@mui/material";
import CourseList from "../components/course/CourseList/CourseList";
import CreateCourseButton from "../components/atoms/Button/CreateCourseButton";
import { useAuth } from "../hooks/useAuth";
import Hero from "../components/Hero/Hero";
import { AuthUserDto } from "@easymotion/openapi";

const checkCanEdit = (currentRole?: AuthUserDto["role"]) =>
  ["ADMIN", "PHYSIOTHERAPIST"].includes(currentRole ?? "");

/**
 * Defines the page to list all courses
 * @returns a react component
 */
export default function CourseListPage() {
  const auth = useAuth();

  const canEdit = checkCanEdit(auth.user?.role);

  return (
    <>
      <Hero
        backgroundImage="/hero.jpg"
        title={
          auth.isAuthenticated
            ? `Bentornato, ${auth.user?.firstName}!`
            : "EasyMotion"
        }
        subtitle="Il tuo benessere inizia qui: fisioterapia d’eccellenza e allenamenti su misura, tutto in un unico posto!"
        showSignupButton={!auth.isAuthenticated}
      />
      <Container maxWidth="xl" sx={{ p: 5 }}>
        <CourseList canEdit={canEdit} />
        {canEdit && <CreateCourseButton />}
      </Container>
    </>
  );
}
