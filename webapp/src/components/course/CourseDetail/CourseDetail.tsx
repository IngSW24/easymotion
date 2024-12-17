import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { UpdateCoursesDto } from "../../../../client/data-contracts";
import { defaultCourse } from "../../../data/defaults";
import { useCourses } from "../../../hooks/useCourses";
import { useSnack } from "../../../hooks/useSnack";
import ProductCard from "../CourseDetail/CourseDetailCard";

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
  const courses = useCourses({ fetchId: id });
  const singleCourse = courses.getSingle;
  const [editCourse, setEditCourse] = useState<UpdateCoursesDto>(
    courses.getSingle.data ?? defaultCourse
  );
  const [isEditing, setIsEditing] = useState(false);
  const snack = useSnack();

  useMemo(() => {
    if (courses.getSingle.data) {
      setEditCourse(courses.getSingle.data);
    }
  }, [courses.getSingle.data]);

  const handleSave = async () => {
    try {
      await courses.update.mutateAsync({
        courseId: id,
        courseData: { ...editCourse, cost: Number(editCourse.cost) },
      });
      setIsEditing(false); // Exit edit mode
      snack.showSuccess("Course updated successfully");
    } catch (e) {
      if (e instanceof Error || typeof e === "string") snack.showError(e);
    }
  };

  if (singleCourse.isLoading)
    return <Typography variant="h4">Loading...</Typography>;

  if (singleCourse.error || !singleCourse.data)
    return <Typography variant="h4">An error occurred</Typography>;

  return (
    <Box>
      <Box sx={{ marginBottom: 2 }}>
        {!isEditing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}
            sx={{ textTransform: "none" }}
          >
            Modifica
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            sx={{ textTransform: "none", marginRight: 2 }}
          >
            Salva
          </Button>
        )}
      </Box>

      <ProductCard
        typeInfo="Organizzatore"
        info={editCourse.organizer}
        isEditing={isEditing}
        courseId={id}
        onSave={(field, value) => {
          setEditCourse((prev) => ({ ...prev, [field.toLowerCase()]: value }));
        }}
      />

      <ProductCard
        typeInfo="Istruttore"
        info={editCourse.instructor}
        isEditing={isEditing}
        courseId={id}
        onSave={(field, value) => {
          setEditCourse((prev) => ({ ...prev, [field.toLowerCase()]: value }));
        }}
      />

      <ProductCard
        typeInfo="Type"
        info={editCourse.type}
        isEditing={isEditing}
        courseId={id}
        onSave={(field, value) => {
          setEditCourse((prev) => ({ ...prev, [field.toLowerCase()]: value }));
        }}
      />

      {/**
      <ProductCard
        typeInfo="Description"
        info={editCourse.description}
        isEditing={isEditing}
        courseId={id}
        onSave={(field, value) => {
          setEditCourse((prev) => ({ ...prev, [field.toLowerCase()]: value }));
        }}
      />
*/}
      <ProductCard
        typeInfo="Posizione"
        info={editCourse.location}
        isEditing={isEditing}
        courseId={id}
        onSave={(field, value) => {
          setEditCourse((prev) => ({ ...prev, [field.toLowerCase()]: value }));
        }}
      />
    </Box>
  );
}
