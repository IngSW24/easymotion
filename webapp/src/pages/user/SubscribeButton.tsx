import { Delete } from "@mui/icons-material";
import { Button, CardActions } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@easymotion/auth-context";
import useSubscriptions from "../../hooks/useSubscription";

export default function SubscribeButton() {
  const [subscribed, setSubscribed] = useState(false);
  const { id: courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;
  const { subscribe, unSubscribe, getUserSubscriptions } = useSubscriptions({
    userId,
    courseId,
  });

  useEffect(() => {
    if (!courseId) return;

    const subsData = getUserSubscriptions.data;
    if (!subsData) return;

    const alreadySubscribed = subsData.data.some(
      (sub) => sub.course.id === courseId
    );

    setSubscribed(alreadySubscribed);
  }, [getUserSubscriptions.data, courseId]);

  const handleSubscribe = () => {
    if (!courseId) return;
    subscribe.mutate(
      { courseId },
      {
        onSuccess: () => {
          setSubscribed(true);
        },
      }
    );
  };

  const handleUnsubscribe = () => {
    if (!courseId) return;
    unSubscribe.mutate(
      { courseId },
      {
        onSuccess: () => {
          setSubscribed(false);
        },
      }
    );
  };

  if (!isAuthenticated) return null;

  return (
    <CardActions sx={{ justifyContent: "right", paddingX: 2, fontSize: 20 }}>
      {subscribed ? (
        <Button
          startIcon={<Delete />}
          variant="contained"
          color="error"
          sx={{ fontSize: 15 }}
          onClick={handleUnsubscribe}
        >
          Annulla iscrizione
        </Button>
      ) : (
        <Button
          startIcon={<DoneIcon />}
          variant="contained"
          sx={{ fontSize: 20 }}
          onClick={handleSubscribe}
        >
          Iscriviti
        </Button>
      )}
    </CardActions>
  );
}
