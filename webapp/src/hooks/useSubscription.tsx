import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@easymotion/auth-context";
import { useSnack } from "./useSnack";
import {
  SubscriptionCreateDto,
  SubscriptionDeleteDto,
  SubscriptionRequestDto,
} from "@easymotion/openapi";
import { CourseFilters } from "./useCourses";

export interface UseSubscriptionsProps {
  userId?: string;
  courseId?: string;
  page?: number;
  perPage?: number;
  filters?: CourseFilters;
  fetchAll?: boolean;
}

/**
 * Provides React Query hooks to:
 *  - Fetch subscriptions for the logged user or a specific user
 *  - Fetch subscribers for a given course
 *  - Subscribe/unsubscribe a user to/from a course
 *
 * @param {UseSubscriptionsProps} props - Configuration options for fetching subscriptions
 * @returns {object} An object containing:
 *  - **getUserSubscriptions** (useQuery): retrieves user subscriptions
 *  - **getCourseSubscribers** (useQuery): retrieves course subscribers
 *  - **subscribe** (useMutation): subscribes a user to a course
 *  - **unsubscribe** (useMutation): unsubscribes a user from a course
 */
export default function useSubscriptions(props: UseSubscriptionsProps) {
  const {
    userId = "",
    courseId = "",
    page = 0,
    perPage = 10,
    fetchAll = courseId === "",
    filters,
  } = props;

  const { apiClient: api } = useApiClient();
  const snack = useSnack();
  const queryClient = useQueryClient();

  /**
   * Retrieves subscriptions for either:
   *  - the logged-in user (if userId is not provided), or
   *  - a specified user (if userId is provided).
   */
  const getUserSubscriptions = useQuery({
    queryKey: ["userSubscriptions", userId, page, perPage],
    queryFn: async () => {
      const resp =
        await api.subscriptions.subscriptionsControllerGetSubscriptionsForLoggedUser(
          {
            pending: "false",
            page,
            perPage,
          }
        );
      return resp.data;
    },
  });

  const getUserPendingSubscriptions = useQuery({
    queryKey: ["userPendingSubscriptions", page, perPage],
    queryFn: async () => {
      const resp =
        await api.subscriptions.subscriptionsControllerGetSubscriptionsForLoggedUser(
          {
            pending: "true",
            page,
            perPage,
          }
        );
      return resp.data;
    },
  });

  const getPendingCourseSubscriptions = useQuery({
    queryKey: ["pendingSubscriptions", courseId, page, perPage],
    queryFn: async () => {
      const result =
        await api.subscriptions.subscriptionsControllerGetPendingSubscribers(
          courseId,
          { page, perPage }
        );

      return result.data;
    },
    enabled: !!courseId,
  });

  /**
   * Retrieves the subscribers of a specific course (if courseId is provided).
   */
  const getCourseSubscribers = useQuery({
    queryKey: ["course-subscribers", courseId, page, perPage],
    queryFn: async () => {
      if (!courseId) return null;
      const resp =
        await api.subscriptions.subscriptionsControllerGetSubscribers(
          courseId,
          { page, perPage, pending: "false" }
        );
      return resp.data;
    },
    enabled: Boolean(courseId),
  });

  /**
   * Subscribes a user to a specific course.
   * @mutationFn SubscriptionsController.subscribe
   */
  const request2Subscribe = useMutation({
    mutationFn: async (dto: SubscriptionRequestDto) => {
      return await api.subscriptions.subscriptionsControllerSendSubscriptionRequest(
        dto
      );
    },
    onSuccess: () => {
      // Invalidate queries so that data is refreshed
      queryClient.invalidateQueries({
        queryKey: [
          "subscriptions",
          "course-subscribers",
          "pendingSubscriptions",
        ],
      });
      snack.showSuccess("Richiesta di iscrizione inviata!");
    },
    onError: (error) => snack.showError(error),
  });

  /**
   * Subscribes a user to a specific course.
   * @mutationFn SubscriptionsController.subscribe
   */
  const subscribePhysio = useMutation({
    mutationFn: async (dto: SubscriptionCreateDto) => {
      return await api.subscriptions.subscriptionsControllerSubscribeGivenUser(
        dto
      );
    },
    onSuccess: () => {
      // Invalidate queries so that data is refreshed
      queryClient.invalidateQueries({
        queryKey: [
          "subscriptions",
          "course-subscribers",
          "pendingSubscriptions",
        ],
      });
      snack.showSuccess("Iscrizione avvenuta con successo!");
    },
    onError: (error) => snack.showError(error),
  });

  /**
   * Unsubscribes a user from a specific course.
   * @mutationFn SubscriptionsController.unsubscribe
   */
  const unSubscribe = useMutation({
    mutationFn: async (dto: SubscriptionDeleteDto) => {
      return await api.subscriptions.subscriptionsControllerUnsubscribeGivenUser(
        dto
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "course-subscribers"],
      });
      snack.showSuccess("Disiscrizione avvenuta con successo!");
    },
    onError: (error) => snack.showError(error),
  });

  const getSubscription = useQuery({
    queryKey: !filters
      ? ["courses", { page, perPage }]
      : ["courses", { page, perPage }, { filters }],
    queryFn: async () => {
      const response =
        await api.courses.coursesControllerFindSubscribedCoursesForUserId(
          userId,
          {
            page,
            perPage,
            ...(filters?.searchText && { searchText: filters.searchText }),
            ...(filters?.categories &&
              filters?.categories.length > 0 && {
                categoryIds: filters?.categories?.join(","),
              }),
            ...(filters?.level && { level: filters.level }),
          }
        );
      return response.data;
    },
    enabled: fetchAll,
  });

  return {
    getUserSubscriptions,
    getUserPendingSubscriptions,
    getCourseSubscribers,
    getPendingCourseSubscriptions,
    request2Subscribe,
    subscribePhysio,
    unSubscribe,
    getSubscription,
  };
}
