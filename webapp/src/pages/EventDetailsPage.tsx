import { Link, useNavigate, useParams } from "react-router";
import { EventEntity } from "../data/event";
import { Fragment, useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import DeleteButton from "../components/DeleteButton";

const API_URL = "https://api.easymotion.devlocal"

const defaultEvent: EventEntity | null = null

/**
 * EventDetailsPage shows information about an event
 * This is supposed to fit the entire screen
 */
export default function EventDetailsPage() {
  const {id} = useParams<string>()
  const [eventDetails, setEventDetails] = useState(defaultEvent)
  const navigate = useNavigate()

  useEffect(() => {
    let accept = true

    function fetchEventDetails() {
      fetch(API_URL + "/events/" + id).then(response => {
        if (response.status !== 200) {
          throw new Error("Response status: " + response.status)
        }
        response.json().then(json => {
          if (accept)
            setEventDetails(json)
        })
      }).catch((reason) => {
        console.error(reason)
        navigate("/")
      })
    }

    if (id)
      fetchEventDetails()
    else
      navigate("/")

    return () => {
      accept = false
    }
  }, [id, navigate])
  
  return (
    <Fragment>
      <Button><Link to={"/"}>HOME</Link></Button>
      { (eventDetails && id) ? (
        <Fragment>
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
          <DeleteButton id={id} />
        </Fragment>
        ) : (
          <Typography align="center" variant="h2" display="block">Loading...</Typography>
        )
      }
    </Fragment>
  )
}