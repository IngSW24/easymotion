import { Box, Button, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { UpdateCoursesDto } from "../../../../client/data-contracts";
import { defaultCourse } from "../../../data/defaults";
import { useCourses } from "../../../hooks/useCourses";
import { useSnack } from "../../../hooks/useSnack";

export interface CourseDetailProps {
  id: string;
}

/**
 * Defines a react component that displays the details of a course and allows edits
 * @param props the properties for the component, including the course id
 * @returns a react component
 */
export default function CourseDetail(props: CourseDetailProps) {
  const { id } = props;
  const courses = useCourses({ id });
  const singleCourse = courses.getSingle;
  const [editCourse, setEditCourse] = useState<UpdateCoursesDto>(defaultCourse);
  const [hasChanged, setHasChanged] = useState(false);
  const snack = useSnack();

  useEffect(() => {
    if (courses.getSingle.data) {
      setEditCourse(courses.getSingle.data);
    }
  }, [courses.getSingle.data]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditCourse((prev) => ({ ...prev, [name]: value }));
      if (!hasChanged) setHasChanged(true);
    },
    [hasChanged]
  );

  const handleSave = useCallback(async () => {
    try {
      await courses.update.mutateAsync({
        courseId: id,
        courseData: { ...editCourse, cost: Number(editCourse.cost) },
      });
      setHasChanged(false);
      snack.showSuccess("Course updated successfully");
    } catch (e) {
      if (e instanceof Error || typeof e === "string") snack.showError(e);
    }
  }, [courses.update, editCourse, id, snack]);

  if (singleCourse.isLoading)
    return <Typography variant="h4">Loading...</Typography>;

  if (singleCourse.error || !singleCourse.data)
    return <Typography variant="h4">An error occoured</Typography>;

  return (
    <Box>
      <TextField
        label="Organizer"
        name="organizer"
        value={editCourse.organizer}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Instructor"
        name="instructor"
        value={editCourse.instructor}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Type"
        name="type"
        value={editCourse.type}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={editCourse.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Location"
        name="location"
        value={editCourse.location}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cost"
        name="cost"
        type="number"
        value={editCourse.cost}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSave}>Save</Button>
    </Box>
  );
}
