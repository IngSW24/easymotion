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
 *  - Handle pending subscription requests
 *
 * @param {UseSubscriptionsProps} props - Configuration options for fetching subscriptions
 * @returns {object} An object containing hooks for subscription management
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
   * Retrieves active subscriptions for the logged-in user
   */
  const getUserSubscriptions = useQuery({
    queryKey: ["userSubscriptions", userId, page, perPage],
    queryFn: async () => {
      const resp =
        await api.subscriptions.subscriptionsControllerGetSubscriptionsForLoggedUser(
          {
            page,
            perPage,
          }
        );
      return resp.data;
    },
  });

  /**
   * Retrieves pending subscription requests for the logged-in user
   */
  const getUserPendingSubscriptions = useQuery({
    queryKey: ["userPendingSubscriptions", page, perPage],
    queryFn: async () => {
      const resp =
        await api.subscriptions.subscriptionsControllerGetPendingSubscriptionsForLoggedUser(
          {
            page,
            perPage,
          }
        );
      return resp.data;
    },
  });

  /**
   * Retrieves pending subscription requests for a specific course
   */
  const getPendingCourseSubscriptions = useQuery({
    queryKey: ["pendingSubscriptions", courseId, page, perPage],
    queryFn: async () => {
      const result =
        await api.subscriptions.subscriptionsControllerGetPendingSubscribersForCourse(
          courseId,
          { page, perPage }
        );

      return result.data;
    },
    enabled: !!courseId,
  });

  /**
   * Retrieves active subscribers for a specific course
   */
  const getCourseSubscribers = useQuery({
    queryKey: ["course-subscribers", courseId, page, perPage],
    queryFn: async () => {
      if (!courseId) return null;
      const resp =
        await api.subscriptions.subscriptionsControllerGetSubscribersForCourse(
          courseId,
          { page, perPage }
        );
      return resp.data;
    },
    enabled: Boolean(courseId),
  });

  /**
   * Sends a subscription request for approval
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
        queryKey: ["userPendingSubscriptions", "pendingSubscriptions"],
      });
      snack.showSuccess("Richiesta di iscrizione inviata!");
    },
    onError: (error) => snack.showError(error),
  });

  /**
   * Creates a direct subscription for a user (admin/physiotherapist action)
   */
  const subscribePhysio = useMutation({
    mutationFn: async (dto: SubscriptionCreateDto) => {
      return await api.subscriptions.subscriptionsControllerCreateSubscription(
        dto
      );
    },
    onSuccess: () => {
      // Invalidate queries so that data is refreshed
      queryClient.invalidateQueries({
        queryKey: ["userSubscriptions", "course-subscribers"],
      });
      snack.showSuccess("Iscrizione avvenuta con successo!");
    },
    onError: (error) => snack.showError(error),
  });

  /**
   * Accepts a pending subscription request (admin/physiotherapist action)
   */
  const acceptSubscriptionRequest = useMutation({
    mutationFn: async (dto: SubscriptionCreateDto) => {
      return await api.subscriptions.subscriptionsControllerAcceptSubscriptionRequest(
        dto
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "pendingSubscriptions",
          "userPendingSubscriptions",
          "userSubscriptions",
          "course-subscribers",
        ],
      });
      snack.showSuccess("Richiesta di iscrizione accettata!");
    },
    onError: (error) => snack.showError(error),
  });

  /**
   * Unsubscribes a user from a specific course
   */
  const unsubscribe = useMutation({
    mutationFn: async (dto: SubscriptionDeleteDto) => {
      return await api.subscriptions.subscriptionsControllerDeleteSubscription(
        dto
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userSubscriptions", "course-subscribers"],
      });
      snack.showSuccess("Disiscrizione avvenuta con successo!");
    },
    onError: (error) => snack.showError(error),
  });

  /**
   * Retrieves courses that a user is subscribed to
   */
  const getSubscription = useQuery({
    queryKey: !filters
      ? ["courses", userId, { page, perPage }]
      : ["courses", userId, { page, perPage }, { filters }],
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
    enabled: fetchAll && !!userId,
  });

  return {
    getUserSubscriptions,
    getUserPendingSubscriptions,
    getCourseSubscribers,
    getPendingCourseSubscriptions,
    request2Subscribe,
    subscribePhysio,
    acceptSubscriptionRequest,
    unsubscribe,
    getSubscription,
  };
}
