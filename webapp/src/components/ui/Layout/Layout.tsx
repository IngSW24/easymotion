import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useLocation } from "react-router";
import { Button, ThemeProvider } from "@mui/material";
import { Link } from "react-router";
import { physiotherapistTheme, userTheme } from "../../../theme/theme";

export type MenuEntry = {
  label: string;
  link: string;
};

export interface LayoutProps {
  isPhysiotherapist?: boolean;
  entries?: MenuEntry[];
}

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

export default function Layout(props: LayoutProps) {
  const location = useLocation();
  const { isPhysiotherapist = false, entries = [] } = props;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        EasyMotion
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
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
              variant="h6"
              component="span"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              EasyMotion
              {isPhysiotherapist && (
                <Typography component="span" sx={{ color: "#fff", ml: 3 }}>
                  Fisioterapista
                </Typography>
              )}
            </Typography>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {entries.map((item) => (
                <Button
                  component={Link}
                  key={item.link}
                  sx={{ color: "#fff" }}
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
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
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
