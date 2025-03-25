import { Box, Button, Container, Typography } from "@mui/material";

/**
 * LandingHeader component displays the hero section of the landing page
 * with a background image, overlay, and call-to-action button.
 */
export default function LandingHeader() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        backgroundImage: 'url("/hero2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Hero section"
    >
      {/* Semi-transparent dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: { xs: "center", md: "start" },
          px: { xs: 3, sm: 4 },
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          sx={{
            mb: 3,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          Fisioterapia professionale e guida all&apos;allenamento
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 4,
            maxWidth: "600px",
          }}
        >
          Soluzioni di fitness ottimizzate e personalizzate per te.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          aria-label="Inizia qui"
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: 600,
          }}
          onClick={() => {
            document
              .getElementById("courses")!
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          Inizia qui
        </Button>
      </Container>
    </Box>
  );
}
