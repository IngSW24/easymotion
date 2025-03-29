import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateCourseDto, UpdateCoursesDto } from "@easymotion/openapi";
import { CourseFilters } from "../components/course/FilterBlock/types";
import { useSnack } from "./useSnack";
import { useApiClient } from "@easymotion/auth-context";

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
  courseData: UpdateCoursesDto;
};

/**
 * Defines a hook that handles CRUD operations for courses
 * @param props a set of properties of type UseCoursesProps
 * @returns an object with the CRUD operations
 */
export const useCourses = (props: UseCoursesProps = {}) => {
  const {
    fetchId = "",
    page,
    perPage = 100,
    fetchAll,
    filters,
    ownerId,
  } = props;
  const { apiClient: api } = useApiClient();
  const snack = useSnack();
  const queryClient = useQueryClient();

  const get = useQuery({
    queryKey: ["courses", { page, perPage }, { filters }],
    queryFn: async () => {
      const response = await api.courses.coursesControllerFindAll({
        page,
        perPage,
      });
      const fullData = response.data.data;

      if (!filters) return fullData;

      const filteredData = fullData.filter((course) => {
        if (
          filters.searchText &&
          !course.name.toLowerCase().includes(filters.searchText.toLowerCase())
        )
          return false;

        if (
          filters.advanced.categories.length > 0 &&
          !filters.advanced.categories.includes(course.category)
        )
          return false;

        if (
          filters.advanced.levels.length > 0 &&
          !filters.advanced.levels.includes(course.level)
        )
          return false;

        if (
          filters.advanced.frequencies.length > 0 &&
          !filters.advanced.frequencies.includes(course.frequency)
        )
          return false;

        if (
          filters.advanced.availabilities.length > 0 &&
          !filters.advanced.availabilities.includes(course.availability)
        )
          return false;

        return true;
      });

      return filteredData;
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
