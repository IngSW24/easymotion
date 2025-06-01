import { Info } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

import { usePatientProfile } from "../../hooks/usePatientProfile";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getStaticImageUrl } from "../../utils/format";

const modalStyle: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%", md: "80%" },
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  overflow: "auto",
};

const sectionStyle: SxProps = {
  p: 3,
  mb: 3,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

const sectionTitleStyle: SxProps = {
  color: "primary.main",
  fontWeight: 600,
  mb: 3,
  fontSize: { xs: "1.1rem", sm: "1.25rem" },
};

const fieldLabelStyle: SxProps = {
  fontWeight: 600,
  color: "text.secondary",
};

const fieldValueStyle: SxProps = {
  color: "text.primary",
};

const missingDataStyle: SxProps = {
  fontStyle: "italic",
  color: "error.main",
};

export interface PatientDetailsProps {
  patientId: string;
}

export default function ViewPatientMedicalHistory(props: PatientDetailsProps) {
  const { patientId } = props;
  const { data, isLoading, isError } = usePatientProfile(patientId || "");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data)
    return <Typography>Si è verificato un errore</Typography>;

  const renderField = (
    label: string,
    value: string | number | null | undefined
  ) => (
    <Typography variant="body1" sx={{ mb: 2 }}>
      <Box component="span" sx={fieldLabelStyle}>
        {label}:
      </Box>{" "}
      {!value ? (
        <Box component="span" sx={missingDataStyle}>
          dato mancante
        </Box>
      ) : (
        <Box component="span" sx={fieldValueStyle}>
          {value}
        </Box>
      )}
    </Typography>
  );

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
        <Box sx={modalStyle}>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 4, color: "primary.main", fontWeight: 600 }}
            >
              Anamnesi del paziente
            </Typography>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Dati anagrafici
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                    }}
                  >
                    <Avatar
                      src={
                        data.data.picturePath
                          ? getStaticImageUrl(data.data.picturePath)
                          : undefined
                      }
                      sx={{
                        width: { xs: 120, sm: 160 },
                        height: { xs: 120, sm: 160 },
                        fontSize: { xs: "2.5rem", sm: "3rem" },
                        bgcolor: "primary.main",
                        boxShadow: 3,
                      }}
                    >
                      {data.data.firstName.charAt(0).toUpperCase()}
                      {data.data.lastName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", fontWeight: 600 }}
                    >
                      {data.data.firstName} {data.data.lastName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2}>
                    {renderField("Nome", data.data.firstName)}
                    {data.data.middleName &&
                      renderField("Secondo nome", data.data.middleName)}
                    {renderField("Cognome", data.data.lastName)}
                    {renderField("Email", data.data.email)}
                    {renderField("Numero di telefono", data.data.phoneNumber)}
                    {renderField("Data di nascita", data.data.birthDate)}
                    {renderField("Professione", data.data.profession)}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Dati di sistema
              </Typography>
              <Stack spacing={2}>
                {renderField("ID Utente", data.data.userId)}
                {renderField(
                  "Data ultimo accesso",
                  data.data.lastLogin
                    ? `${new Date(data.data.lastLogin).toLocaleDateString()} alle ore ${new Date(
                        data.data.lastLogin
                      ).toLocaleTimeString()}`
                    : null
                )}
                {renderField(
                  "Data di creazione del profilo",
                  data.data.createdAt
                    ? `${new Date(data.data.createdAt).toLocaleDateString()} alle ore ${new Date(
                        data.data.createdAt
                      ).toLocaleTimeString()}`
                    : null
                )}
              </Stack>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Caratteristiche fisiche
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Altezza (in cm)", data.data.height)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    "Sesso",
                    data.data.sex === "FEMALE"
                      ? "FEMMINA"
                      : data.data.sex === "MALE"
                        ? "MASCHIO"
                        : "ALTRO"
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Peso (in kg)", data.data.weight)}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Dipendenze
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Fumatore", data.data.smoker ? "Sì" : "No")}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Consumo di alcol", data.data.alcoholUnits)}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Attività fisiche
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    "Livello di attività",
                    data.data.activityLevel === "LOW"
                      ? "BASSO"
                      : data.data.activityLevel === "MEDIUM"
                        ? "MEDIO"
                        : "ALTO"
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    "Livello di mobilità",
                    data.data.mobilityLevel === "LIMITED"
                      ? "LIMITATO"
                      : data.data.mobilityLevel === "MODERATE"
                        ? "MODERATO"
                        : "MASSIMO"
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Sport", data.data.sport)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Frequenza di sport", data.data.sportFrequency)}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Dati cardiaci
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    "Resting heart rate",
                    data.data.restingHeartRate
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Pressione del sangue", data.data.bloodPressure)}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Patologie
              </Typography>
              <Stack spacing={2}>
                {renderField("Allergie", data.data.allergies)}
                {renderField("Altre patologie", data.data.otherPathologies)}
              </Stack>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Medicinali e checkup medico
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Farmaci in uso", data.data.medications)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    "Data ultimo checkup",
                    data.data.lastMedicalCheckup
                  )}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Tempo di riposo e livello di stress
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField("Ore di riposo", data.data.sleepHours)}
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Obiettivi personali del paziente
              </Typography>
              <Typography variant="body1" sx={fieldValueStyle}>
                {data.data.personalGoals || (
                  <Box component="span" sx={missingDataStyle}>
                    dato mancante
                  </Box>
                )}
              </Typography>
            </Paper>

            <Paper sx={sectionStyle}>
              <Typography variant="h6" sx={sectionTitleStyle}>
                Note
              </Typography>
              <Typography variant="body1" sx={fieldValueStyle}>
                {data.data.notes || (
                  <Box component="span" sx={missingDataStyle}>
                    dato mancante
                  </Box>
                )}
              </Typography>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Chiudi
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
