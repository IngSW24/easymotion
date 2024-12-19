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
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        maxWidth: 360,
        margin: "auto",
      }}
    >
      <CardMedia
        sx={{ height: 180 }}
        image="https://wallpapers.com/images/hd/1920-x-1080-hd-1qq8r4pnn8cmcew4.jpg"
      />
      <CardContent
        sx={{
          flexGrow: 1,
          padding: 2,
        }}
      >
        <Typography variant="body1" fontWeight="fontWeightBold" color="primary">
          <span>{course.category}</span> · <span>{course.level}</span>
        </Typography>
        <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
          {course.name}
        </Typography>
        <Typography variant="body1">{course.short_description}</Typography>
      </CardContent>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          margin: 2,
          flexWrap: "wrap",
          rowGap: 1,
        }}
      >
        {course.tags.map((tag) => (
          <Chip key={tag} label={tag} variant="outlined" color="secondary" />
        ))}
      </Stack>
      <CardActions sx={{ justifyContent: "right", paddingX: 2 }}>
        {canEdit && (
          <Button
            startIcon={<Delete />}
            color="error"
            onClick={() => onDelete(course.id)}
          >
            Elimina
          </Button>
        )}
        <Button
          startIcon={<Launch />}
          component={Link}
          variant="contained"
          to={"details/" + course.id}
        >
          Scopri
        </Button>
      </CardActions>
    </Card>
  );
}
