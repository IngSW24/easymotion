import { Container } from "@mui/material";
import CourseList from "../components/course/CourseList/CourseList";
import HeroImage from "../components/ui/HeroImage/HeroImage";

interface CourseListPageProps {
  canEdit?: boolean;
}

/**
 * Defines the page to list all courses
 * @returns a react component
 */
export default function CourseListPage(props: CourseListPageProps) {
  const { canEdit } = props;

  return (
    <>
      <HeroImage
        backgroundImage="/hero.jpg"
        title="Trova il tuo prossimo corso"
        fontWeight={400}
      />
      <Container maxWidth="xl" sx={{ p: 5 }}>
        <CourseList canEdit={canEdit} />
      </Container>
    </>
  );
}
