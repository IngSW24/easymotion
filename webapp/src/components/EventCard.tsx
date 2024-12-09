import { Card, CardActions, CardContent, Button } from "@mui/material";
import { EventEntity } from "../data/event"
import { Link } from "react-router";

/**
 * This is an event card, which shows information about an event.
 * This is supposed to be shown in a grid
 */
export default function EventCard({event, onDeleteClick}: { event: EventEntity, onDeleteClick: () => void }) {
  return (
    <Card>
      <CardContent>
        <div>
          <ul>
            <li>Organizer: {event.organizer}</li>
            <li>Instructor: {event.instructor}</li>
            <li>Type: {event.type}</li>
            <li>Description: {event.description}</li>
            <li>Location: {event.location}</li>
            <li>Frequency: {event.frequency}</li>
            <li>Times: {event.times}</li>
            <li>Cost: {event.cost}</li>
          </ul>
        </div>
      </CardContent>
      <CardActions>
        <Button size="small"><Link to={"/details/" + event.id}>Learn more</Link></Button>
        <Button size="small" onClick={onDeleteClick}>Delete</Button>
      </CardActions>
    </Card>
  )
}
