import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Logout, Settings } from "@mui/icons-material";

export default function ProfileButton() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const profileButtonActions = [
    {
      label: "Impostazioni",
      icon: <Settings />,
      action: () => navigate("/profile"),
    },
    {
      label: "Logout",
      icon: <Logout />,
      action: () => auth.logout(),
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
          {profileButtonActions.map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                action.action();
                handleCloseUserMenu();
              }}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {action.icon}
              </Box>
              <Typography component="div" variant="body1">
                {action.label}
              </Typography>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
}
