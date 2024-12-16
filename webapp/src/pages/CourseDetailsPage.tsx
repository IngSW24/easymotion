import { useParams } from "react-router";
import { Box } from "@mui/material";
import CourseDetail from "../components/course/CourseDetail/CourseDetail";

/**
 * Defines the page to view and edit details of a course
 * @returns a react component
 */
export default function CourseDetailsPage() {
  const { id } = useParams();

  return (
    <Box>
      <CourseDetail id={id ?? ""} />
    </Box>
  );
}
