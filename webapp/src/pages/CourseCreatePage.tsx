import { Container } from "@mui/material"; // Card, CardContent, Box
import CourseDetailsPage from "./CourseDetailsPage.tsx";

interface CreatePageProps {
  canEdit?: boolean;
}

/**
 * Defines a page to create a new course
 * @returns a react component
 */
export default function CourseCreatePage({ canEdit = false }: CreatePageProps) {
  return (
    <Container>
      <CourseDetailsPage canEdit={canEdit} />
    </Container>
  );
}
