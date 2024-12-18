import {
  Card,
  CardActions,
  CardContent,
  Button,
  CardMedia,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { Delete, Launch } from "@mui/icons-material";
import { Link } from "react-router";
import { CourseEntity } from "../../../../client/data-contracts";

export interface CourseCardProps {
  course: CourseEntity;
  canEdit?: boolean;
  onDelete: (id: string) => void;
}

/**
 * Card displaying information about a course
 * @param props properties for the card
 * @returns a react component
 */
export default function CourseCard(props: CourseCardProps) {
  const { course, canEdit = false, onDelete } = props;
  return (
    <Card>
      <CardMedia
        sx={{ height: 180 }}
        image="https://wallpapers.com/images/hd/1920-x-1080-hd-1qq8r4pnn8cmcew4.jpg"
      />
      <CardContent>
        <Typography variant="body1" fontWeight="fontWeightBold" color="primary">
          <span>{course.category}</span> · <span>{course.level}</span>
        </Typography>
        <Typography variant="h5" fontWeight="fontWeightBold">
          {course.name}
        </Typography>
        <Typography variant="body1">{course.short_description}</Typography>
        <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
          {course.tags.map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" color="secondary" />
          ))}
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "right" }}>
        {canEdit && (
          <Button
            startIcon={<Delete />}
            color="error"
            onClick={() => onDelete(course.id)}
          >
            Delete
          </Button>
        )}
        <Button
          startIcon={<Launch />}
          component={Link}
          variant="contained"
          to={"details/" + course.id}
        >
          Learn more
        </Button>
      </CardActions>
    </Card>
  );
}
