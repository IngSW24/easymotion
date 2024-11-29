import React, { useState, ChangeEvent, FormEvent } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";

/**
 * Define the interface to manage the event creation
 */
interface CardFormProps {
  addEvent: (event: {
    organizer: string;
    instructor: string;
    type: string;
    description: string;
    location: string;
    times: { day: string; duration: string }[];
    cost: string;
  }) => void;
}

/**
 * Define the form module with all of the data validators
 * @returns the component CardForm
 */
const CardForm: React.FC<CardFormProps> = ({ addEvent }) => {
  
  // This is used to set form fields 
  const [formData, setFormData] = useState({
    organizer: "",
    instructor: "",
    type: "",
    description: "",
    location: "",
    times: [{ day: "", duration: "" }], // Array di oggetti per giorno e ora
    cost: "",
  });

  // This is used to contain fields errors
  const [errors, setErrors] = useState({
    organizer: "",
    instructor: "",
    type: "",
    description: "",
    location: "",
    times: [{ day: "", duration: "" }],
    cost: "",
  });

  // This is used to check if in the field indicated, there is an error
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
      case "cost":
        if (!value) return "Cost is required.";
        if (!/^\d+(\.\d{1,2})?$/.test(value))
          return "Cost must be a valid number (e.g., 20 or 20.50).";
        break;
      case "day":
        if (!value) return "Day is required.";
        break;
      case "duration":
        if (!value) return "Duration is required.";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Create the structure to contain the errors present in the fields
    const newErrors: typeof errors = {
      organizer: validateField("organizer", formData.organizer),
      instructor: validateField("instructor", formData.instructor),
      type: validateField("type", formData.type),
      description: validateField("description", formData.description),
      location: validateField("location", formData.location),
      cost: validateField("cost", formData.cost),
      times: formData.times.map((time) => ({
        day: validateField("day", time.day),
        duration: validateField("duration", time.duration),
      })),
    };
  
    setErrors(newErrors);
  
    // Check if in the structure created, there are fields which have errors
    const hasErrors = Object.values(newErrors).some((error) => {
      if (Array.isArray(error)) {
        return error.some(
          (timeError) => timeError.day || timeError.duration
        );
      }
      return !!error;
    });
  
    if (hasErrors) return;
  
    // If there are not errors, it sends the form
    addEvent({ ...formData });
  
    // Reset the form
    setFormData({
      organizer: "",
      instructor: "",
      type: "",
      description: "",
      location: "",
      times: [{ day: "", duration: "" }],
      cost: "",
    });
  };
  
  // Manages the data entry in the form
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: string) => {
    const { name, value } = e.target;

    if (field && typeof index === "number") {
      const updatedTimes = formData.times.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, times: updatedTimes });
    } else {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
      setFormData({ ...formData, [name]: value });
    }
  };

  // Manages the appointment entry in the form
  const addDayAndHour = () => {
    setFormData({
      ...formData,
      times: [...formData.times, { day: "", duration: "" }],
    });
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
            value={formData.cost}
            onChange={handleInputChange}
            error={!!errors.cost}
            helperText={errors.cost}
            fullWidth
            required
          />
          {formData.times.map((time, index) => (
            <Box key={index} display="flex" gap={2}>
              <TextField
                label="Day"
                name={`day-${index}`}
                value={time.day}
                onChange={(e) => handleInputChange(e, index, "day")}
                fullWidth
                required
              />
              <TextField
                label="Duration"
                name={`duration-${index}`}
                value={time.duration}
                onChange={(e) => handleInputChange(e, index, "duration")}
                fullWidth
                required
              />
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={addDayAndHour}
          >
            Add Day and Hour
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Add Event
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CardForm;