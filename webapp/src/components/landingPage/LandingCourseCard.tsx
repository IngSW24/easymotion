import { CourseEntity } from "@easymotion/openapi";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link as MuiLink,
} from "@mui/material";

export interface CourseCardProps {
  course: CourseEntity;
}

export default function LandingCourseCard(props: CourseCardProps) {
  const { course } = props;

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        maxWidth: 380,
        margin: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <CardMedia
        component="img"
        image={`/${course.category.toLowerCase()}.jpg`}
        alt={course.name}
        sx={{
          height: 200,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />

      <CardContent
        sx={{
          padding: 3,
          flexGrow: 1,
        }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {course.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course.short_description}
          </Typography>
        </Box>

        <MuiLink
          href={"details/" + course.id}
          underline="hover"
          sx={{
            color: "primary.main",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          scopri di più →
        </MuiLink>
      </CardContent>
    </Card>
  );
}
