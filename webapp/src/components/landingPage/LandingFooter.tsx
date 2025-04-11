import { Box, Container, Grid, Typography } from "@mui/material";
import { Link } from "react-router";

export default function LandingFooter() {
  return (
    <Box sx={{ py: 6, backgroundColor: "#042343" }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={6}
          alignItems="flex-start"
          justifyContent={"space-between"}
        >
          <Grid size={{ xs: 6, md: 3 }}>
            <img
              src="logo_monochromatic.png"
              alt="Logo monochromatic"
              style={{
                width: "50%",
                maxWidth: "500px",
                borderRadius: "2px",
                height: "auto",
              }}
            />
            <Typography color="#f7f9fc">
              Mettiti in contatto con fisioterapisti professionisti per
              migliorare la tua salute e la tua forma fisica.
            </Typography>
          </Grid>

          <Grid
            size={{ xs: 6, md: 3 }}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }} color="#ccc">
              Contact Info
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
              123 Via della Faula
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
              Udine, 33100
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
              Phone: +1 (234) 567-8900
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              Email: contact@easymotion.it
            </Typography>
          </Grid>

          <Grid
            size={{ xs: 6, md: 3 }}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }} color="#ccc">
              Quick Links
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Link to="#" style={{ color: "#ccc" }}>
                Courses
              </Link>
              <Link to="#" style={{ color: "#ccc" }}>
                About Us
              </Link>
              <Link to="#" style={{ color: "#ccc" }}>
                Contact
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
