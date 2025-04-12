import { Container } from "@mui/material";
import CourseList from "../components/course/CourseList/CourseList";
import { useAuth } from "@easymotion/auth-context";
import Hero from "../components/Hero/Hero";

/**
 * Defines the page to list all courses
 * @returns a react component
 */
export default function CourseListPage() {
  const auth = useAuth();

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
        <CourseList />
      </Container>
    </>
  );
}
