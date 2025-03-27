import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
} from "@mui/material";

export default function ContactUsForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Box mb={3}>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Nome e cognome
            </Typography>
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <Box mb={3}>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <Box mb={3}>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Messaggio
            </Typography>
            <TextField
              fullWidth
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              bgcolor: "#0a4b87",
              "&:hover": {
                bgcolor: "#083b6d",
              },
              borderRadius: 1,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Invia messaggio
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
