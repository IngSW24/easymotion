import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Courses } from "../../client/Courses";
import {
  CourseEntity,
  CreateCourseDto,
  UpdateCoursesDto,
} from "../../client/data-contracts";

const api = new Courses({
  baseUrl: import.meta.env.VITE_API_URL,
});

type UseCoursesProps = {
  id?: string;
  page?: number;
  perPage?: number;
  initialFetch?: boolean;
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
  const { id = "", page = 0, perPage = 100, initialFetch = true } = props;
  const queryClient = useQueryClient();

  const get = useQuery({
    queryKey: ["courses", { page, perPage }],
    queryFn: async () => {
      const response = await api.coursesControllerFindAll({ page, perPage });
      return response.data.data;
    },
    enabled: initialFetch,
  });

  const getSingle = useQuery({
    queryKey: ["courses", { page, perPage }, id],
    queryFn: async () => {
      const response = await api.coursesControllerFindOne(id);
      return response.data;
    },
    enabled: initialFetch && id !== "",
  });

  const update = useMutation({
    mutationFn: async ({ courseId, courseData }: UpdateMutationParams) => {
      const response = await api.coursesControllerUpdate(courseId, courseData);
      return response.data;
    },
    onSuccess: (updatedCourse: CourseEntity) => {
      queryClient.setQueryData(
        ["courses", { page, perPage }, id],
        updatedCourse
      );

      queryClient.setQueryData(
        ["courses", { page, perPage }],
        (old: CourseEntity[]) =>
          old.map((course) => (course.id === id ? updatedCourse : course))
      );
    },
  });

  const create = useMutation({
    mutationFn: async (courseData: CreateCourseDto) => {
      const response = await api.coursesControllerCreate(courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses", { page, perPage }],
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.coursesControllerRemove(id);
      return id;
    },
    onSuccess: (id: string) => {
      queryClient.setQueryData(
        ["courses", { page, perPage }],
        (old: CourseEntity[]) => old.filter((course) => course.id !== id)
      );

      queryClient.invalidateQueries({
        queryKey: ["courses", { page, perPage }, id],
      });
    },
  });

  return { get, getSingle, update, remove, create };
};
