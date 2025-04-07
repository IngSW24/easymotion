import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ProfileButton from "../ProfileButton";

export default function UserHeader() {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar>
        {/* Your dashboard-specific header content */}
        <Typography variant="h6" noWrap component="div">
          User Header
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <ProfileButton /> {/* Assuming you always want this in dashboards */}
      </Toolbar>
    </AppBar>
  );
}
