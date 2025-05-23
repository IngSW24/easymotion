import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
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
import { theme } from "../../theme/theme";
import { PersonAdd } from "@mui/icons-material";
import { useAuth } from "@easymotion/auth-context";
import { useState } from "react";
import ProfileButton from "./ProfileButton";
import AuthButtons from "./AuthButtons";
import { AuthUserDto } from "@easymotion/openapi";
import PhysiotherapistAppBar from "./headers/PhysiotherapistAppBar";
import UserHeader from "./headers/UserHeaders";
import SearchDialog from "../search/SearchDialog";
import { useHotkeys } from "react-hotkeys-hook";

export type MenuEntry = {
  label: string;
  link: string;
  icon?: React.ReactNode;
  role?: AuthUserDto["role"];
  showIn?: "drawer" | "appbar" | "both";
};

export interface LayoutProps {
  entries: MenuEntry[];
}

const drawerWidth = 240;

const getDrawerEntries = (
  entries: MenuEntry[],
  currentRole?: AuthUserDto["role"]
) => {
  return entries
    .filter((x) => !x.role || x.role === currentRole)
    .filter((x) => !x.showIn || x.showIn === "drawer" || x.showIn === "both");
};

const getAppbarEntries = (
  entries: MenuEntry[],
  currentRole?: AuthUserDto["role"]
) => {
  return entries
    .filter((x) => !x.role || x.role === currentRole)
    .filter((x) => !x.showIn || x.showIn === "appbar" || x.showIn === "both");
};

const SearchButton = ({ onClick }: { onClick: () => void }) => {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  useHotkeys(isMac ? "mod+k" : "mod+alt+k", onClick);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        mr: 2,
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <SearchIcon sx={{ fontSize: 20 }} />
      <Typography
        variant="body2"
        sx={{
          display: { xs: "none", sm: "block" },
          color: "inherit",
          opacity: 0.8,
          fontSize: "0.875rem",
          fontWeight: 500,
          letterSpacing: "0.5px",
        }}
      >
        {isMac ? "⌘K" : "Ctrl+Alt+K"}
      </Typography>
    </Box>
  );
};

export default function Layout(props: LayoutProps) {
  const { entries } = props;
  const location = useLocation();
  const auth = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentRole = auth.user?.role;

  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);
  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  const isPhysiotherapistArea = location.pathname.match("/(physiotherapist)/");
  const isUserArea = location.pathname.match("/(user)/");

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        width: drawerWidth,
        display: "flex",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <List>
        {getDrawerEntries(entries, currentRole).map((item) => (
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

      <Box sx={{ flexGrow: 1 }} />

      <List>
        <ListItemButton
          component={Link}
          to="/signup"
          sx={{ textAlign: "center" }}
        >
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Registrati" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav" sx={{ backgroundColor: "primary.main" }}>
          {/* Conditional headers rendering. */}
          {isPhysiotherapistArea ? (
            <PhysiotherapistAppBar
              searchButton={
                auth.isAuthenticated && (
                  <SearchButton onClick={handleSearchOpen} />
                )
              }
            />
          ) : isUserArea ? (
            <UserHeader
              searchButton={
                auth.isAuthenticated && (
                  <SearchButton onClick={handleSearchOpen} />
                )
              }
            />
          ) : (
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
                sx={{ color: "inherit", textDecoration: "none" }}
                to="/"
              >
                EasyMotion
              </Typography>

              <Box sx={{ display: { xs: "none", md: "block" }, ml: 4 }}>
                {entries &&
                  getAppbarEntries(entries, currentRole).map((item) => (
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

              <Box sx={{ flexGrow: 1 }} />

              {auth.isAuthenticated && (
                <SearchButton onClick={handleSearchOpen} />
              )}

              {auth.isAuthenticated ? <ProfileButton /> : <AuthButtons />}
            </Toolbar>
          )}
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
        <Box component="main" sx={{ width: "100%" }}>
          <Toolbar />
          <Outlet />
        </Box>

        <SearchDialog open={searchOpen} onClose={handleSearchClose} />
      </Box>
    </ThemeProvider>
  );
}
