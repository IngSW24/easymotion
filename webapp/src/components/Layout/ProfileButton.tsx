import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@easymotion/auth-context";
import MenuIcon from "@mui/icons-material/Menu";
import { Explore, Logout, Settings, SpaceDashboard } from "@mui/icons-material";
import { AuthUserDto } from "@easymotion/openapi";

type ProfileButtonActionProps = {
  label: string;
  icon: React.ReactNode;
  action: () => void | Promise<void>;
  targetRoles?: AuthUserDto["role"][];
};

export default function ProfileButton() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const isProfileButtonActionShowed = (
    role: string | undefined,
    allowedRoles: string[] | undefined
  ) => {
    if (!role || !allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(role);
  };

  const profileButtonActions: ProfileButtonActionProps[] = [
    {
      label: "Dashboard",
      icon: <SpaceDashboard />,
      action: () => navigate("/physiotherapist/dashboard"),
      targetRoles: ["PHYSIOTHERAPIST"],
    },
    {
      label: "I miei corsi",
      icon: <MenuIcon />,
      action: () => navigate("/user/my-courses"),
      targetRoles: ["USER"],
    },
    {
      label: "Scopri i corsi",
      icon: <Explore />,
      action: () => navigate("/discover"),
    },
    {
      label: "Impostazioni",
      icon: <Settings />,
      action: () => navigate("/profile"),
      targetRoles: [],
    },
    {
      label: "Logout",
      icon: <Logout />,
      action: () => auth.logout(),
      targetRoles: [],
    },
  ];

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (!auth.isAuthenticated) return <></>;

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Utente">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar>
            {auth.user?.firstName.charAt(0).toUpperCase()}
            {auth.user?.lastName.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          mt: "45px",
          "& .MuiPaper-root": {
            borderRadius: 3,
          },
        }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        disableScrollLock
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: "column",
          }}
        >
          {profileButtonActions.map(
            (item, index) =>
              isProfileButtonActionShowed(
                auth.user?.role,
                item.targetRoles
              ) && (
                <MenuItem
                  key={index}
                  onClick={() => {
                    item.action();
                    handleCloseUserMenu();
                  }}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {item.icon}
                  </Box>
                  <Typography component="div" variant="body1">
                    {item.label}
                  </Typography>
                </MenuItem>
              )
          )}
        </Box>
      </Menu>
    </Box>
  );
}
