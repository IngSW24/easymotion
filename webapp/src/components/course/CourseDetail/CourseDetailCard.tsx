import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, Typography, Box, TextField } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useCourses } from "../../../hooks/useCourses";
import { useSnack } from "../../../hooks/useSnack";
import { UpdateCoursesDto } from "../../../../client/data-contracts";
import { defaultCourse } from "../../../data/defaults";

interface ProductCardProps {
  typeInfo: string; // Indicates the label of each information, e.g., organizer, time, ...
  info: string; // Indicates the related information
  id: string;
  isEditing: boolean; // External control for edit mode
}

/**
 * Creates the ProductCard
 * @param {string} typeInfo - The label of the information to determine the icon
 * @param {string} info - The actual information to display
 * @param {string} courseId - The ID of the course
 * @param {boolean} isEditing - Determines if the component is in edit mode
 * @returns A card showing the course information with an appropriate icon
 */
const ProductCard: React.FC<ProductCardProps> = ({
  typeInfo,
  info,
  id,
  isEditing,
}) => {
  const courses = useCourses({ fetchId: id });
  const singleCourse = courses.getSingle;
  const [editCourse, setEditCourse] = useState<UpdateCoursesDto>(
    courses.getSingle.data ?? defaultCourse
  );
  const [hasChanged, setHasChanged] = useState(false);
  const snack = useSnack();

  useMemo(() => {
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

  /**
  if (singleCourse.isLoading)
    return <Typography variant="h4">Loading...</Typography>;

  if (singleCourse.error || !singleCourse.data)
    return <Typography variant="h4">An error occurred</Typography>;
  */

  // This function returns the icon depending on the information type
  const getIcon = (type: string) => {
    switch (type) {
      case "Organizzatore":
        return (
          <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "#5c6bc0" }} />
        );
      case "Appuntamenti":
        return <AccessTimeIcon sx={{ fontSize: 48, color: "#5c6bc0" }} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: 500,
      }}
    >
      <Box sx={{ marginRight: 2 }}>{getIcon(typeInfo)}</Box>

      <CardContent sx={{ padding: "0", marginTop: 1, flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {typeInfo}
        </Typography>
        {isEditing ? (
          <Box>
            <TextField
              label="Information"
              name="information"
              value={editCourse.organizer}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
        ) : (
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", marginBottom: "8px" }}
          >
            {info}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;

{
  /**<ProductCard typeInfo="Appuntamenti" info="Pittis Matteo"></ProductCard>*/
}
