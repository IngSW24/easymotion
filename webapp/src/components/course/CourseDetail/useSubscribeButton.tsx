import { useAuth } from "@easymotion/auth-context";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSubscriptions from "../../../hooks/useSubscription";
import { CourseDto } from "@easymotion/openapi";

export interface UseSubscribeButtonProps {
  course: CourseDto;
}

export const useSubscribeButton = ({ course }: UseSubscribeButtonProps) => {
  const [subscribed, setSubscribed] = useState(false);
  const { user, isAuthenticated, isPhysiotherapist } = useAuth();

  const { subscribe, unSubscribe, getUserSubscriptions } = useSubscriptions({
    userId: user?.id,
    courseId: course.id,
  });

  useEffect(() => {
    if (!course.id) return;

    const subsData = getUserSubscriptions.data;
    if (!subsData) return;

    const alreadySubscribed = subsData.data.some(
      (sub) => sub.course.id === course.id
    );

    setSubscribed(alreadySubscribed);
  }, [getUserSubscriptions.data, course.id]);

  const handleSubscribe = useCallback(() => {
    if (!course.id) return;
    subscribe.mutate(
      { courseId: course.id },
      {
        onSuccess: () => {
          setSubscribed(true);
        },
      }
    );
  }, [course.id, subscribe]);

  const handleUnsubscribe = useCallback(() => {
    if (!course.id) return;
    unSubscribe.mutate(
      { courseId: course.id },
      {
        onSuccess: () => {
          setSubscribed(false);
        },
      }
    );
  }, [course.id, unSubscribe]);

  const isHidden = useMemo(
    () => !isAuthenticated || isPhysiotherapist,
    [isAuthenticated, isPhysiotherapist]
  );

  const isDisabled = useMemo(
    () => !isHidden && !course.subscriptions_open,
    [course.subscriptions_open, isHidden]
  );

  return {
    subscribed,
    handleSubscribe,
    handleUnsubscribe,
    isDisabled,
    isHidden,
  };
};
