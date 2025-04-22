import {
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useCourses } from "../../../hooks/useCourses";
import { CheckCircleOutline, Email } from "@mui/icons-material";
import useSubscriptions from "../../../hooks/useSubscription";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

export interface CourseDetailProps {
  courseId?: string;
  userId?: string;
  open: boolean;
  setOpen: (s: boolean) => void;
}

export default function SubscriptionRequest(props: CourseDetailProps) {
  const { courseId, userId, open, setOpen } = props;

  const courseRepo = useCourses({ fetchId: courseId });
  const { request2Subscribe } = useSubscriptions({ courseId, userId });

  const [isReqSended, setIsReqSended] = useState(false);

  /* Variables for the TextField */
  const maxLength = 250;
  const [textLetter, setTextLetter] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxLength) {
      setTextLetter(e.target.value);
    }
  };

  const handleSubscriptionRequest = async () => {
    request2Subscribe.mutateAsync({
      course_id: courseId || "",
      patient_id: userId || "",
      subscriptionRequestMessage: textLetter,
    });
    setIsReqSended(true);
  };

  return (
    <Modal open={open} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        {isReqSended ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CheckCircleOutline
                color="success"
                sx={{ fontSize: 40, mr: 2 }}
              />
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
                Richiesta inviata con successo!
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Riceverai una notifica via email quando il fisioterapista
              confermerà la tua ammissione al corso.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Email color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Non vuoi più partecipare? Invia una mail a{" "}
                <b>contact@easymotion.it</b>
              </Typography>
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(false)}
                sx={{ minWidth: 120 }}
              >
                Chiudi
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              color="primary.dark"
              fontWeight="bold"
              mb={3}
            >
              Richiesta d'iscrizione al corso {courseRepo.getSingle.data?.name}
            </Typography>
            <Box mb={3}>
              <Typography fontWeight="bold" sx={{ fontSize: 20 }}>
                Stato iscrizioni
                {courseRepo.getSingle.data?.subscriptions_open ? (
                  <Typography color="green">APERTE</Typography>
                ) : (
                  <Typography color="error">CHIUSE</Typography>
                )}
              </Typography>
            </Box>
            <Box mb={3}>
              <Typography fontWeight="bold" sx={{ fontSize: 20 }}>
                Note aggiuntive *
              </Typography>
              <Typography marginBottom={3}>
                Scrivi qui la tua lettera di motivazione indicando i motivi per
                cui desideri partecipare a questo corso!
              </Typography>
              <TextField
                fullWidth
                multiline
                type="text"
                name="motivation to participate"
                value={textLetter}
                onChange={handleChange}
                rows={4}
              />
              <Typography>
                {textLetter.length} / {maxLength}
              </Typography>
            </Box>
            <Typography color="text.secondary" fontSize={13}>
              * I campi contrassegnati da asterisco sono abbligatori
            </Typography>
            <Stack
              direction={"row"}
              spacing={2}
              sx={{ justifyContent: "right", marginTop: 3 }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen(false)}
              >
                Annulla
              </Button>
              <Button
                variant="contained"
                onClick={handleSubscriptionRequest}
                disabled={textLetter.length <= 5}
              >
                Invia richiesta
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
}
