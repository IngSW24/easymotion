import { Box, Chip, Grid2, Stack, Typography } from "@mui/material";
import { CourseDto } from "@easymotion/openapi";
import ProductCard from "./ProductCard";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SubscribeButton from "../../../pages/user/SubscribeButton";
import { DateTime } from "luxon";
import { Euro, LocationOn, Person } from "@mui/icons-material";
import { getCourseLevelName } from "../../../data/course-levels";

export interface CourseDetailProps {
  course: CourseDto;
}

/**
 * Defines a react component that displays the details of a course and allows edits
 * @param props the properties for the component, including the course id
 * @returns a react component
 */
export default function CourseDetail(props: CourseDetailProps) {
  const { course } = props;

  return (
    <>
      <Grid2 container spacing={4}>
        <Grid2 container size={12} sx={{ mt: 2, mb: 3 }}>
          <Grid2
            size={{ xs: 12, md: 9 }}
            alignItems="center"
            textAlign={{ xs: "center", md: "start" }}
            order={{ xs: 2, md: 1 }}
          >
            <Stack spacing={3}>
              <Typography variant="h4" color="primary.dark" fontWeight={500}>
                {course.short_description}
              </Typography>
            </Stack>
          </Grid2>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Stack spacing={6}>
            <div>
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Descrizione
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                  {course.description}
                </Typography>
              </Box>
            </div>
            <div>
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Periodo di iscrizione
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                  {"Data inizio + data fine"}
                </Typography>
              </Box>
            </div>
            <div>
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Periodo di iscrizione
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                  {"Start date + end date"}
                </Typography>
              </Box>
            </div>
            <div>
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Programma
              </Typography>
              <Stack spacing={2} sx={{ mt: 3 }}>
                {course.sessions.map((item, index) => (
                  <Stack
                    key={`schedule-${index}`}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <EventAvailableOutlinedIcon
                      fontSize="large"
                      color="secondary"
                    />
                    <Typography component="div" variant="h5" letterSpacing={1}>
                      {DateTime.fromISO(item.start_time).toString()}
                      {DateTime.fromISO(item.end_time).toString()}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </div>
            <div>
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Durata di ogni sessione
              </Typography>
            </div>
            <div>
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Tags
              </Typography>
              <Grid2 container spacing={2} sx={{ mt: 3 }}>
                {course.tags?.map((item, index) => (
                  <Grid2 key={`tag-${index}`}>
                    <Chip
                      label={
                        <Typography
                          component="div"
                          variant="h6"
                          letterSpacing={1}
                        >
                          {item}
                        </Typography>
                      }
                      color="primary"
                      variant="outlined" // Optional: Makes the chip outlined
                    />
                  </Grid2>
                ))}
              </Grid2>
            </div>
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Product Card (dx screen) */}

            <ProductCard
              title="Istruttori"
              value={course.instructors?.join(", ") ?? ""}
              icon={<Person sx={{ fontSize: 48, color: "secondary.dark" }} />}
            />

            <ProductCard
              title="Posizione"
              value={course.location?.toString() ?? ""}
              icon={
                <LocationOn sx={{ fontSize: 48, color: "secondary.dark" }} />
              }
            />

            <ProductCard
              title="Costo"
              value={course.price?.toString() ?? ""}
              icon={<Euro sx={{ fontSize: 48, color: "secondary.dark" }} />}
            />

            <ProductCard title="Categoria" value={course.category.name} />

            <ProductCard
              title="Livello"
              value={getCourseLevelName(course.level)}
            />
          </Stack>
          <Grid2
            size={12}
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}
          >
            <SubscribeButton />
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  );
}
