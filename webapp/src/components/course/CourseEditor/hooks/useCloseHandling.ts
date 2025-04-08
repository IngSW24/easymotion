import { useState, useCallback } from "react";
import { EditCourse } from "../types";

interface UseCloseHandlingProps {
  editCourse: EditCourse;
  onClose: () => void;
}

export const useCloseHandling = ({
  editCourse,
  onClose,
}: UseCloseHandlingProps) => {
  const [confirmClose, setConfirmClose] = useState(false);

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
  const handleCloseAttempt = useCallback(() => {
    if (hasUnsavedChanges()) {
      setConfirmClose(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // Confirm discard changes
  const handleConfirmClose = useCallback(() => {
    setConfirmClose(false);
    onClose();
  }, [onClose]);

  // Cancel close attempt
  const handleCancelClose = useCallback(() => {
    setConfirmClose(false);
  }, []);

  return {
    confirmClose,
    handleCloseAttempt,
    handleConfirmClose,
    handleCancelClose,
  };
};
