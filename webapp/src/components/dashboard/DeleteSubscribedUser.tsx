import { IconButton, Tooltip } from "@mui/material";
import useSubscriptions from "../../hooks/useSubscription";
import { Delete } from "@mui/icons-material";
import { useDialog } from "../../hooks/useDialog";

export interface SubscriberDetailsProps {
  userId?: string; // TODO: can be null?
  courseId?: string;
  userFirstName: string;
  userMiddleName: string;
  userLastName: string;
}

// TODO: DeleteSubscribedUser can be a method name, not a component!
export default function DeleteSubscribedUser(props: SubscriberDetailsProps) {
  const { userId, courseId, userFirstName, userMiddleName, userLastName } =
    props;

  const deleteDialog = useDialog();

  const { unsubscribe } = useSubscriptions({
    courseId,
    userId,
  });

  const unsubscribeUser = async () => {
    const fullName = [userFirstName, userMiddleName, userLastName]
      .join(" ")
      .trim()
      .replace(/\s+/g, " ");

    const result = await deleteDialog.showConfirmationDialog({
      title: "Cancellazione dell'iscrizione",
      content: `Sei sicuro di voler disiscrivere dal corso il paziente ${fullName}`,
      confirmText: "Disiscrivi paziente",
    });

    if (result) {
      unsubscribe.mutateAsync({
        courseId: courseId || "",
        patientId: userId || "",
      });
    }
  };

  return (
    <Tooltip title="Cancella iscrizione">
      <IconButton onClick={unsubscribeUser} color="error">
        <Delete fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
