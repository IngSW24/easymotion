import { Card, CardActions, CardContent, Button } from "@mui/material";
import { EventEntity } from "../data/event"
import { Link } from "react-router";

/**
 * This is an event card
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
