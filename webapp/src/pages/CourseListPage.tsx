import { Container } from "@mui/material";
import CourseList from "../components/course/CourseList/CourseList";
import HeroImage from "../components/HeroImage/HeroImage";
import CreateCourseButton from "../components/atoms/Button/CreateCourseButton";
import { useAuth } from "../hooks/useAuth";

/**
 * Defines the page to list all courses
 * @returns a react component
 */
export default function CourseListPage() {
  const auth = useAuth();

  return (
    <>
      <HeroImage
        backgroundImage="/hero.jpg"
        //title="Trova il tuo prossimo corso"
        title="Il tuo benessere inizia qui: fisioterapia d’eccellenza e allenamenti su misura, tutto in un unico posto!"
        fontWeight={400}
      />
      <Container maxWidth="xl" sx={{ p: 5 }}>
        <CourseList
          canEdit={auth.isAuthenticated} // TODO: check user role
        />
        {auth.isAuthenticated && <CreateCourseButton />}
      </Container>
    </>
  );
}
