import { useState, ChangeEvent, FormEvent, useCallback } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import { CreateCourseDto } from "../../../../client/data-contracts";
import { defaultCourse } from "../../../data/defaults";
import { defaultErrors, hasErrors, validateField } from "./validation";
import { useCourses } from "../../../hooks/useCourses";
import { useSnack } from "../../../hooks/useSnack";

/**
 * Defines the course editor component that allows to create a new course
 * @returns a react component
 */
export default function CourseEditor() {
  const coursesRepo = useCourses({ initialFetch: false });
  const snack = useSnack();
  const [courseData, setCourseData] = useState<CreateCourseDto>(defaultCourse);
  const [errorSchema, setErrorSchema] = useState(defaultErrors);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (hasErrors(errorSchema)) return;

      try {
        await coursesRepo.create.mutateAsync(courseData);
        snack.showSuccess("Course created successfully");
      } catch (e) {
        if (e instanceof Error || typeof e === "string") snack.showError(e);
      } finally {
        setCourseData(defaultCourse);
      }
    },
    [courseData, coursesRepo.create, errorSchema, snack]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setCourseData({ ...courseData, [name]: value });
      setErrorSchema({ ...errorSchema, [name]: validateField(name, value) });
    },
    [courseData, errorSchema]
  );

  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Organizer"
            name="organizer"
            value={courseData.organizer}
            onChange={handleInputChange}
            error={!!errorSchema.organizer}
            helperText={errorSchema.organizer}
            fullWidth
            required
          />
          <TextField
            label="Instructor"
            name="instructor"
            value={courseData.instructor}
            onChange={handleInputChange}
            error={!!errorSchema.instructor}
            helperText={errorSchema.instructor}
            fullWidth
            required
          />
          <TextField
            label="Type"
            name="type"
            value={courseData.type}
            onChange={handleInputChange}
            error={!!errorSchema.type}
            helperText={errorSchema.type}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            error={!!errorSchema.description}
            helperText={errorSchema.description}
            fullWidth
            multiline
            rows={4}
            required
          />
          <TextField
            label="Location"
            name="location"
            value={courseData.location}
            onChange={handleInputChange}
            error={!!errorSchema.location}
            helperText={errorSchema.location}
            fullWidth
            required
          />
          <TextField
            label="Cost"
            name="cost"
            type="number"
            value={courseData.cost}
            onChange={(e) =>
              setCourseData({
                ...courseData,
                cost: parseFloat(e.target.value),
              })
            }
            error={!!errorSchema.cost}
            helperText={errorSchema.cost}
            fullWidth
            required
          />
          <TextField
            label={`Frequency`}
            name="frequency"
            value={courseData.frequency}
            onChange={(e) => handleInputChange(e)}
            error={!!errorSchema.frequency}
            helperText={errorSchema.frequency}
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Add Course
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
