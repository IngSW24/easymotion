import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import ProfileButton from "../ProfileButton";
import { useNavigate } from "react-router";

export default function UserHeader() {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "primary" }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Easymotion
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Cerca Corsi
          </Button>
          <ProfileButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
