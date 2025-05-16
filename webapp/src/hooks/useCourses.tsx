import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@easymotion/auth-context";

export type CourseFilters = {
  searchText?: string;
  categories?: string[];
  level?: string;
  ownerId?: string;
};

type UseCoursesProps = {
  fetchId?: string;
  page?: number;
  perPage?: number;
  fetchAll?: boolean;
  filters?: CourseFilters;
  ownerId?: string;
};

/**
 * Defines a hook that handles CRUD operations for courses
 * @param props a set of properties of type UseCoursesProps
 * @returns an object with the CRUD operations
 */
export const useCourses = (props: UseCoursesProps = {}) => {
  const { fetchId = "", page = 0, perPage = 100, fetchAll, filters } = props;
  const { apiClient: api } = useApiClient();

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
        ...(filters?.ownerId && { ownerId: filters.ownerId }),
      });

      return response.data.data;
    },
    enabled: fetchAll,
  });

  const getSingle = useQuery({
    queryKey: ["courses", { fetchId }],
    queryFn: async () => {
      const response = await api.courses.coursesControllerFindOne(fetchId);
      return response.data;
    },
    enabled: fetchId !== "",
  });

  return { get, getSingle };
};
