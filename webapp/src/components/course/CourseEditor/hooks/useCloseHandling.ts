import { useCallback } from "react";
import { EditCourse } from "../types";
import { useDialog } from "../../../../hooks/useDialog";

interface UseCloseHandlingProps {
  editCourse: EditCourse;
  onClose: () => void;
}

export const useCloseHandling = ({
  editCourse,
  onClose,
}: UseCloseHandlingProps) => {
  const confirm = useDialog();

  // Check if the form has any data that would be lost
  const hasUnsavedChanges = useCallback(() => {
    return (
      editCourse.title.trim() !== "" ||
      editCourse.shortDescription.trim() !== "" ||
      editCourse.description.trim() !== "" ||
      editCourse.location?.trim() !== "" ||
      editCourse.instructorName.trim() !== "" ||
      editCourse.sessions.length > 0 ||
      editCourse.tags.length > 0 ||
      !editCourse.isFree ||
      editCourse.price !== undefined ||
      editCourse.numPayments !== undefined ||
      editCourse.maxSubscribers !== null
    );
  }, [editCourse]);

  // Handle the close attempt
  const handleCloseAttempt = useCallback(async () => {
    if (!hasUnsavedChanges()) {
      onClose();
      return;
    }
    const result = await confirm.showConfirmationDialog({
      title: "Attenzione",
      content: "Le modifiche non salvate verranno perse",
      confirmText: "Prosegui",
      cancelText: "Annulla",
    });

    if (result) onClose();
  }, [confirm, hasUnsavedChanges, onClose]);

  return {
    handleCloseAttempt,
  };
};
