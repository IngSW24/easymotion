import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
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
  numberSubscribers: number;
  startSubscriptionDate: number;
  endSubscriptionDate: Date;
  maxSubscribers: number;
  open: boolean;
  setOpen: (s: boolean) => void;
}

export default function SubscriptionRequest(props: CourseDetailProps) {
  const {
    courseId,
    userId,
    numberSubscribers,
    startSubscriptionDate,
    endSubscriptionDate,
    maxSubscribers,
    open,
    setOpen,
  } = props;

  const courseRepo = useCourses({ fetchId: courseId });
  const { request2Subscribe } = useSubscriptions({
    courseId,
    userId,
  });

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
      subscriptionRequestMessage: textLetter,
    });
    setIsReqSended(true);
  };

  /* Function for calculate the difference in milliseconds between subscription_start_date and subscription_end_date */

  const differenceBetweenDates = () => {
    const now = new Date(Date.now());
    const end = new Date(endSubscriptionDate);

    return end.getTime() - now.getTime();
  };

  /*Functions to calculate remaining time to subscribe to the course*/

  const differenceInDays = () => {
    return Math.ceil(differenceBetweenDates() / (1000 * 60 * 60 * 24));
  };

  const differenceInHours = () => {
    return Math.ceil(differenceBetweenDates() / (1000 * 60 * 60));
  };

  const differenceInMinutes = () => {
    return Math.ceil(differenceBetweenDates() / (1000 * 60));
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
        ) : Date.now() < startSubscriptionDate ? (
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
              <Typography fontSize={25} align="center">
                Le iscrizioni non sono ancora aperte.
              </Typography>
              <Typography fontSize={25} align="center">
                Sarà possibile iscriversi al corso a partire dal giorno{" "}
                {new Date(startSubscriptionDate).toLocaleDateString()} alle ore{" "}
                {new Date(startSubscriptionDate).toLocaleTimeString()}
              </Typography>
            </Box>

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
            </Stack>
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

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box mb={3}>
                  <Typography fontWeight="bold" sx={{ fontSize: 20 }}>
                    Stato iscrizioni
                  </Typography>
                  {courseRepo.getSingle.data?.subscriptions_open &&
                  differenceInMinutes() > 0 ? (
                    <Typography sx={{ color: "green" }}>APERTE</Typography>
                  ) : (
                    <Typography color="error">CHIUSE</Typography>
                  )}
                </Box>

                <Box mb={3}>
                  <Typography fontWeight="bold" sx={{ fontSize: 20 }}>
                    Le iscrizioni terminano il:
                  </Typography>
                  <Typography>
                    {endSubscriptionDate.toLocaleDateString()} alle{" "}
                    {endSubscriptionDate.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box mb={3}>
                  <Typography fontWeight="bold" sx={{ fontSize: 20 }}>
                    Numero di iscritti
                  </Typography>
                  {maxSubscribers == 0 ? (
                    <Typography color="green">{numberSubscribers}</Typography>
                  ) : numberSubscribers < maxSubscribers ? (
                    <Typography color="green">
                      {numberSubscribers} / {maxSubscribers}
                    </Typography>
                  ) : (
                    <Typography color="error">
                      {numberSubscribers} / {maxSubscribers}
                    </Typography>
                  )}
                </Box>

                <Box mb={3}>
                  <Typography fontWeight="bold" sx={{ fontSize: 20 }}>
                    Tempo rimanente per iscriversi
                  </Typography>
                  {differenceInDays() > 1 ? (
                    <Typography color="green">
                      Giorni rimasti per iscriversi: {differenceInDays()}
                    </Typography>
                  ) : differenceInHours() > 1 ? (
                    <Typography color="orange">
                      Ore rimaste per iscriversi: {differenceInHours()}
                    </Typography>
                  ) : differenceInMinutes() > 0 ? (
                    <Typography color="error">
                      Minuti rimasti per iscriversi: {differenceInMinutes()}
                    </Typography>
                  ) : (
                    <Typography color="error">
                      Tempo d'iscrizione scaduto
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            {(numberSubscribers < maxSubscribers || maxSubscribers == 0) &&
            differenceInMinutes() > 0 ? (
              <>
                <Box mb={3}>
                  <Typography fontWeight="bold" sx={{ fontSize: 20 }}>
                    Note aggiuntive *
                  </Typography>
                  <Typography marginBottom={3}>
                    Scrivi qui la tua lettera di motivazione indicando i motivi
                    per cui desideri partecipare a questo corso!
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
              </>
            ) : differenceInMinutes() <= 0 ? (
              <Typography color="error" fontSize={25} align="center">
                Spiacente il tempo d'iscrizione è scaduto e pertanto non è più
                possibile iscriversi a questo corso!
              </Typography>
            ) : (
              <Typography color="error" fontSize={25} align="center">
                Spiacente è stato raggiunto il numero massimo di partecipanti e
                pertanto non è più possibile iscriversi a questo corso!
              </Typography>
            )}
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

              {
                /* If maxSubscribers == 0 then there is no limit to the maximum number of people that can subscribe
              otherwise if maxSubscribers > 0 then there is a limit */
                maxSubscribers == 0 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubscriptionRequest}
                    disabled={
                      textLetter.length <= 5 || differenceInMinutes() <= 0
                    }
                  >
                    Invia richiesta
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubscriptionRequest}
                    disabled={
                      textLetter.length <= 5 ||
                      numberSubscribers >= maxSubscribers ||
                      differenceInMinutes() <= 0
                    }
                  >
                    Invia richiesta
                  </Button>
                )
              }
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
}
