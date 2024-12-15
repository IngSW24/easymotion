import { Typography, Container } from "@mui/material"; // Card, CardContent, Box
import CourseEditor from "../components/course/CourseEditor/CardForm.tsx";

/**
 * Defines a page to create a new course
 * @returns a react component
 */
export default function CourseCreatePage() {
  return (
    <Container>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        EasyMotion: Physiotherapist Profile
      </Typography>
      <CourseEditor />
    </Container>
  );
}
