import { Fragment, useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { Grid2, Typography } from "@mui/material";
import { deleteCourse } from "../components/DeleteButton";
import DeleteDialog from "../components/DeleteDialog";
import { Courses } from "../../client/Courses";

const api = new Courses({
  baseUrl: import.meta.env.VITE_API_URL,
});

type PaginatedCourse = Awaited<ReturnType<typeof api.coursesControllerFindAll>>;

/**
 * Course page, which shows a grid of courses
 * @returns a react component
 */
export default function CoursesPage() {
  const [courses, setCourses] = useState<PaginatedCourse | null>(null);

  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = () => {
      return api.coursesControllerFindAll();
    };

    fetchCourses().then((d) => setCourses(d));
  }, []);

  const onCardDeleteClick = (id: string) => setId(id);

  if (!courses) {
    return (
      <Typography align="center" variant="h2" display="block">
        Loading...
      </Typography>
    );
  }

  if (courses.data.data.length === 0) {
    return (
      <Typography align="center" variant="h2" display="block">
        No elements found
      </Typography>
    );
  }

  return (
    <Fragment>
      <Grid2 container spacing={6}>
        {courses.data.data.map((e) => (
          <Grid2 key={e.id}>
            <CourseCard
              course={e}
              onDeleteClick={() => onCardDeleteClick(e.id)}
            />
          </Grid2>
        ))}
      </Grid2>
      <DeleteDialog
        id={id}
        handleCloseAnnulla={() => setId(null)}
        handleCloseCancella={() => deleteCourse(id)}
      />
    </Fragment>
  );
}
