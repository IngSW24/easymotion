import { Link, useParams } from "react-router";
import { EventEntity } from "../data/event";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const API_URL = "https://api.easymotion.devlocal"

const defaultEvent: EventEntity | null = null

/**
 * EventDetailsPage shows information about an event
 * This is supposed to fit the entire screen
 */
export default function EventDetailsPage() {
  const {id} = useParams()
  const [eventDetails, setEventDetails] = useState(defaultEvent)
  useEffect(() => {
    let accept = true

    function fetchEventDetails() {
      fetch(API_URL + "/events/" + id).then(response => {
        response.json().then(json => {
        if (accept)
          setEventDetails(json)
        })
      }).catch(console.error)
    }

    fetchEventDetails()

    return () => {
      accept = false
    }
  }, [id])
  
  return (
    <Box>
      <Button><Link to={"/"}>HOME</Link></Button>
      { eventDetails ? (
        <Typography variant="h4" display="block">
          <ul>
            <li>Organizer: {eventDetails.organizer}</li>
            <li>Instructor: {eventDetails.instructor}</li>
            <li>Type: {eventDetails.type}</li>
            <li>Description: {eventDetails.description}</li>
            <li>Location: {eventDetails.location}</li>
            <li>Frequency: {eventDetails.frequency}</li>
            <li>Times: {eventDetails.times}</li>
            <li>Cost: {eventDetails.cost}</li>
          </ul>
        </Typography>
      ) : (
        <Typography align="center" variant="h1" display="block">Loading...</Typography>
      )
    }
    </Box>)
}