import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React from "react";
import { useCourses } from "../../hooks/useCourses";
import { text } from "stream/consumers";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export interface CourseDetailProps {
  courseId?: string;
}

export default function SubscriptionRequest(props: CourseDetailProps) {
  const { courseId } = props;

  const courseRepo = useCourses({ fetchId: courseId }); //Get the course with the id

  /*Open-Close the Modal */
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /* Variables for the TextField */
  const maxLength = 250;
  const [textLetter, setTextLetter] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxLength) {
      setTextLetter(e.target.value);
    }
  };

  /*Management of the subscription request */
  const [requestDone, setRequestDone] = React.useState(false);

  const sendRequest = () => {
    //TODO: save the request in a table
    setRequestDone(true);
  };

  const deleteRequest = () => {
    //TODO: delete the request saved in a table
    setRequestDone(false);
    setTextLetter("");
  };

  return (
    <>
      <Button onClick={handleOpen}>Subscription Request</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography
            variant="h4"
            color="primary.dark"
            fontWeight="bold"
            mb={3}
          >
            Richiesta d'iscrizione al corso "{courseRepo.getSingle.data?.name}"
          </Typography>
          <Box mb={3}>
            <Typography>
              Istruttori: {courseRepo.getSingle.data?.instructors}
            </Typography>
            <Typography>
              Posizione: {courseRepo.getSingle.data?.location}
            </Typography>
            <Typography>
              Costo (€): {courseRepo.getSingle.data?.cost}
            </Typography>
            <Typography>
              Categoria: {courseRepo.getSingle.data?.category}
            </Typography>
            <Typography>Livello: {courseRepo.getSingle.data?.level}</Typography>
            <Typography>
              Numero di partecipanti:{" "}
              {courseRepo.getSingle.data?.num_registered_members} /{" "}
              {courseRepo.getSingle.data?.members_capacity}
            </Typography>
          </Box>
          <Box mb={3}>
            {courseRepo.getSingle.data?.availability ? (
              <Typography>
                Stato:
                <Typography color="green">ISCRIZIONI APERTE</Typography>{" "}
              </Typography>
            ) : (
              <Typography>
                Stato:
                <Typography color="error">ISCRIZIONI CHIUSE</Typography>{" "}
              </Typography>
            )}
          </Box>

          <Typography mb={3}>
            Usa lo spazio qui in basso per scrivere una "lettera di motivazione"
            per scrivere i motivi per partecipare a questo corso
          </Typography>

          <Box mb={3}>
            <Typography>Motivazioni a partecipare</Typography>
            <TextField
              fullWidth
              multiline
              type="text"
              name="motivation to participate"
              value={textLetter}
              onChange={handleChange}
              rows={4}
              disabled={requestDone}
            />
            <Typography>
              {textLetter.length} / {maxLength}
            </Typography>
          </Box>

          {requestDone ? (
            <Button
              variant="contained"
              color="error"
              sx={{ fontSize: 20 }}
              onClick={deleteRequest}
            >
              Cancella la richiesta
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ fontSize: 20 }}
              onClick={sendRequest}
            >
              Invia la richiesta
            </Button>
          )}
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
    </>
  );

  //Link con istruzioni su come usare Modal (Popup overlay): https://mui.com/material-ui/react-modal/?srsltid=AfmBOooX7xJ4MW01JyLwJM9_A0U9KWfhmiU9nQx48ZjwuWXV9c-oj-tN
}
