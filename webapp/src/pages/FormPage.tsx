import { Typography, Container } from "@mui/material"; // Card, CardContent, Box
import CardForm from "./CardForm.tsx";
import { useMutation } from "@tanstack/react-query";
import { CreateCourseDto } from "../../client/data-contracts.ts";
import { Courses } from "../../client/Courses";

const api = new Courses({
  baseUrl: import.meta.env.VITE_API_URL,
});

const addCourse = async (newCourse: CreateCourseDto) => {
  await api.coursesControllerCreate(newCourse);
  return;
};

/**
 * Define the form page for the physiotherapists to create an course
 * @returns the form page
 */
function FormPage() {
  const updateCourse = useMutation({
    mutationFn: addCourse,
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <Container>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        EasyMotion: Physiotherapist Profile
      </Typography>
      <CardForm
        addCourse={async (e: CreateCourseDto) => {
          await updateCourse.mutate(e);
        }}
      />
    </Container>
  );
}

export default FormPage;
