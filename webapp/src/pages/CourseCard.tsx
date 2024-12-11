import { Card, CardContent, Button } from "@mui/material";
import { useState } from "react";
import { CourseEntity, UpdateCoursesDto } from "../../client/data-contracts";

interface CourseCardProps {
  course: CourseEntity;
  onEdit: (updatedCourse: UpdateCoursesDto) => void;
}

function CourseCard({ course, onEdit }: CourseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(course);

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

export default CourseCard;
