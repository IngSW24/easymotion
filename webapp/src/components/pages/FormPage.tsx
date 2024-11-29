import { useState } from 'react';
import { Typography, Container } from '@mui/material';
import CardForm from './CardForm.tsx';

/**
  Creates an interface for the creation of all the events 
*/
interface Event {
  organizer: string;
  instructor: string;
  type: string;
  description: string;
  location: string;
  times: { day: string; duration: string }[];
  cost: string;
}

/**
  Define the form page for the physioterapists to create an event
  @returns the form page
*/
function FormPage() {
  
  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]); // Aggiunge il nuovo evento all'elenco
  };
  
  return (
    <Container>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        EasyMotion: Physiotherapist Profile
      </Typography>
      <CardForm addEvent={addEvent} />
    </Container>
  );
}

export default FormPage;