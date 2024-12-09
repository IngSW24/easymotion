import { Typography, Container } from "@mui/material"; // Card, CardContent, Box
import CardForm from "./CardForm.tsx";
import { useMutation } from "@tanstack/react-query";
import { EventEntity } from "../data/event.tsx";

const addEvent = async (newEvent: Omit<EventEntity, "id">) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(newEvent),
  });

  return response;
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
        addEvent={async (e: Omit<EventEntity, "id">) => {
          await updateEvent.mutate(e);
        }}
      />
    </Container>
  );
}

export default FormPage;
