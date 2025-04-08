import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateCourseDto, UpdateCourseDto } from "@easymotion/openapi";
import { useSnack } from "./useSnack";
import { useApiClient } from "@easymotion/auth-context";

export type CourseFilters = {
  searchText?: string;
  categories?: string[];
  level?: string;
};

type UseCoursesProps = {
  fetchId?: string;
  page?: number;
  perPage?: number;
  fetchAll?: boolean;
  filters?: CourseFilters;
  ownerId?: string;
};

type UpdateMutationParams = {
  courseId: string;
  courseData: UpdateCourseDto;
};

/**
 * Defines a hook that handles CRUD operations for courses
 * @param props a set of properties of type UseCoursesProps
 * @returns an object with the CRUD operations
 */
export const useCourses = (props: UseCoursesProps = {}) => {
  const {
    fetchId = "",
    page = 0,
    perPage = 100,
    fetchAll,
    filters,
    ownerId,
  } = props;
  const { apiClient: api } = useApiClient();
  const snack = useSnack();
  const queryClient = useQueryClient();

  const get = useQuery({
    queryKey: ["courses", { page, perPage, ...filters }],
    queryFn: async () => {
      const response = await api.courses.coursesControllerFindAll({
        page,
        perPage,
        ...(filters?.searchText && { searchText: filters.searchText }),
        ...(filters?.categories && {
          categoryIds: filters?.categories?.join(","),
        }),
        ...(filters?.level && { level: filters.level }),
      });

      return response.data.data;
    },
    enabled: fetchAll,
  });

  const getPhysiotherapist = useInfiniteQuery({
    queryKey: ["courses", { ownerId, perPage }],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.courses.coursesControllerFindAll({
        page: pageParam,
        perPage,
        ownerId,
      });

      const data = response.data.data;
      return { data, nextPage: pageParam + 1, meta: response.data.meta };
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.length === 0 ? undefined : lastPage.nextPage,
    enabled: !!ownerId,
  });

  const getSingle = useQuery({
    queryKey: ["courses", { fetchId }],
    queryFn: async () => {
      const response = await api.courses.coursesControllerFindOne(fetchId);
      return response.data;
    },
    enabled: fetchId !== "",
  });

  const update = useMutation({
    mutationFn: async ({ courseId, courseData }: UpdateMutationParams) => {
      const response = await api.courses.coursesControllerUpdate(
        courseId,
        courseData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
    onError: (error) => snack.showError(error),
  });

  const create = useMutation({
    mutationFn: async (courseData: CreateCourseDto) => {
      const response = await api.courses.coursesControllerCreate(courseData);
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
      await api.courses.coursesControllerRemove(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
    onError: (error) => snack.showError(error),
  });

  return { get, getPhysiotherapist, getSingle, update, remove, create };
};
