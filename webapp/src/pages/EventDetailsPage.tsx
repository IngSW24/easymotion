import { useParams } from "react-router";
import EventCard from "../components/EventCard";
import { EventEntity } from "../data/event";

export default function EventDetailsPage() {
    let {id} = useParams()
    
    return (
        <EventCard event={e} onClick={() => {}} />
    )
}