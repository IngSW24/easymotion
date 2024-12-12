import { Card, CardContent, Button } from "@mui/material";
import { useState } from "react";
import { EventEntity, UpdateEventDto } from "../../client/data-contracts";

interface EventCardProps {
  event: EventEntity;
  onEdit: (updatedEvent: UpdateEventDto) => void;
}

function EventCard({ event, onEdit }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(event);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {/* Aggiungi altri campi come necessario */}
          <Button onClick={handleSave}>Save</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Button onClick={() => setIsEditing(true)}>Edit</Button>
      </CardContent>
    </Card>
  );
}

export default EventCard;
