import { Container, Divider, Grid, Typography } from "@mui/material";
import { useParams } from "react-router";
import PhysiotherapistInfo from "../components/physiotherapist/PhysiotherapistInfo";
import { usePhysiotherapistProfile } from "../hooks/usePhysiotherapistProfile";
import Hero from "../components/Hero/Hero";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "../components/course/CourseCard/CourseCard";
import Fade from "../components/animations/Fade";

export default function PhysiotherapistProfilePage() {
  const { id } = useParams();
  const { data, isLoading } = usePhysiotherapistProfile(id ?? "");
  const { get: getCourses } = useCourses({
    fetchAll: !!id,
    filters: { ownerId: id ?? "" },
    perPage: 100,
    page: 0,
  });

  return (
    <Fade>
      <Hero
        title="I nostri fisioterapisti"
        subtitle="Esplora le informazioni e i dettagli del professionista sanitario"
        backgroundImage="/hero.jpg"
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <PhysiotherapistInfo
              physiotherapist={data?.data}
              isLoading={isLoading}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 4 }}>
              <Typography variant="h6" color="text.secondary">
                I miei corsi in EasyMotion
              </Typography>
            </Divider>
          </Grid>

          {getCourses.data &&
            getCourses.data.map((course) => (
              <Grid size={{ xs: 12, md: 4 }} key={course.id}>
                <CourseCard key={course.id} course={course} />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Fade>
  );
}
