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
import LaunchIcon from "@mui/icons-material/Launch";
import { Link } from "react-router";
import { courseLevels } from "../../../data/course-levels";
import { CourseDto } from "@easymotion/openapi";
import { getCourseImageUrl } from "../../../utils/format";
import { useState } from "react";

export interface CourseCardProps {
  course: CourseDto;
}

const getLabel = (value: string, options: LiteralUnionDescriptor<string>) =>
  options.find((o) => o.value === value)?.label ?? value;

/**
 * Card displaying information about a course
 * @param props properties for the card
 * @returns a react component
 */
export default function CourseCard(props: CourseCardProps) {
  const { course } = props;
  const [imageUrl, setImageUrl] = useState(getCourseImageUrl({ course }));

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
        component="img"
        image={imageUrl}
        onError={() => setImageUrl("/hero.jpg")}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          padding: 2,
        }}
      >
        <Typography variant="body1" fontWeight="fontWeightBold" color="primary">
          <span>{course.category.name}</span> {" · "}
          <span>{getLabel(course.level, courseLevels)}</span>
        </Typography>
        <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
          {course.name}
        </Typography>
        <Typography variant="body1">{course.shortDescription}</Typography>
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
          <Chip key={tag} label={tag} variant="outlined" color="primary" />
        ))}
      </Stack>
      <CardActions sx={{ justifyContent: "right", paddingX: 2 }}>
        <Button
          startIcon={<LaunchIcon />}
          component={Link}
          variant="contained"
          to={"/details/" + course.id}
        >
          Scopri
        </Button>
      </CardActions>
    </Card>
  );
}
