import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Courses } from "../../client/Courses";
import { CreateCourseDto, UpdateCoursesDto } from "../../client/data-contracts";
import { CourseFilters } from "../components/course/FilterBlock/types";

const api = new Courses({
  baseUrl: import.meta.env.VITE_API_URL,
});

type UseCoursesProps = {
  fetchId?: string;
  page?: number;
  perPage?: number;
  fetchAll?: boolean;
  filters?: CourseFilters;
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
    page = 0,
    perPage = 100,
    fetchAll = fetchId === "",
    filters,
  } = props;
  const queryClient = useQueryClient();

  const get = useQuery({
    queryKey: ["courses", { page, perPage }, { filters }],
    queryFn: async () => {
      const response = await api.coursesControllerFindAll({ page, perPage });
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

  const getSingle = useQuery({
    queryKey: ["courses", { fetchId }],
    queryFn: async () => {
      const response = await api.coursesControllerFindOne(fetchId);
      return response.data;
    },
    enabled: fetchId !== "",
  });

  const update = useMutation({
    mutationFn: async ({ courseId, courseData }: UpdateMutationParams) => {
      const response = await api.coursesControllerUpdate(courseId, courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });

  const create = useMutation({
    mutationFn: async (courseData: CreateCourseDto) => {
      console.log("here");
      const response = await api.coursesControllerCreate(courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.coursesControllerRemove(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });

  return { get, getSingle, update, remove, create };
};
