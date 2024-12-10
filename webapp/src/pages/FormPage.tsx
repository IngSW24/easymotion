import { Typography, Container } from "@mui/material"; // Card, CardContent, Box
import CardForm from "./CardForm.tsx";
import { useMutation } from "@tanstack/react-query";
import { CreateEventDto } from "../../client/data-contracts.ts";
import { Events } from "../../client/Events.ts";

const api = new Events({
  baseUrl: import.meta.env.VITE_API_URL,
});

const addEvent = async (newEvent: CreateEventDto) => {
  await api.eventsControllerCreate(newEvent);
  return;
};

/**
 * Define the form page for the physiotherapists to create an event
 * @returns the form page
 */
function FormPage() {
  const updateEvent = useMutation({
    mutationFn: addEvent,
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <Container>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        EasyMotion: Physiotherapist Profile
      </Typography>
      <CardForm
        addEvent={async (e: CreateEventDto) => {
          await updateEvent.mutate(e);
        }}
      />
    </Container>
  );
}

export default FormPage;
