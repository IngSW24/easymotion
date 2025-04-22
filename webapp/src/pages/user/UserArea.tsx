import { Container, Typography } from "@mui/material";
import FilterBlock from "../../components/course/FilterBlock/FilterBlock";
import { useState } from "react";
import { CourseFilters } from "../../hooks/useCourses";
import SubscriptionsPage from "./MyCourses";

export default function UserArea() {
  const [filters, setFilters] = useState<CourseFilters | undefined>(undefined);

  return (
    <>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h3"
          align="left"
          fontWeight="bold"
          sx={{ paddingTop: 5, paddingLeft: 5, textAlign: "center" }}
        >
          I Miei Corsi
        </Typography>
        <Typography
          variant="h5"
          component="h5"
          align="left"
          sx={{ paddingTop: 2, paddingLeft: 5, textAlign: "center" }}
        >
          Visualizza e gestisci i corsi a cui sei iscritto
        </Typography>
        <FilterBlock
          filters={filters}
          onChange={(filters: CourseFilters) => setFilters(filters)}
        />
        <SubscriptionsPage filters={filters}></SubscriptionsPage>
      </Container>
    </>
  );
}
