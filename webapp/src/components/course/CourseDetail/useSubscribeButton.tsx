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
    if (!course.id || !user?.id) return;
    subscribe.mutate(
      {
        course_id: course.id,
        patient_id: user!.id,
        subscriptionRequestMessage: "",
      },
      {
        onSuccess: () => {
          setSubscribed(true);
        },
      }
    );
  }, [course.id, subscribe, user]);

  const handleUnsubscribe = useCallback(() => {
    if (!course.id || !user?.id) return;
    unSubscribe.mutate(
      { course_id: course.id, patient_id: user!.id },
      {
        onSuccess: () => {
          setSubscribed(false);
        },
      }
    );
  }, [course.id, unSubscribe, user]);

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
