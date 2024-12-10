import { Typography, Container } from "@mui/material"; // Card, CardContent, Box
import CardForm from "./CardForm.tsx";
import { useMutation } from "@tanstack/react-query";
<<<<<<< HEAD
import { CreateCourseDto } from "../../client/data-contracts.ts";
import { Courses } from "../../client/Courses";
||||||| parent of c0d870f (feat(webapp): using api generated client)
import { EventEntity } from "../data/event.tsx";
=======
import { CreateEventDto } from "../../client/data-contracts.ts";
import { Events } from "../../client/Events.ts";
>>>>>>> c0d870f (feat(webapp): using api generated client)

<<<<<<< HEAD
const api = new Courses({
  baseUrl: import.meta.env.VITE_API_URL,
});
||||||| parent of c0d870f (feat(webapp): using api generated client)
const addEvent = async (newEvent: Omit<EventEntity, "id">) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(newEvent),
  });
=======
const api = new Events({
  baseUrl: import.meta.env.VITE_API_URL,
});
>>>>>>> c0d870f (feat(webapp): using api generated client)

<<<<<<< HEAD
const addCourse = async (newCourse: CreateCourseDto) => {
  await api.coursesControllerCreate(newCourse);
  return;
||||||| parent of c0d870f (feat(webapp): using api generated client)
  return response;
=======
const addEvent = async (newEvent: CreateEventDto) => {
  await api.eventsControllerCreate(newEvent);
  return;
>>>>>>> c0d870f (feat(webapp): using api generated client)
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
<<<<<<< HEAD
        addCourse={async (e: CreateCourseDto) => {
          await updateCourse.mutate(e);
||||||| parent of c0d870f (feat(webapp): using api generated client)
        addEvent={async (e: Omit<EventEntity, "id">) => {
          await updateEvent.mutate(e);
=======
        addEvent={async (e: CreateEventDto) => {
          await updateEvent.mutate(e);
>>>>>>> c0d870f (feat(webapp): using api generated client)
        }}
      />
    </Container>
  );
}

export default FormPage;
