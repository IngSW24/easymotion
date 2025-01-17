import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useLocation } from "react-router";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import { notLoggedTheme, userTheme } from "../../theme/theme";
import { Login, Logout, Person } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

type MenuEntry = {
  label: string;
  link: string;
  icon?: React.ReactNode;
};

const notLoggedMenuEntries: Array<MenuEntry> = [
  {
    label: "Login",
    link: "/login",
    icon: <Login />,
  },
  {
    label: "Register",
    link: "/register",
    icon: <Login />,
  },
];

const userMenuEntries: Array<MenuEntry> = [
  {
    label: "Logout",
    link: "/logout",
    icon: <Logout />,
  },
  {
    label: "Profile",
    link: "/profile",
    icon: <Person />,
  },
];

const drawerWidth = 240;

export default function Layout() {
  const location = useLocation();
  const auth = useAuth();
  const entries = auth.isAuthenticated ? userMenuEntries : notLoggedMenuEntries;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", width: drawerWidth }}
    >
      <List>
        {entries?.map((item) => (
          <ListItem key={item.link} disablePadding>
            <ListItemButton
              component={Link}
              sx={{ textAlign: "center" }}
              to={item.link}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={auth.isAuthenticated ? userTheme : notLoggedTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav" sx={{ backgroundColor: "primary.main" }}>
          <Toolbar>
            <IconButton // mobile-only
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              component={Link}
              variant="h6"
              sx={{
                color: "inherit",
                textDecoration: "none",
                flexGrow: 1,
              }}
              to="/"
            >
              EasyMotion
            </Typography>

            <Box
              sx={{ display: { xs: "none", sm: "block" } }} // desktop-only
            >
              {entries.map((item) => (
                <Button
                  component={Link}
                  key={item.link}
                  sx={{ color: "#fff" }}
                  startIcon={item.icon}
                  to={item.link}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
        <Box component="main" sx={{ width: "100%", mb: 3 }}>
          <Toolbar />
          <div className="fade" key={location.pathname}>
            <Outlet />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
