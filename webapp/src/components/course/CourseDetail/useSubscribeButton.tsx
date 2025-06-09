import { useAuth } from "@easymotion/auth-context";
import { useEffect, useMemo, useState } from "react";
import useSubscriptions from "../../../hooks/useSubscription";
import { CourseDto } from "@easymotion/openapi";

export interface UseSubscribeButtonProps {
  course: CourseDto;
}

export const useSubscribeButton = ({ course }: UseSubscribeButtonProps) => {
  const [subscribed, setSubscribed] = useState(false);
  const { isAuthenticated, isPhysiotherapist } = useAuth();

  const { getUserSubscriptions, getUserPendingSubscriptions } =
    useSubscriptions({});

  useEffect(() => {
    if (!course.id) return;

    const approvedSubscriptions = getUserSubscriptions.data?.data || [];
    const pendingSubscriptions = getUserPendingSubscriptions.data?.data || [];

    const allSubscriptions = [
      ...approvedSubscriptions,
      ...pendingSubscriptions,
    ];

    const alreadySubscribed = allSubscriptions.some(
      (sub) => sub.course.id === course.id
    );

    setSubscribed(alreadySubscribed);
  }, [getUserSubscriptions.data, getUserPendingSubscriptions.data, course.id]);

  const isHidden = useMemo(
    () => !isAuthenticated || isPhysiotherapist,
    [isAuthenticated, isPhysiotherapist]
  );

  const isDisabled = useMemo(
    () => !isHidden && !course.subscriptionsOpen,
    [course.subscriptionsOpen, isHidden]
  );

  return {
    subscribed,
    isDisabled,
    isHidden,
  };
};
