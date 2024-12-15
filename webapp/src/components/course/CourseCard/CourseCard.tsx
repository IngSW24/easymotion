import { Card, CardActions, CardContent, Button } from "@mui/material";
import { Link } from "react-router";
import { CourseEntity } from "../../../../client/data-contracts";

export interface CourseCardProps {
  course: CourseEntity;
  onDelete: (id: string) => void;
}

/**
 * Card displaying information about a course
 * @param props properties for the card
 * @returns a react component
 */
export default function CourseCard(props: CourseCardProps) {
  const { course, onDelete } = props;
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
        <Button size="small" onClick={() => onDelete(course.id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
