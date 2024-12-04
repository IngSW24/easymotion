import EventCard from "../components/EventCard";
import { EventEntity } from "../data/event"
import { Grid2 } from "@mui/material";

/**
 * Events page, which shows the events
 * @returns a react component
 */
export default function EventsPage() {
  function onEventCardClick(id: string) {
    console.log(id)
  }

  const events: EventEntity[] = [
    {id: "ID1", organizer: "ORG", instructor: "INS", type: "TYPE",
      times: "TIMES", frequency: "FREQ", description: "DESC", location: "LOC", cost: 12},
    {id: "ID2", organizer: "ORG", instructor: "INS", type: "TYPE",
      times: "TIMES", frequency: "FREQ", description: "DESC", location: "LOC", cost: 12},
    {id: "ID3", organizer: "ORG", instructor: "INS", type: "TYPE",
      times: "TIMES", frequency: "FREQ", description: "DESC", location: "LOC", cost: 12},
  ]

  return (
    <Grid2 container spacing={6}>
      {events.map((e) =>
        <Grid2 key={e.id}>
          <EventCard event={e} onClick={() => onEventCardClick(e.id)} />
        </Grid2>
      )}
    </Grid2>
  );
};
