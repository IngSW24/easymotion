import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { GridCheckCircleIcon } from "@mui/x-data-grid";

const features = [
  "Formatori professionisti certificati",
  "Programmi di allenamento personalizzati",
  "Consultazione online disponibile",
];

export default function LandingWhoWeAreSection() {
  return (
    <Box sx={{ py: 6, backgroundColor: "#CAE2FC" }}>
      <Container maxWidth="lg" sx={{ padding: 0, px: { xs: 0 } }}>
        <Grid container alignItems="center" justifyContent={"center"}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                px: { xs: 5 },
              }}
            >
              <img
                src="who_we_are.png"
                alt="Who We Are"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "2px",
                  height: "auto",
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                textAlign: "left",
                px: { xs: 5 },
                pt: { xs: 5, md: 0 },
              }}
            >
              <Typography variant="h4" color="primary" gutterBottom>
                Chi siamo
              </Typography>
              <Typography>
                EasyMotion ti mette in contatto con fisioterapisti certificati
                ed esperti di fitness che hanno la passione di aiutarti a
                raggiungere i tuoi obiettivi di salute e fitness. La nostra
                piattaforma semplifica l'ottenimento di una guida professionale
                per la tua routine di allenamento o il tuo percorso di
                riabilitazione.
              </Typography>
              <List sx={{ pt: 5 }}>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ p: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <GridCheckCircleIcon color="#0d6efd" />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight: 500,
                          color: "#444",
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
