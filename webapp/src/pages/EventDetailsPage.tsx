import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { EventEntity } from "../data/event";

const defaultEvent = {
  organizer: "",
  instructor: "",
  type: "AUTONOMOUS",
  frequency: "",
  times: "",
  description: "",
  location: "",
  cost: 0.0,
};

export default function EventDetailsPage() {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(defaultEvent);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] =
    useState<Omit<EventEntity, "id">>(defaultEvent);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/events/" + id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      setEventDetails(data);
      setFormData(data); // Imposta il formData con i dati ricevuti
    };

    fetchEventDetails();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const body = JSON.stringify({ ...formData, cost: Number(formData.cost) });

    console.log("sending body", body);

    fetch(import.meta.env.VITE_API_URL + "/events/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    })
      .then((response) => response.json())
      .then((updatedEvent) => {
        setEventDetails(updatedEvent);
        setIsEditing(false); // Esce dalla modalità di modifica
      })
      .catch(console.error);
  };

  return (
    <Box>
      <Button>
        <Link to={"/"}>HOME</Link>
      </Button>
      {isEditing ? (
        <Box>
          <TextField
            label="Organizer"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cost"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </Box>
      ) : (
        <Box>
          <Button onClick={() => setIsEditing(true)}>EDIT</Button>
          <Typography variant="h4" display="block">
            <ul>
              <li>Organizer: {eventDetails.organizer}</li>
              <li>Instructor: {eventDetails.instructor}</li>
              <li>Type: {eventDetails.type}</li>
              <li>Description: {eventDetails.description}</li>
              <li>Location: {eventDetails.location}</li>
              <li>Cost: {eventDetails.cost}</li>
            </ul>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
