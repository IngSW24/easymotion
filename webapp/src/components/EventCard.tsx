import { Card, CardActions, CardContent, Button } from "@mui/material";
import { EventEntity } from "../data/event"

/**
 * This is an event card
 */
export default function EventCard({event, onClick}: { event: EventEntity, onClick: () => void }) {
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
        <Button size="small" onClick={onClick}>Learn more</Button>
      </CardActions>
    </Card>
  )
}
