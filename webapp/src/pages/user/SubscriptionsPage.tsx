import { Box, Grid2, Typography } from "@mui/material";
import useSubscriptions from "../../hooks/useSubscription";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import CourseCard from "../../components/course/CourseCard/CourseCard";
import { useAuth } from "@easymotion/auth-context";
import { CourseFilters } from "../../hooks/useCourses";

export interface SubsProp {
  filters?: CourseFilters;
}

export default function SubscriptionsPage(props: SubsProp) {
  const { filters } = props;
  const auth = useAuth();
  const subsRepo = useSubscriptions({
    filters,
    userId: auth.user?.id ?? "",
  });

  if (subsRepo.getSubscription.isError)
    return (
      <Typography align="center" variant="h2" display="block">
        Errore
      </Typography>
    );

  return (
    <>
      <Grid2
        container
        spacing={6}
        columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
      >
        {subsRepo.getSubscription.isError ? (
          <Typography align="center" variant="h2" display="block">
            Si è verificato un errore
          </Typography>
        ) : (
          <>
            {subsRepo.getSubscription.isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                {subsRepo.getSubscription.data?.data.length === 0 ? (
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      align="center"
                      variant="h6"
                      display="block"
                      textAlign="center"
                      fontWeight={400}
                    >
                      {
                        "Al momento non è disponibile alcun corso che soddisfi i criteri di ricerca"
                      }{" "}
                      &#x1F622;
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {subsRepo.getSubscription.data?.data.map((e) => (
                      <Grid2
                        key={e.id}
                        size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                      >
                        <CourseCard course={e} />
                      </Grid2>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Grid2>
    </>
  );
}
