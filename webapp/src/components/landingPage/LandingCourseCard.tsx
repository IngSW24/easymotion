import { CourseDto } from "@easymotion/openapi";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link as MuiLink,
} from "@mui/material";

export interface CourseCardProps {
  course: CourseDto;
}

export default function LandingCourseCard(props: CourseCardProps) {
  const { course } = props;

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        width: 350,
        height: 375,
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <CardMedia
        component="img"
        image={`/${course.category.id}.jpg`}
        alt={course.name}
        sx={{
          height: 150,
        }}
      />

      <CardContent
        sx={{
          padding: 3,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            color="primary"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: 56,
              mb: 1,
            }}
          >
            {course.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: 63,
            }}
          >
            {course.short_description}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <MuiLink
            href={"details/" + course.id}
            underline="hover"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              display: "block",
            }}
          >
            {"scopri di più →"}
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
}
