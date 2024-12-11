import { Card, CardActions, CardContent, Button } from "@mui/material";
import { Link } from "react-router";
import { CourseEntity } from "../../client/data-contracts";

/**
 * This is an course card, which shows information about an course.
 * This is supposed to be shown in a grid
 */
export default function CourseCard({
  course,
  onDeleteClick,
}: {
  course: CourseEntity;
  onDeleteClick: () => void;
}) {
  return (
    <Card>
      <CardContent>
        <div>
          <ul>
            <li>Organizer: {course.organizer}</li>
            <li>Instructor: {course.instructor}</li>
            <li>Type: {course.type}</li>
            <li>Description: {course.description}</li>
            <li>Location: {course.location}</li>
            <li>Frequency: {course.frequency}</li>
            <li>Times: {course.times}</li>
            <li>Cost: {course.cost}</li>
          </ul>
        </div>
      </CardContent>
      <CardActions>
        <Button size="small">
          <Link to={"/details/" + course.id}>Learn more</Link>
        </Button>
        <Button size="small" onClick={onDeleteClick}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
