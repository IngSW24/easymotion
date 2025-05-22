import { useApiClient, useAuth } from "@easymotion/auth-context";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSnack } from "./useSnack";
import { CreateCourseDto, UpdateCourseDto } from "@easymotion/openapi";

export interface UsePhysiotherapistCoursesProps {
  perPage?: number;
  fetch?: boolean;
}

type UpdateMutationParams = {
  courseId: string;
  courseData: UpdateCourseDto;
};

export const usePhysiotherapistCourses = (
  props: UsePhysiotherapistCoursesProps
) => {
  const queryClient = useQueryClient();
  const { perPage = 10 } = props;
  const { user } = useAuth();
  const snack = useSnack();
  const { apiClient } = useApiClient();

  const getAll = useInfiniteQuery({
    queryKey: ["courses", "physio", user?.id, { perPage }],
    initialPageParam: 0,
    enabled: props.fetch ?? true,
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

  const update = useMutation({
    mutationFn: async ({ courseId, courseData }: UpdateMutationParams) => {
      const response = await apiClient.courses.coursesControllerUpdate(
        courseId,
        courseData
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["courses", "physio"],
      });
    },
    onError: (error) => snack.showError(error),
  });

  const create = useMutation({
    mutationFn: async (courseData: CreateCourseDto) => {
      const response =
        await apiClient.courses.coursesControllerCreate(courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
    onError: (error) => snack.showError(error),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.courses.coursesControllerRemove(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
    onError: (error) => snack.showError(error),
  });

  return { getAll, update, create, remove };
};
