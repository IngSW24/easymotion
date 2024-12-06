import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { EventsEntity } from "../data/events"
import { Grid2, Typography } from "@mui/material";

const API_URL = "https://api.easymotion.devlocal"

const defaultEvents: EventsEntity | null = null

/**
 * Events page, which shows the events
 * @returns a react component
 */
export default function EventsPage() {
  const [events, setEvents] = useState(defaultEvents)
  useEffect(() => {
    let accept = true

    function fetchEvents() {
      fetch(API_URL + "/events").then(response => {
        response.json().then(json => {
          if (accept)
            setEvents(json)
        })
      }).catch(console.error)
    }

    fetchEvents()

    return () => {
      accept = false
    }
  }, [events ? events.data.length > 0 : ""]) // TODO: 3 chiamate API

  function onEventCardClick(id: string) {
    console.log("Hai premuto tasto Delete sull'evento: " + id)
  }

  return (
    <Grid2 container spacing={6}>
      {events ? events.data.map((e) =>
        <Grid2 key={e.id}>
          <EventCard event={e} onDeleteClick={() => onEventCardClick(e.id)} />
        </Grid2>
      ): (
        <Typography variant="h1" display="block">Loading...</Typography>
      )
      }
    </Grid2>
  );
};
