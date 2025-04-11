import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ContactUsForm from "./ContactUsForm";
import {
  Email,
  Facebook,
  Instagram,
  LinkedIn,
  LocationCity,
  PhonelinkLockOutlined,
  Twitter,
} from "@mui/icons-material";
import { Link } from "react-router";

export default function LandingContactUsSection() {
  return (
    <Box sx={{ py: 6, backgroundColor: "#f7f9fc" }}>
      <Container maxWidth="lg" sx={{ padding: 0, px: { xs: 0 } }}>
        <Grid container alignItems="center" justifyContent={"space-between"}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ContactUsForm />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ px: 5 }} pt={{ xs: 5, md: 0 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                Contatti
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationCity
                  sx={{ color: "#0a4b87", mr: 1.5, fontSize: 24 }}
                />
                <Typography variant="body1" color="text.primary">
                  123 Via della Faula, Udine, 33100
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhonelinkLockOutlined
                  sx={{ color: "#0a4b87", mr: 1.5, fontSize: 24 }}
                />
                <Link to={"tel:+12345678900"} color="text.primary">
                  +1 (234) 567-8900
                </Link>
              </Box>

              {/* Email */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Email sx={{ color: "#0a4b87", mr: 1.5, fontSize: 24 }} />
                <Link to="mailto:contact@easymotion.com" color="text.primary">
                  contact@easymotion.it
                </Link>
              </Box>

              {/* Follow Us */}
              <Typography
                mt={10}
                variant="h6"
                sx={{
                  fontWeight: 500,
                  mb: 1.5,
                  color: "text.primary",
                }}
              >
                Seguici sui social!
              </Typography>

              {/* Social Media Icons */}
              <Stack direction="row" spacing={1} alignItems={"flex-start"}>
                <IconButton
                  aria-label="Facebook"
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                  sx={{
                    color: "#0a4b87",
                    "&:hover": { bgcolor: "rgba(10, 75, 135, 0.1)" },
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  aria-label="Instagram"
                  component="a"
                  href="https://instagram.com"
                  target="_blank"
                  sx={{
                    color: "#0a4b87",
                    "&:hover": { bgcolor: "rgba(10, 75, 135, 0.1)" },
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  aria-label="Twitter"
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                  sx={{
                    color: "#0a4b87",
                    "&:hover": { bgcolor: "rgba(10, 75, 135, 0.1)" },
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  aria-label="LinkedIn"
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                  sx={{
                    color: "#0a4b87",
                    "&:hover": { bgcolor: "rgba(10, 75, 135, 0.1)" },
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
