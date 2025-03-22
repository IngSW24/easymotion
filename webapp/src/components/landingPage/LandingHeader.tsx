import { Box, Button, Container, Typography } from "@mui/material";

export default function LandingHeader() {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: 'url("hero2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        height: { xs: "55vh", sm: "55vh", md: "65vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Semi-transparent dark overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.60)",
          zIndex: 1,
        }}
      />
      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "start",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Fisioterapia professionale e guida all'allenamento
        </Typography>
        <Typography variant="h6" sx={{ my: 3 }}>
          Soluzioni di fitness ottimizzate e personalizzate per te.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Inizia qui
        </Button>
      </Container>
    </Box>
  );
}
