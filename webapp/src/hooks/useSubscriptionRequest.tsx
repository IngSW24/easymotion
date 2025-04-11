import { useApiClient } from "@easymotion/auth-context";
import { useSnack } from "./useSnack";
import { useQueryClient } from "@tanstack/react-query";

export interface UseSubscriptionRequestProps {
  userId?: string;
  courseId?: string;
  motivationalNote?: string;
  status?: string;
}

export const useSubscriptionRequestProps = (
  props: UseSubscriptionRequestProps = {}
) => {
  /*
  const{
    userId = "",
    courseId = "",
    motivationalNote = "",
    status = "PENDING",
  } = props;
  */

  const { apiClient: api } = useApiClient();
  const snack = useSnack();
  const queryClient = useQueryClient();

  const getRequest = null;

  const getCourseRequest = null;

  const getStatusRequest = null;

  return { getRequest, getCourseRequest, getStatusRequest };
};
