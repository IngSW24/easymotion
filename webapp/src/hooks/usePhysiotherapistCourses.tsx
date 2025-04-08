import { useApiClient, useAuth } from "@easymotion/auth-context";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UsePhysiotherapistCoursesProps {
  page?: number;
  perPage?: number;
}

export const usePhysiotherapistCourses = (
  props: UsePhysiotherapistCoursesProps
) => {
  const { page, perPage } = props;
  const { user } = useAuth();
  const { apiClient } = useApiClient();

  return useInfiniteQuery({
    queryKey: ["courses", "physio", user?.id, { page, perPage }],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const response =
        await apiClient.courses.coursesControllerFindAllForPhysiotherapist({
          page: pageParam,
          perPage,
        });

      const data = response.data.data;
      return { data, nextPage: pageParam + 1, meta: response.data.meta };
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.length === 0 ? undefined : lastPage.nextPage,
  });
};
