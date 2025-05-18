import { IconButton, Tooltip } from "@mui/material";
import useSubscriptions from "../../hooks/useSubscription";
import React from "react";
import { Delete } from "@mui/icons-material";
import { useDialog } from "../../hooks/useDialog";

/*
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  border: "4px solid #000",
  justifyContent: "center",
  alignItems: "center",
  maxHeight: "calc(100vh)", // 80% of the viewport height minus padding
  overflowY: "auto", // enables vertical scrolling
};
*/

export interface SubscriberDetailsProps {
  userId?: string;
  courseId?: string;
  userFirstName: string;
  userMiddleName: string;
  userLastName: string;
}

export default function DeleteSubscribedUser(props: SubscriberDetailsProps) {
  const { userId, courseId, userFirstName, userMiddleName, userLastName } =
    props;

  const deleteDialog = useDialog();

  const { unsubscribe } = useSubscriptions({
    courseId,
    userId,
  });

  const [, setOpen] = React.useState(false);
  //const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const unsubscribeUser = async () => {
    const result = await deleteDialog.showConfirmationDialog({
      title: "Cancellazione dell'iscrizione",
      content:
        userMiddleName === ""
          ? "Sei sicuro di voler disiscrivere dal corso il paziente " +
            userFirstName +
            " " +
            userLastName
          : "Sei sicuro di voler disiscrivere dal corso il paziente " +
            userFirstName +
            " " +
            userMiddleName +
            " " +
            userLastName,
      confirmText: "Disiscrivi paziente",
    });

    if (result) {
      unsubscribe.mutateAsync({
        course_id: courseId || "",
        patient_id: userId || "",
      });
      handleClose();
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

/*
ALTERNATIVA COL Modal:

  return (
    <>
      <Tooltip title="Cancella iscrizione">
        <IconButton onClick={handleOpen} color="error">
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <>
            <Box mb={5}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
                Cancella iscrizione
              </Typography>
            </Box>
            <Box mb={5}>
              <Typography variant="body1" align="center">
                Sei sicuro di voler disiscrivere dal corso il paziente:{" "}
                {userFirstName} {userMiddleName} {userLastName}
              </Typography>
            </Box>

            <Stack
              direction={"row"}
              spacing={2}
              sx={{ justifyContent: "right", marginTop: 3 }}
            >
              <Button variant="contained" onClick={unsubscribeUser}>
                Cancella paziente
              </Button>
              <Button variant="outlined" color="error" onClick={handleClose}>
                Annulla
              </Button>
            </Stack>
          </>
        </Box>
      </Modal>
    </>

*/
