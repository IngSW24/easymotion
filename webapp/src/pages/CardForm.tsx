import React, { useState, ChangeEvent, FormEvent } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import { CreateEventDto, EventType } from "../../client/data-contracts";

/**
 * Define the interface to manage the event creation
 */
interface CardFormProps {
  addEvent: (event: CreateEventDto) => Promise<void>;
}

/**
 * Define the form module with all the data validators
 * @returns the component CardForm
 */
const CardForm: React.FC<CardFormProps> = ({ addEvent }) => {
  const [formData, setFormData] = useState<CreateEventDto>({
    organizer: "",
    instructor: "",
    type: EventType.AUTONOMOUS,
    description: "",
    location: "",
    frequency: "", // Start with one empty frequency input
    cost: 0.0,
    times: "",
  });

  const [errors, setErrors] = useState({
    organizer: "",
    instructor: "",
    type: "",
    description: "",
    location: "",
    frequency: "", // Array to track frequency errors
    cost: "",
    times: "",
  });

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "organizer":
        if (!value) return "Organizer is required.";
        if (value.length < 3) return "Organizer must be at least 3 characters.";
        break;
      case "instructor":
        if (!value) return "Instructor is required.";
        break;
      case "type":
        if (!value) return "Type is required.";
        break;
      case "description":
        if (!value) return "Description is required.";
        if (value.length < 10)
          return "Description must be at least 10 characters.";
        break;
      case "location":
        if (!value) return "Location is required.";
        break;
      case "frequency":
        if (!value) return "Frequency is required.";
        break;
      case "times":
        if (!value) return "Times is required.";
        break;
      default:
        return "";
    }
    return "";
  };

  const validateNumericField = (value: number) => {
    if (isNaN(value)) return "Cost must be a valid number.";
    if (value < 0) return "Cost must be non-negative.";
    return "";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      organizer: validateField("organizer", formData.organizer),
      instructor: validateField("instructor", formData.instructor),
      type: validateField("type", formData.type),
      description: validateField("description", formData.description ?? ""),
      location: validateField("location", formData.location ?? ""),
      cost: validateNumericField(formData.cost ?? 0),
      frequency: validateField("frequency", formData.frequency ?? ""),
      times: validateField("times", formData.times ?? ""),
    };

    setErrors(newErrors);

    // Submit the form if valid
    addEvent(formData)
      .then(() => alert("Added event"))
      .catch(() => alert("Failed to add event"));

    // Reset the form
    setFormData({
      organizer: "",
      instructor: "",
      type: EventType.AUTONOMOUS,
      description: "",
      location: "",
      frequency: "",
      times: "",
      cost: 0.0,
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Organizer"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            error={!!errors.organizer}
            helperText={errors.organizer}
            fullWidth
            required
          />
          <TextField
            label="Instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            error={!!errors.instructor}
            helperText={errors.instructor}
            fullWidth
            required
          />
          <TextField
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            error={!!errors.type}
            helperText={errors.type}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={4}
            required
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
            required
          />
          <TextField
            label="Cost"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={(e) =>
              setFormData({
                ...formData,
                cost: parseFloat(e.target.value),
              })
            }
            error={!!errors.cost}
            helperText={errors.cost}
            fullWidth
            required
          />
          <TextField
            label={`Frequency`}
            name="frequency"
            value={formData.frequency}
            onChange={(e) => handleInputChange(e)}
            error={!!errors.frequency}
            helperText={errors.frequency}
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Add Event
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CardForm;