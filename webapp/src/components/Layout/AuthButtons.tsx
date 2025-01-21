import { Login, PersonAdd } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { Link } from "react-router";

export default function AuthButtons() {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Button
        variant="contained"
        component={Link}
        to="/signup"
        startIcon={<PersonAdd />}
        sx={{
          color: "#000",
          backgroundColor: "#fff",
          display: { xs: "none", md: "inherit" },
        }}
      >
        Registrati
      </Button>
      <Button
        variant="outlined"
        component={Link}
        to="/login"
        sx={{ color: "#fff" }}
        startIcon={<Login />}
      >
        Accedi
      </Button>
    </Box>
  );
}
