import {
  Card,
  CardContent,
  Typography,
  Box,
  CardMedia,
  Stack,
  Chip,
} from "@mui/material";
import { SearchResultDto } from "@easymotion/openapi";
import { Link } from "react-router";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";

interface CourseSearchResultProps {
  course: SearchResultDto["courses"][number];
  onResultClick: () => void;
}

export default function CourseSearchResult({
  course,
  onResultClick,
}: CourseSearchResultProps) {
  return (
    <Card
      component={Link}
      to={`/details/${course.id}`}
      onClick={onResultClick}
      sx={{
        textDecoration: "none",
        height: "100%",
        display: "flex",
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <Box sx={{ display: "flex", width: "100%" }}>
        {course.imagePath && (
          <CardMedia
            component="img"
            sx={{ width: 140, objectFit: "cover" }}
            image={course.imagePath}
            alt={course.name}
          />
        )}
        <CardContent sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            {course.name}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip
              icon={<CategoryIcon />}
              label={course.categoryName}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<PeopleIcon />}
              label={`${course.subscriptionCount} iscritti`}
              size="small"
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}
