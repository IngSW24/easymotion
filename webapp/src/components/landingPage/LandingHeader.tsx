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
        backgroundImage: 'url("/hero.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        height: {
          xs: "calc(100svh - 56px)",
          sm: "calc(100svh - 64px)",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-label="Hero section"
    >
      {/* Semi-transparent dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Optional animated particles or shapes could go here for extra flair */}

      <Container
        maxWidth="lg"
        sx={{
          zIndex: 2,
          textAlign: "center",
          px: { xs: 3, sm: 4 },
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="EasyMotion Logo"
          sx={{
            mb: 3,
            width: "200px",
            height: "200px",
          }}
        />

        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 2,
            fontSize: { xs: "2.6rem", sm: "3.1rem" },
            textShadow: "2px 4px 8px rgba(0,0,0,0.3)",
            fontWeight: "bold",
          }}
        >
          EasyMotion
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 4,
            fontSize: { xs: "1.3rem", sm: "1.4rem" },
            textShadow: "1px 2px 6px rgba(0,0,0,0.3)",
            fontWeight: "light",
          }}
        >
          Fisioterapia professionale e guida all&apos;allenamento.
          <br /> Soluzioni di fitness ottimizzate e personalizzate per te.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          aria-label="Inizia qui"
          sx={{
            py: 1.5,
            px: 5,
            fontWeight: 600,
            fontSize: { xs: "1rem", sm: "1.125rem" },
            "&:hover": {
              transform: "scale(1.05)",
              animation: "pulsate 2s infinite",
              "@keyframes pulsate": {
                "0%": {
                  transform: "scale(1)",
                },
                "50%": {
                  transform: "scale(1.05)",
                },
                "100%": {
                  transform: "scale(1)",
                },
              },
            },
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
