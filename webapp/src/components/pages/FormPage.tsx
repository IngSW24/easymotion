import { Typography, Container } from "@mui/material"; // Card, CardContent, Box
import CardForm from "./CardForm.tsx";
import { useQuery } from "@tanstack/react-query";

/**
 * Event interface representing the structure of an event
 */
export interface ApplicationEvent {
  organizer: string;
  instructor: string;
  type: string;
  description: string;
  location: string;
  times: string;
  cost: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getEvents = async (): Promise<ApplicationEvent[]> => {
  const response = await fetch("/api.easymotion.devlocal/events");
  return response.json();
};

const getEventsMockup = async (): Promise<ApplicationEvent[]> => {
  return new Promise((res) =>
    res([
      {
        // create mockup event
        organizer: "John Doe",
        instructor: "Jane Doe",
        type: "Yoga",
        description: "Yoga for beginners",
        location: "1234 Elm St",
        times: "Monday: 9:00am - 10:00am",
        cost: 10.0,
      },
    ])
  );
};

/**
 * Define the form page for the physiotherapists to create an event
 * @returns the form page
 */
function FormPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addEvent = (_newEvent: ApplicationEvent) => {
    // this will need to call a mutation from react query
    // setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["events"],
    queryFn: getEventsMockup,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

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

/**
 * <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          marginTop: 4,
        }}
      >
        {data.map((event, index) => (
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
              {event.times}
            </CardContent>
          </Card>
        ))}
      </Box>
      */