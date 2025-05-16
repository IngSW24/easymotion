import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ProfileButton from "../ProfileButton";
import { ReactNode } from "react";

interface UserHeaderProps {
  searchButton?: ReactNode;
}

export default function UserHeader({ searchButton }: UserHeaderProps) {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar>
        {/* Your dashboard-specific header content */}
        <Typography variant="h6" noWrap component="div">
          EasyMotion
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {searchButton}
        <ProfileButton /> {/* Assuming you always want this in dashboards */}
      </Toolbar>
    </AppBar>
  );
}
