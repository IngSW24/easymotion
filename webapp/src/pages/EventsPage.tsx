import { Fragment, useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { EventsEntity } from "../data/events"
import { Grid2, Typography } from "@mui/material";
import { cancellaEvento } from "../components/DeleteButton";
import DeleteDialog from "../components/DeleteDialog";

const API_URL = "https://api.easymotion.devlocal"

/**
 * Events page, which shows a grid of events
 * @returns a react component
 */
export default function EventsPage() {
  const [events, setEvents] = useState<EventsEntity | null>(null)

  const [id, setId] = useState<string | null>(null);

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
  }, [])

  function onCardDeleteClick(id: string) {
    setId(id)
  }

  if (events) {
    if (events.data.length > 0) {
      return (
        <Fragment>
          <Grid2 container spacing={6}>
            {events.data.map((e) =>
              <Grid2 key={e.id}>
                <EventCard event={e} onDeleteClick={() => onCardDeleteClick(e.id)} />
              </Grid2>
              )
            }
          </Grid2>
          <DeleteDialog id={id} handleCloseAnnulla={() => setId(null)} handleCloseCancella={() => cancellaEvento(id)} />
        </Fragment>
      )
    } else {
      return (
        <Typography align="center" variant="h2" display="block">No elements found</Typography>
      )
    }
  } else {
    return (
      <Typography align="center" variant="h2" display="block">Loading...</Typography>
    )
  }
}
