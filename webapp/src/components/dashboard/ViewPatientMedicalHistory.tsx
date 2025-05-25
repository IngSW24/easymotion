import { Info } from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { usePatientProfile } from "../../hooks/usePatientProfile";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getStaticImageUrl } from "../../utils/format";

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
  border: "4px solid #000",
  justifyContent: "center",
  alignItems: "center",
  maxHeight: "calc(100vh)", // 80% of the viewport height minus padding
  overflowY: "auto", // enables vertical scrolling
};

export interface PatientDetailsProps {
  patientId: string;
}

export default function ViewPatientMedicalHistory(props: PatientDetailsProps) {
  const { patientId } = props;

  const { data, isLoading, isError } = usePatientProfile(patientId || "");

  const [imageUrl, setImageUrl] = useState(
    getStaticImageUrl(data?.data.picturePath || "/hero.jpg")
  );

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isLoading) return <LoadingSpinner />;

  if (isError || !data)
    return <Typography>Si è verificato un errore</Typography>;

  return (
    <>
      <Tooltip title="Esamina cartella clinica del paziente">
        <IconButton color="info" onClick={handleOpen}>
          <Info fontSize="small" />
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
                sx={{ fontWeight: "bold", color: "#094D95" }}
              >
                Anamnesi del paziente
              </Typography>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Dati anagrafici
              </Typography>

              <Grid container spacing={2} mb={3}>
                <Grid mb={3} size={5}>
                  <CardMedia
                    sx={{
                      maxHeight: 360,
                      maxWidth: 360,
                      alignContent: "center",
                    }}
                    component="img"
                    image={imageUrl}
                    onError={() => setImageUrl("/hero.jpg")}
                  />
                </Grid>

                <Grid mb={3} size={7}>
                  <Box mb={3}>
                    <Typography variant="body1" align="left">
                      <b>Nome:</b>{" "}
                      {!data?.data.firstName ? (
                        <i style={{ fontStyle: "italic", color: "red" }}>
                          dato mancante
                        </i>
                      ) : (
                        <>{data?.data.firstName}</>
                      )}
                    </Typography>
                  </Box>

                  <Box
                    mb={3}
                    hidden={
                      data?.data.middleName == null ||
                      data?.data.middleName == undefined ||
                      data?.data.middleName == ""
                    }
                  >
                    <Typography variant="body1" align="left">
                      <b>Secondo nome:</b>{" "}
                      {!data?.data.middleName ? (
                        <i style={{ fontStyle: "italic", color: "red" }}>
                          dato mancante
                        </i>
                      ) : (
                        <>{data?.data.middleName}</>
                      )}
                    </Typography>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body1" align="left">
                      <b>Cognome:</b>{" "}
                      {!data?.data.lastName ? (
                        <i style={{ fontStyle: "italic", color: "red" }}>
                          dato mancante
                        </i>
                      ) : (
                        <>{data?.data.lastName}</>
                      )}
                    </Typography>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body1" align="left">
                      <b>Email:</b>{" "}
                      {!data?.data.email ? (
                        <i style={{ fontStyle: "italic", color: "red" }}>
                          dato mancante
                        </i>
                      ) : (
                        <>{data?.data.email}</>
                      )}
                    </Typography>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body1" align="left">
                      <b>Numero di telefono:</b>{" "}
                      {!data?.data.phoneNumber ? (
                        <i style={{ fontStyle: "italic", color: "red" }}>
                          dato mancante
                        </i>
                      ) : (
                        <>{data?.data.phoneNumber}</>
                      )}
                    </Typography>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body1" align="left">
                      <b>Data di nascita:</b>{" "}
                      {!data?.data.birthDate ? (
                        <i style={{ fontStyle: "italic", color: "red" }}>
                          dato mancante
                        </i>
                      ) : (
                        <>{data?.data.birthDate}</>
                      )}
                    </Typography>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body1" align="left">
                      <b>Professione:</b>{" "}
                      {!data?.data.profession ? (
                        <i style={{ fontStyle: "italic", color: "red" }}>
                          dato mancante
                        </i>
                      ) : (
                        <>{data?.data.profession}</>
                      )}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Dati di sistema
              </Typography>

              <Grid container spacing={2} mb={3}>
                <Grid size={12}>
                  <Typography variant="body1" align="left">
                    <b>ID Utente:</b>{" "}
                    {!data?.data.userId ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.userId}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" align="left">
                    <b>Data ultimo accesso:</b>{" "}
                    {!data?.data.lastLogin ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>
                        {new Date(data?.data.lastLogin).toLocaleDateString()}{" "}
                        alle ore{" "}
                        {new Date(data?.data.lastLogin).toLocaleTimeString()}
                      </>
                    )}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" align="left">
                    <b>Data di creazione del profilo:</b>{" "}
                    {!data?.data.createdAt ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>
                        {new Date(data?.data.createdAt).toLocaleDateString()}{" "}
                        alle ore{" "}
                        {new Date(data?.data.createdAt).toLocaleTimeString()}
                      </>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Caratteristiche fisiche
              </Typography>

              <Grid container spacing={2} mb={3}>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Altezza (in cm):</b>{" "}
                    {!data?.data.height ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.height}</>
                    )}
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Sesso:</b>{" "}
                    {!data?.data.sex ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>
                        {data?.data.sex == "FEMALE"
                          ? "FEMMINA"
                          : data?.data.sex == "MALE"
                            ? "MASCHIO"
                            : "ALTRO"}
                      </>
                    )}
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Peso (in kg):</b>{" "}
                    {!data?.data.weight ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.weight}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Dipendenze
              </Typography>

              <Grid container spacing={2} mb={3}>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Fumatore:</b>{" "}
                    {!data?.data.smoker ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.smoker ? "Sì" : "No"}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Consumo di alcol:</b>{" "}
                    {!data?.data.alcoholUnits ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.alcoholUnits}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Attività fisiche
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Livello di attività:</b>{" "}
                    {!data?.data.activityLevel ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>
                        {data?.data.activityLevel == "LOW"
                          ? "BASSO"
                          : data?.data.activityLevel == "MEDIUM"
                            ? "MEDIO"
                            : "ALTO"}
                      </>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Livello di mobilità:</b>{" "}
                    {!data?.data.mobilityLevel ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>
                        {data?.data.mobilityLevel == "LIMITED"
                          ? "LIMITATO"
                          : data?.data.mobilityLevel == "MODERATE"
                            ? "MODERATO"
                            : "MASSIMO"}
                      </>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Sport:</b>{" "}
                    {!data?.data.sport ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.sport}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Frequenza di sport:</b>{" "}
                    {!data?.data.sportFrequency ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.sportFrequency}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Dati cardiaci
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Resting heart rate:</b>{" "}
                    {!data?.data.restingHeartRate ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.restingHeartRate}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Pressione del sangue:</b>{" "}
                    {!data?.data.bloodPressure ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.bloodPressure}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Patologie
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid size={12}>
                  <Typography variant="body1" align="left">
                    <b>Allergie:</b>{" "}
                    {!data?.data.allergies ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.allergies}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" align="left">
                    <b>Altre patologie:</b>{" "}
                    {!data?.data.otherPathologies ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.otherPathologies}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Medicazioni
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Medicazioni:</b>{" "}
                    {!data?.data.medications ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.medications}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Zona del dolore:</b>{" "}
                    {!data?.data.painZone ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.painZone}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Intensità del dolore:</b>{" "}
                    {!data?.data.painIntensity ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.painIntensity}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Frequenza del dolore:</b>{" "}
                    {!data?.data.painFrequency ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.painFrequency}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Caratteristiche del dolore:</b>{" "}
                    {!data?.data.painCharacteristics ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.painCharacteristics}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Data ultimo checkup:</b>{" "}
                    {!data?.data.lastMedicalCheckup ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.lastMedicalCheckup}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" align="left">
                    <b>Aspetti che cambiano l'intensità del dolore:</b>{" "}
                    {!data?.data.painModifiers ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.painModifiers}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Tempo di riposo e livello di stress
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Ore di riposo:</b>{" "}
                    {!data?.data.sleepHours ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.sleepHours}</>
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    <b>Stress percepito:</b>{" "}
                    {!data?.data.perceivedStress ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.perceivedStress}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Obiettivi personali del paziente
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid size={6}>
                  <Typography variant="body1" align="left">
                    {!data?.data.personalGoals ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.personalGoals}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={2} border={2} borderRadius={4} padding="20px">
              <Typography
                variant="h6"
                component="h6"
                sx={{ fontWeight: "bold", color: "blue" }}
                mb={3}
              >
                Note
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid>
                  <Typography variant="body1" align="left">
                    {!data?.data.notes ? (
                      <i style={{ fontStyle: "italic", color: "red" }}>
                        dato mancante
                      </i>
                    ) : (
                      <>{data?.data.notes}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Stack
              direction={"row"}
              spacing={2}
              sx={{ justifyContent: "right", marginTop: 3 }}
            >
              <Button variant="contained" onClick={handleClose}>
                Chiudi
              </Button>
            </Stack>
          </>
        </Box>
      </Modal>
    </>
  );
}
