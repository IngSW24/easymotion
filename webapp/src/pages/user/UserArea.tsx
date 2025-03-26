import { Container, Typography } from "@mui/material";
import UserHeader from "../../components/Layout/headers/UserHeaders";
import SubscriptionsPage from "./SubscriptionList";
import FilterBlock from "../../components/course/FilterBlock/FilterBlock";
import { CourseFilters } from "../../components/course/FilterBlock/types";
import { useState } from "react";

export default function UserArea() {
  const [filters, setFilters] = useState<CourseFilters | undefined>(undefined);

  return (
    <>
      <UserHeader></UserHeader>
      <Container maxWidth="xl" sx={{ p: 5 }}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          align="center"
          fontWeight="bold"
          sx={{ marginBottom: 4, marginTop: 10 }}
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
