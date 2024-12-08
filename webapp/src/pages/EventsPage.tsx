import { Fragment, useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { EventsEntity } from "../data/events"
import { Grid2, Typography } from "@mui/material";
import { cancellaEvento } from "../components/DeleteButton";
import DeleteDialog from "../components/DeleteDialog";

const API_URL = "https://api.easymotion.devlocal"

/**
 * Events page, which shows the events
 * @returns a react component
 */
export default function EventsPage() {
  const [events, setEvents] = useState<EventsEntity | null>(null)

  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    let accept = true

    function fetchEvents() {
      console.log("Ciao")
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
  }, [])

  function onCardDeleteClick(id: string) {
    setId(id)
  }

  return (
    <Fragment>
      <Grid2 container spacing={6}>
        {events ? events.data.map((e) =>
          <Grid2 key={e.id}>
            <EventCard event={e} onDeleteClick={() => onCardDeleteClick(e.id)} />
          </Grid2>
        ): (
          <Typography variant="h1" display="block">Loading...</Typography>
        )
        }
      </Grid2>
    
      <DeleteDialog id={id} handleCloseAnnulla={() => setId(null)} handleCloseCancella={() => cancellaEvento(id)} />
      
    </Fragment>
  );
};
