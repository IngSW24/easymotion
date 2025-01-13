import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useLocation } from "react-router";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
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
import { physiotherapistTheme, userTheme } from "../../theme/theme";

export type MenuEntry = {
  label: string;
  link: string;
  icon?: React.ReactNode;
};

export interface LayoutProps {
  isPhysiotherapist?: boolean;
  entries?: MenuEntry[];
  homeLink?: string;
}

const drawerWidth = 240;

export default function Layout(props: LayoutProps) {
  const location = useLocation();
  const { isPhysiotherapist = false, entries = [], homeLink = "/" } = props;

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
    <ThemeProvider theme={isPhysiotherapist ? physiotherapistTheme : userTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav" sx={{ backgroundColor: "primary.main" }}>
          <Toolbar>
            <IconButton
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
                mx: 2,
                display: { sm: "none" },
                color: "inherit",
                textDecoration: "none",
              }}
              to={homeLink}
            >
              EasyMotion
            </Typography>
            {isPhysiotherapist && (
              <Typography
                component="span"
                sx={{ ml: 3, display: { sm: "none" } }}
              >
                Fisioterapista
              </Typography>
            )}
            <Typography
              variant="h6"
              component={Link}
              sx={{
                display: { xs: "none", sm: "block" },
                color: "inherit",
                textDecoration: "none",
              }}
              to={homeLink}
            >
              EasyMotion
            </Typography>
            {isPhysiotherapist && (
              <Typography
                component="span"
                sx={{ ml: 3, display: { xs: "none", sm: "block" } }}
                fontWeight={300}
              >
                Fisioterapista
              </Typography>
            )}

            <Box
              sx={{
                flexGrow: 1,
              }}
            />

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
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
