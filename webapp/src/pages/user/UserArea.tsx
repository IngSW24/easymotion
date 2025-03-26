import { Container, Typography } from "@mui/material";
import SubscriptionsPage from "./SubscriptionList";
import FilterBlock from "../../components/course/FilterBlock/FilterBlock";
import { CourseFilters } from "../../components/course/FilterBlock/types";
import { useState } from "react";

export default function UserArea() {
  const [filters, setFilters] = useState<CourseFilters | undefined>(undefined);

  return (
    <>
      <Container maxWidth="xl" sx={{ p: 5 }}>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          align="center"
          fontWeight="bold"
          sx={{ m: 5 }}
        >
          I miei corsi
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
