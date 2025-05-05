import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ProfileButton from "../ProfileButton";
import { Link } from "react-router";
import { ReactNode } from "react";

interface PhysiotherapistAppBarProps {
  searchButton?: ReactNode;
}

export default function PhysiotherapistAppBar({
  searchButton,
}: PhysiotherapistAppBarProps) {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar>
        <Typography
          component={Link}
          variant="h6"
          sx={{ color: "inherit", textDecoration: "none" }}
          to="/"
        >
          EasyMotion
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {searchButton}
        <ProfileButton />
      </Toolbar>
    </AppBar>
  );
}
