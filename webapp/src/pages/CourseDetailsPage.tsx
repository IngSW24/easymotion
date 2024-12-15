import { Link, useParams } from "react-router";
import { Box, Button } from "@mui/material";
import CourseDetail from "../components/course/CourseDetail/CourseDetail";

/**
 * Defines the page to view and edit details of a course
 * @returns a react component
 */
export default function CourseDetailsPage() {
  const { id } = useParams();

  return (
    <Box>
      <Button>
        <Link to={"/"}>HOME</Link>
      </Button>

      <CourseDetail id={id ?? ""} />
    </Box>
  );
}
