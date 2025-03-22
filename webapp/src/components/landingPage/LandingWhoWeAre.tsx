import { Box, Container, Grid2, Typography } from "@mui/material";

export default function LandingWhoWeAreSection() {
  return (
    <Box sx={{ py: 6, backgroundColor: "#CAE2FC" }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={3} alignItems="center">
          <Grid2 columns={{ xs: 12, md: 6 }}>
            <img
              src="LandingWhoWheAre.png"
              alt="Who We Are"
              style={{ width: "50%", borderRadius: "8px" }}
            />
          </Grid2>
          <Grid2 columns={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Who We Are
              </Typography>
              <Typography>
                EasyMotion ti mette in contatto con fisioterapisti certificati
                ed esperti di fitness che hanno la passione di aiutarti a
                raggiungere i tuoi obiettivi di salute e fitness. La nostra
                piattaforma semplifica l'ottenimento di una guida professionale
                per la tua routine di allenamento o il tuo percorso di
                riabilitazione.
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
