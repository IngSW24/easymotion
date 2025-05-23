import { Info } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useProfile } from "../../hooks/useProfile";

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

export interface PatientDetailsProps {
  patientId?: string;
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
}

export default function ViewPatientMedicalHistory(props: PatientDetailsProps) {
  const { patientId, patientFirstName, patientMiddleName, patientLastName } =
    props;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
                sx={{ fontWeight: "bold" }}
              >
                Anamnesi del paziente
              </Typography>
            </Box>

            <Grid>
              <Box mb={3}>
                <Typography variant="body1" align="left">
                  <b>Primo nome:</b> {patientFirstName}
                </Typography>
              </Box>
              <Box mb={3} hidden={patientMiddleName == ""}>
                <Typography variant="body1" align="left">
                  <b>Secondo nome:</b> {patientMiddleName}
                </Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="body1" align="left">
                  <b>Cognome:</b> {patientLastName}
                </Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="body1" align="left">
                  <b>Email:</b>
                </Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="body1" align="left">
                  <b>Numero di telefono:</b>
                </Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="body1" align="left">
                  <b>Data di nascita:</b>
                </Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="body1" align="left">
                  <b>Data ultimo accesso:</b>
                </Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="body1" align="left">
                  <b>Data di creazione del profilo:</b>
                </Typography>
              </Box>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Sesso:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Altezza (in cm):</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Peso (in kg):</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Fumatore:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Consumo di alcol:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Livello di attività:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Livello di mobilità:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Resting heart rate:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Pressione del sangue:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Professione:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Sport:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Frequenza di sport:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Medicazioni:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Allergie:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Altre patologie:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Zona del dolore:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Intensità del dolore:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Frequenza del dolore:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Caratteristiche del dolore:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Aspetti che cambiano l'intensità del dolore:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Ore di riposo:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Stress percepito:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Data ultimo checkup:</b>
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" align="left">
                  <b>Obiettivi personali:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid>
                <Typography variant="body1" align="left">
                  <b>Note:</b>
                </Typography>
              </Grid>
            </Grid>

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
