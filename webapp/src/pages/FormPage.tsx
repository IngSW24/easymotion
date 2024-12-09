import { Container, Typography } from "@mui/material";
import { useState } from "react";
import EventCard, { ApplicationEvent } from "./EventCard";

function FormPage() {
  const [events, setEvents] = useState<ApplicationEvent[]>([]);

  const updateEvent = (index: number, updatedEvent: ApplicationEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event, i) => (i === index ? updatedEvent : event))
    );
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        EasyMotion: Physiotherapist Profile
      </Typography>
      {events.map((event, index) => (
        <EventCard
          key={index}
          event={event}
          onEdit={(updatedEvent) => updateEvent(index, updatedEvent)}
        />
      ))}
    </Container>
  );
}

export default FormPage;
