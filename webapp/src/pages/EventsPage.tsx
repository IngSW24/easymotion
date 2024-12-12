import { Fragment, useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { Grid2, Typography } from "@mui/material";
import { cancellaEvento } from "../components/DeleteButton";
import DeleteDialog from "../components/DeleteDialog";
import { Events } from "../../client/Events";

const api = new Events({
  baseUrl: import.meta.env.VITE_API_URL,
});

type PaginatedEvent = Awaited<ReturnType<typeof api.eventsControllerFindAll>>;

/**
 * Events page, which shows a grid of events
 * @returns a react component
 */
export default function EventsPage() {
  const [events, setEvents] = useState<PaginatedEvent | null>(null);

  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = () => {
      return api.eventsControllerFindAll();
    };

    fetchEvents().then((d) => setEvents(d));
  }, []);

  const onCardDeleteClick = (id: string) => setId(id);

  if (!events) {
    return (
      <Typography align="center" variant="h2" display="block">
        Loading...
      </Typography>
    );
  }

  if (events.data.data.length === 0) {
    return (
      <Typography align="center" variant="h2" display="block">
        No elements found
      </Typography>
    );
  }

  return (
    <Fragment>
      <Grid2 container spacing={6}>
        {events.data.data.map((e) => (
          <Grid2 key={e.id}>
            <EventCard
              event={e}
              onDeleteClick={() => onCardDeleteClick(e.id)}
            />
          </Grid2>
        ))}
      </Grid2>
      <DeleteDialog
        id={id}
        handleCloseAnnulla={() => setId(null)}
        handleCloseCancella={() => cancellaEvento(id)}
      />
    </Fragment>
  );
}
