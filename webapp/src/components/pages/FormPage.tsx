import { useState } from 'react';
import { Typography, Container, Card, CardContent, Box } from '@mui/material';
import CardForm from './CardForm.tsx';
import { useQuery } from '@tanstack/react-query';

/**
 * Event interface representing the structure of an event
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
 * Define the form page for the physiotherapists to create an event
 * @returns the form page
 */
function FormPage() {
  const [events, setEvents] = useState<Event[]>([]);

  /**
   * It's used to add a new event into the state
   */
  const addEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const {
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['events'],
    queryFn: () =>
      fetch('/api/events').then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        EasyMotion: Physiotherapist Profile
      </Typography>
      <CardForm addEvent={addEvent} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          marginTop: 4,
        }}
      >
        {events.map((event, index) => (
          <Card key={index} sx={{ padding: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {event.type}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Organizer: {event.organizer}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Instructor: {event.instructor}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {event.location}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Cost: {event.cost}
              </Typography>
              <Typography variant="body2">
                Description: {event.description}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Schedule:
              </Typography>
              <ul>
                {event.times.map((time, i) => (
                  <li key={i}>
                    {time.day}: {time.duration}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default FormPage;