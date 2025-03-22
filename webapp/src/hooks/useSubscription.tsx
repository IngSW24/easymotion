import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@easymotion/auth-context";
import { useSnack } from "./useSnack";
import {
  SubscriptionCreateDto,
  SubscriptionDeleteDto,
} from "@easymotion/openapi";

export interface UseSubscriptionsProps {
  userId?: string;
  courseId?: string;
  page?: number;
  perPage?: number;
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
  const { userId, courseId, page = 0, perPage = 10 } = props;

  const { apiClient: api } = useApiClient();
  const snack = useSnack();
  const queryClient = useQueryClient();

  /**
   * Retrieves subscriptions for either:
   *  - the logged-in user (if userId is not provided), or
   *  - a specified user (if userId is provided).
   */
  const getUserSubscriptions = useQuery({
    queryKey: ["subscriptions", userId, page, perPage],
    queryFn: async () => {
      if (!userId) {
        const resp =
          await api.subscriptions.subscriptionsControllerGetSubscriptionsForLoggedUser(
            {
              page,
              perPage,
            }
          );
        return resp.data;
      } else {
        const resp =
          await api.subscriptions.subscriptionsControllerGetSubscriptionsForGivenUser(
            userId,
            { page, perPage }
          );
        return resp.data;
      }
    },
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
          { page, perPage }
        );
      return resp.data;
    },
    enabled: Boolean(courseId),
  });

  /**
   * Subscribes a user to a specific course.
   * @mutationFn SubscriptionsController.subscribe
   */
  const subscribe = useMutation({
    mutationFn: async (dto: SubscriptionCreateDto) => {
      return await api.subscriptions.subscriptionsControllerSubscribe(dto);
    },
    onSuccess: () => {
      // Invalidate queries so that data is refreshed
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-subscribers"],
      });
      snack.showSuccess("Successfully subscribed!");
    },
    onError: (error) => snack.showError(error),
  });

  /**
   * Unsubscribes a user from a specific course.
   * @mutationFn SubscriptionsController.unsubscribe
   */
  const unSubscribe = useMutation({
    mutationFn: async (dto: SubscriptionDeleteDto) => {
      return await api.subscriptions.subscriptionsControllerUnsubscribe(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-subscribers"],
      });
      snack.showSuccess("Successfully unsubscribed!");
    },
    onError: (error) => snack.showError(error),
  });

  return { getUserSubscriptions, getCourseSubscribers, subscribe, unSubscribe };
}
